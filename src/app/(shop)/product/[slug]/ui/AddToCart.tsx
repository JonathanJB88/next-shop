'use client';

import { useState } from 'react';
import { useCartStore } from '@/store';
import { QuantitySelector, SizeSelector } from '@/components';
import { CartProduct, Product, Size } from '@/interfaces';

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = () => {
    setAddedToCart(true);
    if (!size) return;
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      size,
      image: product.images[0],
    };
    addProductToCart(cartProduct);
    setAddedToCart(false);
    setSize(undefined);
    setQuantity(1);
  };

  return (
    <>
      {addedToCart && !size && (
        <span className='mt-2 text-red-500 fade-in'>
          A size is required to add the product to the cart.
        </span>
      )}

      {/* Size selector */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChange={setSize}
      />

      {/* Quantity selector */}
      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

      {/* Add Button */}
      <button onClick={addToCart} className='btn-primary my-5'>
        Add to the cart
      </button>
    </>
  );
};
