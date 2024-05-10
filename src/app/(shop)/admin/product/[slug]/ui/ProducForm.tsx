'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { createUpdateProduct, deleteProductImage } from '@/actions';
import { ProductImage } from '@/components';
import { Category, Product } from '@/interfaces';

type ProductImg = {
  id: number;
  url: string;
  productId?: string;
};

interface Props {
  product: Partial<Product> & { ProductImage?: ProductImg[] };
  categories: Category[];
}

interface FormInputs {
  name: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  categoryId: string;

  images?: FileList;
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      name: product.title,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });

  watch('sizes');

  const onSizeChanged = (size: string) => {
    const sizes = new Set(getValues('sizes'));

    sizes.has(size) ? sizes.delete(size) : sizes.add(size);

    setValue('sizes', Array.from(sizes));
  };

  const onSubmit = async (formInputs: FormInputs) => {
    const formData = new FormData();

    const { images, ...productToSave } = formInputs;

    if (product.id) formData.append('id', product.id);
    formData.append('title', productToSave.name);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.join(','));
    formData.append('tags', productToSave.tags);
    formData.append('gender', productToSave.gender);
    formData.append('categoryId', productToSave.categoryId);
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const { ok, product: newProduct } = await createUpdateProduct(formData);

    if (!ok) return;

    router.replace(`/admin/product/${newProduct?.slug}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3'
    >
      {/* Textos */}
      <div className='w-full'>
        <div className='flex flex-col mb-2'>
          <span>Name</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('name', { required: true })}
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Slug</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('slug', { required: true })}
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Description</span>
          <textarea
            rows={5}
            className='p-2 border rounded-md bg-gray-200'
            {...register('description', { required: true })}
          ></textarea>
        </div>

        <div className='flex flex-col mb-2'>
          <span>Price</span>
          <input
            type='number'
            className='p-2 border rounded-md bg-gray-200'
            {...register('price', { required: true, min: 0 })}
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Tags</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('tags', { required: true })}
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Gender</span>
          <select
            className='p-2 border rounded-md bg-gray-200'
            {...register('gender', { required: true })}
          >
            <option value=''>[Choose]</option>
            <option value='men'>Men</option>
            <option value='women'>Women</option>
            <option value='kid'>Kid</option>
            <option value='unisex'>Unisex</option>
          </select>
        </div>

        <div className='flex flex-col mb-2'>
          <span>Category</span>
          <select
            className='p-2 border rounded-md bg-gray-200'
            {...register('categoryId', { required: true })}
          >
            <option value=''>[Choose]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type='submit' className='btn-primary w-full'>
          Save
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className='w-full'>
        <div className='flex flex-col mb-2'>
          <span>Stock</span>
          <input
            type='number'
            className='p-2 border rounded-md bg-gray-200'
            {...register('inStock', { required: true, min: 0 })}
          />
        </div>

        {/* As checkboxes */}
        <div className='flex flex-col'>
          <span>Sizes</span>
          <div className='flex flex-wrap'>
            {sizes.map((size) => (
              <button
                type='button'
                key={size}
                onClick={() => onSizeChanged(size)}
                className={clsx(
                  'p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center',
                  {
                    'bg-blue-500 text-white': getValues('sizes').includes(size),
                  }
                )}
              >
                <span>{size}</span>
              </button>
            ))}
          </div>

          <div className='flex flex-col mb-2'>
            <span>Pictures</span>
            <input
              type='file'
              multiple
              className='p-2 border rounded-md bg-gray-200'
              accept='image/png, image/jpeg, image/jpg, image/webp, image/avif'
              {...register('images')}
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  src={image.url}
                  alt={product.title ?? 'Product'}
                  width={300}
                  height={300}
                  className='rounded-t shadow-md w-full h-96 md:h-52 object-cover'
                />

                <button
                  type='button'
                  onClick={() => deleteProductImage(image.id, image.url)}
                  className='btn-danger rounded-b-xl w-full'
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
