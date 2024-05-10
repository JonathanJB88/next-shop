'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { login, registerUser } from '@/actions';

interface FormInputs {
  name: string;
  email: string;
  password: string;
}

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage('');
    const { name, email, password } = data;
    const response = await registerUser(name, email, password);

    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }

    await login(email.toLowerCase(), password);
    window.location.replace('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
      <label htmlFor='name'>Full name</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': !!errors.name,
        })}
        type='text'
        autoFocus
        {...register('name', { required: true })}
      />

      <label htmlFor='email'>Email</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': !!errors.email,
        })}
        type='email'
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />

      <label htmlFor='password'>Password</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': !!errors.password,
        })}
        type='password'
        {...register('password', { required: true, minLength: 6 })}
      />

      {errorMessage && <span className='text-red-500'>{errorMessage}</span>}

      <button type='submit' className='btn-primary'>
        Sign up
      </button>

      {/* divisor line */}
      <div className='flex items-center my-5'>
        <div className='flex-1 border-t border-gray-500' />
        <div className='px-2 text-gray-800'>O</div>
        <div className='flex-1 border-t border-gray-500' />
      </div>

      <Link href='/auth/login' className='btn-secondary text-center'>
        Login
      </Link>
    </form>
  );
};
