'use server';

import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import { z } from 'zod';
import { Gender, Product, Size } from '@prisma/client';
import prisma from '@/lib/prisma';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(',')),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const parsedProduct = productSchema.safeParse(data);

  if (!parsedProduct.success) {
    console.log(parsedProduct.error);
    return { ok: false, error: parsedProduct.error };
  }

  const product = parsedProduct.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim();

  const { id, ...rest } = product;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      const tagsArray = rest.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase());

      if (id) {
        // Update

        product = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: { set: rest.sizes as Size[] },
            tags: {
              set: tagsArray,
            },
          },
        });
      } else {
        // Create
        product = await tx.product.create({
          data: {
            ...rest,
            sizes: { set: rest.sizes as Size[] },
            tags: { set: tagsArray },
          },
        });
      }

      // Upload & Save images
      if (formData.getAll('images').length > 0) {
        const images = await uploadImages(formData.getAll('images') as File[]);
        if (!images?.length) {
          throw new Error('Error uploading images, rollback transaction');
        }

        await tx.productImage.createMany({
          data: images.map((urlImg) => ({
            url: urlImg!,
            productId: product.id,
          })),
        });
      }

      // const productsCount = await tx.product.count();
      // const productsGenderCount = await tx.product.count({
      //   where: { gender: product.gender },
      // });

      // const productPages = Math.ceil(productsCount / 12);
      // const productGenderPages = Math.ceil(productsGenderCount / 12);

      return {
        product,
        // productPages,
        //  productGenderPages
      };
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/product/${product.slug}`);
    revalidatePath(`/gender/${product.gender}`);
    revalidatePath(`/`);

    // for (let i = 1; i <= prismaTx.productPages; i++) {
    //   revalidatePath(`/?page=${i}`);
    // }

    // for (let i = 1; i <= prismaTx.productGenderPages; i++) {
    //   revalidatePath(`/gender?page=${i}`);
    // }

    return { ok: true, product: prismaTx.product };
  } catch (error: any) {
    console.log({ error: `Error creating/updating product ${error}` });

    return {
      ok: false,
      error: `Error creating/updating product - ${error.message}`,
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`, {
            folder: 'teslo-shop',
          })
          .then((r) => r.secure_url);
      } catch (error: any) {
        console.log({ error: `Error uploading image ${error}` });
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error: any) {
    console.log({ error: `Error uploading images ${error}` });
    return null;
  }
};
