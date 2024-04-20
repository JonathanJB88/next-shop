import { useUiStore } from '@/store';
import { IoCloseOutline } from 'react-icons/io5';

export const CloseButton = () => {
  const closeMenu = useUiStore((state) => state.closeSideMenu);
  return (
    <IoCloseOutline
      size={40}
      className='absolute top-5 right-5 cursor-pointer'
      onClick={closeMenu}
    />
  );
};
