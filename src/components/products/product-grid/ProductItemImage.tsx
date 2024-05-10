'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/components';
import { Product } from '@/interfaces';

interface Props {
  product: Product;
}

export const ProductItemImage = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  return (
    <ProductImage
      src={`${displayImage}`}
      alt={product.title}
      className='w-full object-cover rounded transition-all'
      width={500}
      height={500}
      onMouseEnter={() => setDisplayImage(product.images[1])}
      onMouseLeave={() => setDisplayImage(product.images[0])}
    />
  );
};
