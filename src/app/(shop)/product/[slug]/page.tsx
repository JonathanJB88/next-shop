import { notFound } from 'next/navigation';
import { initialData } from '@/seed';
import { Product } from '@/interfaces';
import { titleFont } from '@/config';
import {
  ProductMobileSlideshow,
  ProductSlideshow,
  QuantitySelector,
  SizeSelector,
} from '@/components';

interface Props {
  params: {
    slug: string;
  };
}

const products: Product[] = initialData.products;

export default function ProductPage({ params }: Props) {
  const { slug } = params;

  const product = products.find((prod) => prod.slug === slug);

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
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className='text-lg mb-5'>${product.price}</p>

        {/* Size selector */}
        <SizeSelector
          selectedSize={product.sizes[0]}
          availableSizes={product.sizes}
        />

        {/* Quantity selector */}
        <QuantitySelector quantity={2} />

        {/* Add Button */}
        <button className='btn-primary my-5'>Add to the cart</button>

        {/* Description */}
        <h3 className='font-bold mb-1'>Description</h3>
        <p className='font-light text-sm text-justify'>{product.description}</p>
      </div>
    </div>
  );
}
