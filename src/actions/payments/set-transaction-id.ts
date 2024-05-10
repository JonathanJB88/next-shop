'use server';

import prisma from '@/lib/prisma';

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { transactionId },
    });

    if (!order) throw new Error('Order not found');

    return { ok: true, message: 'Transaction id set successfully' };
  } catch (error: any) {
    console.log({ error: `Error setting transaction id ${error}` });
    return {
      ok: false,
      message: `Error setting transaction id - ${error.message}`,
    };
  }
};
