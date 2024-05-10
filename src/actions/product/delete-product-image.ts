'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith('http'))
    return {
      ok: false,
      message: 'Error deleting image - filesystem images cannot be deleted',
    };

  const imgName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

  try {
    await cloudinary.uploader.destroy(`teslo-shop/${imgName}`);
    const deletedImage = await prisma.productImage.delete({
      where: { id: imageId },
      select: { product: { select: { slug: true, gender: true } } },
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    revalidatePath(`/product/${deletedImage.product.slug}`);
    revalidatePath(`/gender/${deletedImage.product.gender}`);
    revalidatePath(`/`);

    return { ok: true, message: 'Image deleted successfully' };
  } catch (error: any) {
    console.log({
      error: `Error deleting image from cloud storage - ${error}`,
    });
    return {
      ok: false,
      message: `Error deleting image from cloud storage - ${error.message}`,
    };
  }
};
