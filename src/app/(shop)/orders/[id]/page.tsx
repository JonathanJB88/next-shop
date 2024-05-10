import Image from 'next/image';
import { redirect } from 'next/navigation';
import { OrderStatus, PayPalButton, ProductImage, Title } from '@/components';
import { getOrderById } from '@/actions';
import { currencyFormat, generateRandomId } from '@/utils';

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect('/');
  }

  const address = order!.OrderAddress;
  const isPaid = order!.isPaid;

  const orderId = generateRandomId(id);

  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title={`Order #${orderId}`} />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {/* cart */}

          <div className='flex flex-col mt-5'>
            <OrderStatus isPaid={isPaid} />

            {/* Items */}

            {order!.OrderItem.map((item) => (
              <div
                key={`${item.product.slug}-${item.size}`}
                className='flex mb-5'
              >
                <ProductImage
                  src={item.product.ProductImage[0]?.url}
                  width={100}
                  height={100}
                  alt={item.product.title}
                  className='mr-5 rounded'
                  style={{ width: '100px', height: '100px' }}
                />

                <div>
                  <p>{item.product.title}</p>
                  <p>
                    {currencyFormat(item.price)} x {item.quantity}
                  </p>
                  <p className='font-bold'>
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className='bg-white rounded-xl shadow-xl p-7'>
            <h2 className='text-2xl mb-2'>Shipping address</h2>
            <div className='mb-10'>
              <p className='text-xl'>
                {address!.name} {address!.lastname}
              </p>
              <p>{address!.address}</p>
              {address!.address2 && <p>{address!.address2}</p>}
              <p>{address!.postcode}</p>
              <p>
                {address!.city}, {address!.countryId}
              </p>
              <p>{address!.phone}</p>
            </div>

            {/* Divider */}
            <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />

            <h2 className='text-xl mb-2'>Order Summary</h2>

            <div className='grid grid-cols-2'>
              <span>Products quantity</span>
              <span className='text-right'>
                {order?.itemsInOrder === 1
                  ? '1 item'
                  : `${order?.itemsInOrder} items`}
              </span>

              <span>Subtotal</span>
              <span className='text-right'>
                {currencyFormat(order!.subTotal)}
              </span>

              <span>Taxes (15%)</span>
              <span className='text-right'>{currencyFormat(order!.tax)}</span>

              <span className='mt-5 text-2xl'>Total</span>
              <span className='mt-5 text-2xl text-right'>
                {currencyFormat(order!.total)}
              </span>
            </div>

            <div className='mt-5 mb-2 w-full'>
              {isPaid ? (
                <OrderStatus isPaid={isPaid} />
              ) : (
                <PayPalButton amount={order!.total} orderId={order!.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
