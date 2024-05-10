'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderById = async (id: string) => {
  const session = await auth();
  if (!session) {
    return {
      ok: false,
      message: 'User not authenticated',
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error(`Order ${id} not found`);

    if (session.user.role === 'user') {
      if (session.user.id !== order.userId) {
        throw new Error(
          `Order ${id} does not belong to user ${session.user.id}`
        );
      }
    }

    return {
      ok: true,
      order,
    };
  } catch (error: any) {
    console.error(error);
    return {
      ok: false,
      message: `Error getting order by id - ${error.message}`,
    };
  }
};
