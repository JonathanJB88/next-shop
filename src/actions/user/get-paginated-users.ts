'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedUsers = async ({
  page = 1,
  take = 12,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  if (isNaN(Number(take))) take = 12;
  if (take < 1) take = 12;

  const session = await auth();

  if (!session?.user) return { ok: false, message: 'User not authenticated' };

  if (session.user.role !== 'admin')
    return { ok: false, message: 'User not authorized' };

  try {
    const users = await prisma.user.findMany({
      take,
      skip: (page - 1) * take,
      orderBy: {
        name: 'desc',
      },
    });

    const totalUsersCount = await prisma.user.count();
    const totalPages = Math.ceil(totalUsersCount / take);

    return { ok: true, totalPages, currentPage: page, users };
  } catch (error: any) {
    console.log({ error: `Error getting users ${error}` });

    return {
      ok: false,
      message: `Error getting users - ${error.message}`,
    };
  }
};
