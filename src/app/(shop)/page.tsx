import { titleFont } from '@/config';
import Image from 'next/image';

export default function Home() {
  return (
    <div className=''>
      <h1>Hello There !!</h1>
      <h1 className={titleFont.className}>Hello from new font</h1>
    </div>
  );
}
