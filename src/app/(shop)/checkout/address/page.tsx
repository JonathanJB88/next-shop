import Link from 'next/link';
import { Title } from '@/components';

export default function AddressPage() {
  return (
    <div className='flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0'>
      <div className='w-full  xl:w-[1000px] flex flex-col justify-center text-left'>
        <Title title='Address' subtitle='Shipping Address' />

        <div className='grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2'>
          <div className='flex flex-col mb-2'>
            <span>Name</span>
            <input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Lastname</span>
            <input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Address</span>
            <input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Address 2 (optional)</span>
            <input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Postcode</span>
            <input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>City</span>
            <input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Country</span>
            <select className='p-2 border rounded-md bg-gray-200'>
              <option value=''>[ Choose ]</option>
              <option value='CRI'>Costa Rica</option>
            </select>
          </div>

          <div className='flex flex-col mb-2'>
            <span>Phone number</span>
            <input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2 sm:mt-10'>
            <Link
              href='/checkout'
              className='btn-primary flex w-full sm:w-1/2 justify-center'
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
