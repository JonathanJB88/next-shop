import Link from 'next/link';
import { ProductItemImage } from '@/components';
import { Product } from '@/interfaces';

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  return (
    <div className='rounded-md overflow-hidden fade-in'>
      <Link href={`/product/${product.slug}`}>
        <ProductItemImage product={product} />
      </Link>

      <div className='p-4 flex flex-col'>
        <Link className='hover:text-blue-800' href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className='font-bold'>${product.price}</span>
      </div>
    </div>
  );
};
