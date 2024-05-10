'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedOrders = async ({
  page = 1,
  take = 12,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  if (isNaN(Number(take))) take = 12;
  if (take < 1) take = 12;

  const session = await auth();

  if (!session?.user) {
    return { ok: false, message: 'User not authenticated' };
  }

  if (session.user.role !== 'admin') {
    return { ok: false, message: 'User not authorized' };
  }

  try {
    const orders = await prisma.order.findMany({
      take,
      skip: (page - 1) * take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        OrderAddress: {
          select: {
            name: true,
            lastname: true,
          },
        },
      },
    });

    if (!orders.length) throw new Error('No orders found');

    const totalOrdersCount = await prisma.order.count();
    const totalPages = Math.ceil(totalOrdersCount / take);

    return { ok: true, totalPages, currentPage: page, orders };
  } catch (error: any) {
    console.log({ error: `Error in getOrdersByUser - ${error}` });

    return {
      ok: false,
      message: `Error getting orders by user ${error.message}`,
    };
  }
};
