'use server';

import { auth } from '@/auth.config';
import type { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  try {
    // Validate user session and get userId
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        ok: false,
        error: 'User not authenticated',
      };
    }

    // Get user cart items
    // Note: A user can take more than one product with the same id but different size
    const products = await prisma.product.findMany({
      where: { id: { in: productIds.map((item) => item.productId) } },
    });

    // Calculate mounts
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

    // Calculate subtotal, tax and total
    const { subTotal, tax, total } = productIds.reduce(
      (totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find((p) => p.id === item.productId);

        if (!product) throw new Error(`Product ${item.productId} not found`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;
      },
      { subTotal: 0, tax: 0, total: 0 }
    );

    // Create database order transaction

    const prismaTx = await prisma.$transaction(async (tx) => {
      // Update product stock
      const updatedProductsPromises = products.map((product) => {
        // Get product quantity
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((count, p) => count + p.quantity, 0);

        if (productQuantity === 0)
          throw new Error(`Product ${product.id} has no quantity defined`);

        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity // Not recommended
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      //Validate stock

      updatedProducts.forEach((product) => {
        if (product.inStock < 0)
          throw new Error(`${product.title} is out of stock`);
      });

      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,

          OrderItem: {
            createMany: {
              data: productIds.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                price:
                  products.find((p) => p.id === item.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      // Create order address
      const { country, ...restShippingAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restShippingAddress,
          countryId: country,
          orderId: order.id,
        },
      });

      return { order, orderAddress, updatedProducts };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error: any) {
    console.log({ error: `Error placing order ${error}` });
    return {
      ok: false,
      message: `Error placing order - ${error.message}`,
    };
  }
};
