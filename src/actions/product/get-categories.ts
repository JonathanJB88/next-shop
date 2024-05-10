'use server';

import prisma from '@/lib/prisma';
import { Category } from '@/interfaces';

export const getCategories = async (): Promise<{
  ok: boolean;
  message: string;
  categories: Category[];
}> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      ok: true,
      categories,
      message: 'Categories fetched successfully',
    };
  } catch (error: any) {
    console.log({ error: `Error getting categories - ${error}` });

    return {
      ok: false,
      categories: [],
      message: `Error getting categories - ${error.message}`,
    };
  }
};
