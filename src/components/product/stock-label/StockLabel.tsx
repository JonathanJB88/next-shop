'use client';

import { useEffect, useState } from 'react';
import { titleFont } from '@/config';
import { getStockBySlug } from '@/actions';

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStock = async () => {
      const stock = await getStockBySlug(slug);
      setStock(stock);
      setLoading(false);
    };
    getStock();
  }, [slug]);

  return (
    <>
      {loading ? (
        <h1
          className={`${titleFont.className} antialiased font-bold bg-gray-200 animate-pulse text-lg rounded-sm`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialiased font-bold text-lg`}>
          Stock: {stock}
        </h1>
      )}
    </>
  );
};
