'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAddressStore, useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import clsx from 'clsx';
import { placeOrder } from '@/actions';

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const address = useAddressStore((state) => state.address);
  const { subTotal, tax, total, itemsInCart } = useCartStore((state) =>
    state.getSummaryInfo()
  );
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size,
    }));

    const resp = await placeOrder(productsToOrder, address);

    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message!);
      return;
    }

    router.replace(`/orders/${resp.order?.id}`);
    clearCart();

    setIsPlacingOrder(false);
  };

  if (!loaded) return <h2>Loading...</h2>;

  return (
    <div className='bg-white rounded-xl shadow-xl p-7'>
      <h2 className='text-2xl mb-2'>Shipping address</h2>
      <div className='mb-10'>
        <p className='text-xl'>
          {address.name} {address.lastname}
        </p>
        <p>{address.address}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>{address.postcode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />

      <h2 className='text-xl mb-2'>Order Summary</h2>

      <div className='grid grid-cols-2'>
        <span>Products quantity</span>
        <span className='text-right'>
          {itemsInCart === 1 ? '1 item' : `${itemsInCart} items`}
        </span>

        <span>Subtotal</span>
        <span className='text-right'>{currencyFormat(subTotal)}</span>

        <span>Taxes (15%)</span>
        <span className='text-right'>{currencyFormat(tax)}</span>

        <span className='mt-5 text-2xl'>Total</span>
        <span className='mt-5 text-2xl text-right'>
          {currencyFormat(total)}
        </span>
      </div>

      <div className='mt-5 mb-2 w-full'>
        <p className='mb-5'>
          {/* Disclaimer */}
          <span className='text-xs'>
            By placing this order, you agree to our{' '}
            <a href='#' className='underline'>
              terms and conditions
            </a>{' '}
            and{' '}
            <a href='#' className='underline'>
              privacy policies
            </a>
            .
          </span>
        </p>

        {errorMessage && <p className='text-red-500 mb-2'>{errorMessage}</p>}

        <button
          disabled={isPlacingOrder}
          onClick={onPlaceOrder}
          className={clsx('flex justify-center w-full', {
            'btn-primary': !isPlacingOrder,
            'btn-disabled': isPlacingOrder,
          })}
        >
          Place order
        </button>
      </div>
    </div>
  );
};
