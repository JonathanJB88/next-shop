import Link from 'next/link';

interface Props {
  href: string;
  title: string;
}

export const TopMenuItem = ({ href, title }: Props) => {
  return (
    <Link
      className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
      href={href}
    >
      {title}
    </Link>
  );
};
