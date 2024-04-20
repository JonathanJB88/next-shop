import { ProductGrid, Title } from '@/components';
import { Product } from '@/interfaces';
import { initialData } from '@/seed';

const products: Product[] = initialData.products;

export default function Home() {
  return (
    <>
      <Title title='SHOP' subtitle='All Products' />

      <ProductGrid products={products} />
    </>
  );
}
