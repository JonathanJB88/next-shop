'use client';

import { useUiStore } from '@/store';

export const MenuButton = () => {
  const openMenu = useUiStore((state) => state.openSideMenu);

  return (
    <button
      onClick={openMenu}
      className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
    >
      Menu
    </button>
  );
};
