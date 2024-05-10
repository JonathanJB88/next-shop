import { ReactNode } from 'react';
import Link from 'next/link';
import { logout } from '@/actions';

interface Props {
  href: string;
  title: string;
  icon: ReactNode;
  closeMenu: () => void;
}

export const SidebarItem = ({ href, title, icon, closeMenu }: Props) => {
  if (title === 'Logout')
    return (
      <button
        className='flex items-center w-full mt-10 p-2 hover:bg-gray-100 rounded transition-all'
        onClick={() =>
          logout().then(() => {
            closeMenu();
            window.location.replace('/');
          })
        }
      >
        {icon}
        <span className='ml-3 text-xl'>{title}</span>
      </button>
    );

  return (
    <Link
      href={href}
      className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
      onClick={closeMenu}
    >
      {icon}
      <span className='ml-3 text-xl'>{title}</span>
    </Link>
  );
};
