'use server';

import type { Address } from '@/interfaces';
import prisma from '@/lib/prisma';

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      message: 'Address saved successfully',
      address: newAddress,
    };
  } catch (error) {
    console.log({ error: `Error in setUserAddress action ${error}` });
    return {
      ok: false,
      message: `Error in setUserAddress action ${error}`,
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    const addressToSave = {
      userId,
      name: address.name,
      lastname: address.lastname,
      address: address.address,
      address2: address.address2,
      postcode: address.postcode,
      countryId: address.country,
      phone: address.phone,
      city: address.city,
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave,
    });

    return updatedAddress;
  } catch (error) {
    console.log({ error: `Error in createOrReplaceAddress function ${error}` });
    return {
      ok: false,
      message: `Error in createOrReplaceAddress function ${error}`,
    };
  }
};
