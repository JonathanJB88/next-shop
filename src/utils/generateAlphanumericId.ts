const orderFictitiousIds: { [key: string]: string } = {};

export const generateAlphanumericId = () => {
  const currentYear = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${currentYear}${id}`;
};

export const generateRandomId = (realId: string) => {
  if (!orderFictitiousIds[realId]) {
    orderFictitiousIds[realId] = generateAlphanumericId();
  }
  return orderFictitiousIds[realId];
};
