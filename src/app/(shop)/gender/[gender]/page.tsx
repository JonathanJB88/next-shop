export const revalidate = 60; // 60 seconds

import { redirect } from 'next/navigation';
import { Gender } from '@/interfaces';
import { Pagination, ProductGrid, Title } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import { Metadata, ResolvingMetadata } from 'next';

interface Props {
  params: {
    gender: Gender;
  };

  searchParams: {
    page?: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { gender } = params;

  return {
    title: gender.charAt(0).toUpperCase() + gender.slice(1),
    description: `The best products for ${gender}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender,
  });

  if (products.length === 0) redirect(`/gender/${gender}`);

  const labels: Record<Gender, string> = {
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    unisex: 'Unisex',
  };

  return (
    <>
      <Title title={labels[gender]} subtitle='Products' />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
