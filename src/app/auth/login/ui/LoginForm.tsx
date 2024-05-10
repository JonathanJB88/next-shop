'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { IoInformationOutline } from 'react-icons/io5';
import clsx from 'clsx';
import { authenticate } from '@/actions';

export const LoginForm = () => {
  const [state, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (state === 'Logged in successfully.') {
      window.location.replace('/');
    }
  }, [state]);

  return (
    <form action={dispatch} className='flex flex-col'>
      <label htmlFor='email'>Email</label>
      <input
        className='px-5 py-2 border bg-gray-200 rounded mb-5'
        type='email'
        name='email'
      />

      <label htmlFor='password'>Password</label>
      <input
        className='px-5 py-2 border bg-gray-200 rounded mb-5'
        type='password'
        name='password'
      />

      <div
        className='flex h-8 items-end space-x-1'
        aria-live='polite'
        aria-atomic='true'
      >
        {state === 'Invalid credentials.' && (
          <div className='mb-2 flex flex-row'>
            <IoInformationOutline className='h-5 w-5 text-red-500' />
            <p className='text-sm text-red-500'>{state}</p>
          </div>
        )}
      </div>

      <LoginButton />

      {/* divisor line */}
      <div className='flex items-center my-5'>
        <div className='flex-1 border-t border-gray-500' />
        <div className='px-2 text-gray-800'>O</div>
        <div className='flex-1 border-t border-gray-500' />
      </div>

      <Link href='/auth/register' className='btn-secondary text-center'>
        Create a new account
      </Link>
    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      className={clsx({
        'btn-disabled': pending,
        'btn-primary': !pending,
      })}
      disabled={pending}
    >
      Login
    </button>
  );
}
