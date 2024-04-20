import Link from 'next/link';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import { titleFont } from '@/config';
import { MenuButton, TopMenuItem } from '@/components';

const topMenuOptions = [
  {
    href: '/category/men',
    title: 'Men',
  },
  {
    href: '/category/women',
    title: 'Women',
  },
  {
    href: '/category/kids',
    title: 'Kids',
  },
];

export const TopMenu = () => {
  return (
    <nav className='flex px-5 justify-between items-center w-full'>
      {/* Logo */}
      <div>
        <Link href='/'>
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo
          </span>
          <span> | SHOP</span>
        </Link>
      </div>

      {/* Center Menu */}
      <div className='hidden sm:block'>
        {topMenuOptions.map((option) => (
          <TopMenuItem key={option.href} {...option} />
        ))}
      </div>

      {/* Search, Cart, Menu */}
      <div className='flex items-center'>
        <Link href={'/search'} className='mx-2'>
          <IoSearchOutline className='w-5 h-5' />
        </Link>

        <Link href={'/cart'} className='mx-2'>
          <div className='relative'>
            <span className='absolute text-xs text-white rounded-full px-1 font-bold -top-2 bg-blue-700 -right-2'>
              3
            </span>
            <IoCartOutline className='w-5 h-5' />
          </div>
        </Link>

        <MenuButton />
      </div>
    </nav>
  );
};
