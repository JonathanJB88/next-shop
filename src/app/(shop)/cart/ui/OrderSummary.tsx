'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';

export const OrderSummary = () => {
  const { subTotal, tax, total, itemsInCart } = useCartStore((state) =>
    state.getSummaryInfo()
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <h2>Loading...</h2>;

  return (
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
      <span className='mt-5 text-2xl text-right'>{currencyFormat(total)}</span>
    </div>
  );
};
