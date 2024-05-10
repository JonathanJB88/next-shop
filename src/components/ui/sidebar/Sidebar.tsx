'use client';

import clsx from 'clsx';
import {
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';
import { CloseButton, SidebarItem } from '@/components';
import { useUiStore } from '@/store';
import { useSession } from 'next-auth/react';

const menuOptions = [
  {
    href: '/profile',
    title: 'Profile',
    icon: <IoPersonOutline size={20} />,
    auth: true,
  },
  {
    href: '/orders',
    title: 'Orders',
    icon: <IoTicketOutline size={20} />,
    auth: true,
  },
  {
    href: '/auth/login',
    title: 'Login',
    icon: <IoLogInOutline size={20} />,
    auth: false,
  },
  {
    href: '/',
    title: 'Logout',
    icon: <IoLogOutOutline size={20} />,
    auth: true,
  },
];

const adminMenuOptions = [
  {
    href: '/admin/products',
    title: 'Products',
    icon: <IoShirtOutline size={20} />,
    auth: true,
  },
  {
    href: '/admin/orders',
    title: 'Orders',
    icon: <IoTicketOutline size={20} />,
    auth: true,
  },
  {
    href: '/admin/users',
    title: 'Users',
    icon: <IoPeopleOutline size={20} />,
    auth: true,
  },
];

export const Sidebar = () => {
  const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen);
  const closeMenu = useUiStore((state) => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === 'admin';

  const filteredMenuOptions = menuOptions.filter(
    (option) => option.auth === isAuthenticated
  );

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className='fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30' />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className='fade-in fixed top-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm'
        />
      )}

      {/* Sidebar */}
      <nav
        className={clsx(
          'fixed p-5 right-0 top-0 w-[400px] h-screen bg-white z-20 shadow-xl transform transition-all duration-300',
          {
            'translate-x-full': !isSideMenuOpen,
          }
        )}
      >
        <CloseButton />

        {/* Input */}
        <div className='relative mt-14'>
          <IoSearchOutline size={20} className='absolute top-2 left-2' />
          <input
            type='text'
            placeholder='Search...'
            className='w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-800'
          />
        </div>

        {/* Menu */}
        {filteredMenuOptions.map((option, index) => (
          <SidebarItem key={index} {...option} closeMenu={closeMenu} />
        ))}

        {/* Separator */}
        <div className='w-full h-px bg-gray-200 my-10' />

        {/* Admin Menu */}
        {isAdmin &&
          adminMenuOptions.map((option, index) => (
            <SidebarItem key={index} {...option} closeMenu={closeMenu} />
          ))}
      </nav>
    </div>
  );
};
