export const revalidate = 604800; // 7 days

import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { titleFont } from '@/config';
import {
  ProductMobileSlideshow,
  ProductSlideshow,
  StockLabel,
} from '@/components';
import { getProductBySlug } from '@/actions';
import { AddToCart } from './ui/AddToCart';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? '',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return (
    <div className='mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3'>
      {/* Slideshow */}
      <div className='col-span-1 md:col-span-2'>
        {/* Mobile */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className='block md:hidden'
        />

        {/* Desktop */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className='hidden md:block'
        />
      </div>

      {/* Details */}
      <div className='col-span-1 px-5'>
        <StockLabel slug={slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className='text-lg mb-5'>${product.price}</p>

        <AddToCart product={product} />

        {/* Description */}
        <h3 className='font-bold mb-1'>Description</h3>
        <p className='font-light text-sm text-justify'>{product.description}</p>
      </div>
    </div>
  );
}
