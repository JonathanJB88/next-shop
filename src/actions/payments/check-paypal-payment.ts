'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { PaypalOrderStatus } from '@/interfaces';

export const checkPaypalPayment = async (paypalTransactionId: string) => {
  try {
    const { ok, message, accessToken } = await getPayPalBearerToken();

    if (!ok) {
      return { ok, message };
    }

    const {
      ok: verifyOk,
      message: verifyMessage,
      result,
    } = await verifyPaypalPayment(paypalTransactionId, accessToken!);

    if (!verifyOk) {
      return { ok: verifyOk, message: verifyMessage };
    }

    const { status, purchase_units } = result!;
    const { invoice_id: orderId } = purchase_units[0];

    if (status !== 'COMPLETED') {
      return { ok: false, message: `Paypal payment not completed - ${status}` };
    }

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      });

      revalidatePath(`/orders/${orderId}`);

      return { ok: true, message: 'Paypal payment completed successfully' };
    } catch (error: any) {
      console.log({ error: `Error checking paypal payment - ${error}` });
      return {
        ok: false,
        message: `Error checking paypal payment - ${error.message}`,
      };
    }
  } catch (error: any) {
    console.log({ error: `Error checking paypal payment - ${error}` });
    return {
      ok: false,
      message: `Error checking paypal payment - ${error.message}`,
    };
  }
};

const getPayPalBearerToken = async (): Promise<{
  ok: boolean;
  message: string;
  accessToken?: string;
}> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? '';

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64');

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Basic ${base64Token}`);
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(PAYPAL_OAUTH_URL, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json());

    return {
      ok: true,
      accessToken: result.access_token,
      message: 'Paypal bearer token retrieved successfully',
    };
  } catch (error: any) {
    console.log({ error: `Error getting paypal bearer token - ${error}` });

    return {
      ok: false,
      message: `Error getting paypal bearer token - ${error.message}`,
    };
  }
};

const verifyPaypalPayment = async (
  paypalTransactionId: string,
  paypalAccessToken: string
): Promise<{ ok: boolean; message: string; result?: PaypalOrderStatus }> => {
  const PAYPAL_ORDERS_URL = process.env.PAYPAL_ORDERS_URL ?? '';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${paypalAccessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  try {
    const result = await fetch(`${PAYPAL_ORDERS_URL}/${paypalTransactionId}`, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json());

    return {
      ok: true,
      message: 'Paypal payment verified successfully',
      result,
    };
  } catch (error: any) {
    console.log({ error: `Error verifying paypal payment - ${error}` });
    return {
      ok: false,
      message: `Error verifying paypal payment - ${error.message}`,
    };
  }
};
