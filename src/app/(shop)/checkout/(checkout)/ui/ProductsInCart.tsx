'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import { ProductImage } from '@/components';

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);

  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <h2>Loading...</h2>;

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className='flex mb-5'>
          <ProductImage
            src={product.image}
            width={100}
            height={100}
            alt={product.title}
            className='mr-5 rounded'
            style={{ width: '100px', height: '100px' }}
          />

          <div>
            <span>
              {product.size} - {product.title} ({product.quantity})
            </span>

            <p className='font-bold'>
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
