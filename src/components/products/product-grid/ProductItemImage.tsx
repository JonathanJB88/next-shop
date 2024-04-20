'use client';

import Image from 'next/image';
import { Product } from '@/interfaces';
import { useState } from 'react';

interface Props {
  product: Product;
}

export const ProductItemImage = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  return (
    <Image
      src={`/products/${displayImage}`}
      alt={product.title}
      className='w-full object-cover rounded transition-all'
      width={500}
      height={500}
      onMouseEnter={() => setDisplayImage(product.images[1])}
      onMouseLeave={() => setDisplayImage(product.images[0])}
    />
  );
};
