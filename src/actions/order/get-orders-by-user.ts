'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrdersByUser = async () => {
  const session = await auth();

  if (!session?.user) {
    return { ok: false, message: 'User not authenticated' };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
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

    return { ok: true, orders };
  } catch (error: any) {
    console.log({ error: `Error in getOrdersByUser - ${error}` });

    return {
      ok: false,
      message: `Error getting orders by user ${error.message}`,
    };
  }
};
