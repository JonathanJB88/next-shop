'use server';

import prisma from '@/lib/prisma';

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: { userId },
    });

    if (!address)
      return {
        ok: true,
        address: {},
        message: 'User address not found',
      };

    const { countryId, address2, ...restAddress } = address;

    return {
      ok: true,
      address: { ...restAddress, country: countryId, address2: address2 ?? '' },
      message: 'User address retrieved successfully',
    };
  } catch (error) {
    console.log({ error: `Error getting user address ${error}` });

    return {
      ok: false,
      message: 'Error getting user address',
    };
  }
};
