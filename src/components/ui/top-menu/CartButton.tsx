'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoCartOutline } from 'react-icons/io5';
import { useCartStore } from '@/store';

export const CartButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (totalItemsInCart === 0 && loaded && pathname === '/cart') {
      router.replace('/empty');
    }
  }, [totalItemsInCart, loaded, pathname, router]);

  return (
    <Link
      href={totalItemsInCart === 0 && loaded ? '/empty' : '/cart'}
      className='mx-2'
    >
      <div className='relative'>
        {loaded && totalItemsInCart > 0 && (
          <span className='fade-in absolute text-xs text-white rounded-full px-1 font-bold -top-2 bg-blue-700 -right-2'>
            {totalItemsInCart}
          </span>
        )}
        <IoCartOutline className='w-5 h-5' />
      </div>
    </Link>
  );
};
