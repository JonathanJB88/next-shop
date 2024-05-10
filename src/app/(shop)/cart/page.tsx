import Link from 'next/link';
import { Title } from '@/components';
import { ProductsInCart } from './ui/ProductsInCart';
import { OrderSummary } from './ui/OrderSummary';

export default function CartPage() {
  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title='Shopping cart' />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {/* cart */}

          <div className='flex flex-col mt-5'>
            <span className='text-xl'>Add more items</span>
            <Link href='/' className='underline mb-5'>
              Shopping more
            </Link>

            {/* Items */}
            <ProductsInCart />
          </div>

          {/* Checkout */}
          <div className='bg-white rounded-xl shadow-xl p-7 h-fit'>
            <h2 className='text-xl mb-2'>Order Summary</h2>

            <OrderSummary />

            <div className='mt-5 mb-2 w-full'>
              <Link
                href='/checkout/address'
                className='flex btn-primary justify-center'
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
