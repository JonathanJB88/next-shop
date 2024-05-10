export interface Address {
  name: string;
  lastname: string;
  address: string;
  address2?: string;
  postcode: string;
  city: string;
  country: string;
  phone: string;
}

export interface UserAddress {
  name: string;
  lastname: string;
  address: string;
  address2?: string;
  postcode: string;
  city: string;
  phone: string;

  id: string;
  userId: string;
  countryId: string;
}
