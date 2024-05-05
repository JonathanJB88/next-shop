import { notFound } from 'next/navigation';
import { initialData } from '@/seed';
import { Product, Category } from '@/interfaces';
import { ProductGrid, Title } from '@/components';

interface Props {
  params: {
    id: Category;
  };
}

const products: Product[] = initialData.products;

export default function CategoryPage({ params }: Props) {
  const { id } = params;

  const categoryProducts = products.filter((product) => product.gender === id);

  const labels: Record<Category, string> = {
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    unisex: 'Unisex',
  };

  return (
    <>
      <Title title={labels[id]} subtitle='Products' />

      <ProductGrid products={categoryProducts} />
    </>
  );
}
