import { Address } from '@/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  address: Address;

  setAddress: (address: State['address']) => void;
}

export const useAddressStore = create<State>()(
  persist(
    (set, get) => ({
      address: {
        name: '',
        lastname: '',
        address: '',
        address2: '',
        postcode: '',
        city: '',
        country: '',
        phone: '',
      },
      setAddress: (address) => set({ address }),
    }),
    {
      name: 'address-storage',
    }
  )
);
