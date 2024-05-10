import { getCategories, getProductBySlug } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/ProducForm';

interface Props {
  params: {
    slug: string;
  };
}

export default async function AdminProductPage({ params: { slug } }: Props) {
  const [product, { categories }] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product && slug !== 'new') redirect('/admin/products');

  const title =
    slug === 'new' ? 'New Product' : `Edit Product ${product?.title ?? ''}`;

  return (
    <>
      <Title title={title} />

      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
}
