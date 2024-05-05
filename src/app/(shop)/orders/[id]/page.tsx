import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { IoCardOutline } from 'react-icons/io5';
import { Title } from '@/components';
import { initialData } from '@/seed';
import { Product } from '@/interfaces';

const productsInCart: Product[] = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: Props) {
  const { id } = params;

  //TODO: Verify
  // redirect("/")

  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title={`Order #${id}`} />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {/* cart */}

          <div className='flex flex-col mt-5'>
            <div
              className={clsx(
                'flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5',
                {
                  'bg-red-500': false,
                  'bg-green-700': true,
                }
              )}
            >
              <IoCardOutline size={30} />
              {/* <span className='mx-2'>Payment pending</span> */}
              <span className='mx-2'>Successfully paid</span>
            </div>

            {/* Items */}

            {productsInCart.map((product) => (
              <div key={product.slug} className='flex mb-5'>
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  className='mr-5 rounded'
                  style={{ width: '100px', height: '100px' }}
                />

                <div>
                  <p>{product.title}</p>
                  <p>${product.price} x 3</p>
                  <p className='font-bold'>Subtotal: ${product.price * 3}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className='bg-white rounded-xl shadow-xl p-7'>
            <h2 className='text-2xl mb-2'>Shipping address</h2>
            <div className='mb-10'>
              <p className='text-xl'>Jonathan Bracho</p>
              <p>Av. Leganés</p>
              <p>Col. Centro</p>
              <p>Alcaldía Leganés</p>
              <p>Madrid</p>
              <p>CP 28915</p>
              <p>652589621</p>
            </div>

            {/* Divider */}
            <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />

            <h2 className='text-xl mb-2'>Order Summary</h2>

            <div className='grid grid-cols-2'>
              <span>Products quantity</span>
              <span className='text-right'>3 items</span>

              <span>Subtotal</span>
              <span className='text-right'>$100</span>

              <span>Taxes (15%)</span>
              <span className='text-right'>$100</span>

              <span className='mt-5 text-2xl'>Total</span>
              <span className='mt-5 text-2xl text-right'>$100</span>
            </div>

            <div className='mt-5 mb-2 w-full'>
              <div
                className={clsx(
                  'flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5',
                  {
                    'bg-red-500': false,
                    'bg-green-700': true,
                  }
                )}
              >
                <IoCardOutline size={30} />
                {/* <span className='mx-2'>Payment pending</span> */}
                <span className='mx-2'>Successfully paid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
