import Link from 'next/link';
import { titleFont } from '@/config';

export const Footer = () => {
  return (
    <div className='flex w-full justify-center text-xs mb-10'>
      <Link href='/'>
        <span className={`${titleFont.className} antialiased font-bold`}>
          Teslo{' '}
        </span>
        <span>| Shop</span>
        <span> © {new Date().getFullYear()}</span>
      </Link>

      <Link href='/' className='mx-3'>
        Privacy & Legacy
      </Link>

      <Link href='/'>Locations</Link>
    </div>
  );
};
