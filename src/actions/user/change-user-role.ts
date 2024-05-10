'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const changeUserRole = async (
  userId: string,
  role: 'user' | 'admin'
) => {
  const session = await auth();

  if (!session?.user) return { ok: false, message: 'User not authenticated' };

  if (session.user.role !== 'admin')
    return { ok: false, message: 'User not authorized' };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath('/admin/users');

    return {
      ok: true,
      message: `User role changed to ${role}`,
    };
  } catch (error: any) {
    console.log({ error: `Error changing user role ${error}` });
    return {
      ok: false,
      message: `Error changing user role - ${error.message}`,
    };
  }
};
