'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth.config';
import { sleep } from '@/utils';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // await sleep(2);
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'Logged in successfully.';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', { email, password });

    return {
      ok: true,
      message: 'Logged in successfully',
    };
  } catch (error) {
    console.log({ error: `Error logging in user ${error}` });

    return {
      ok: false,
      message: 'Error logging in user',
    };
  }
};
