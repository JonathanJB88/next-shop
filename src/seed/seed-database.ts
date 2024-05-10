import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main() {
  // Delete previous registrations
  // await Promise.all([

  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // ]);

  const { categories, products, users } = initialData;

  await prisma.user.createMany({ data: users });

  await prisma.country.createMany({
    data: countries,
  });

  // Create Categories
  const categoriesData = categories.map((name) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
  }));

  await prisma.category.createMany({ data: categoriesData });

  const categoriesDb = await prisma.category.findMany();
  const categoriesMap = categoriesDb.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;

    return map;
  }, {} as Record<string, string>); // <shirt, categoryId>

  // Products
  products.forEach(async (product) => {
    const { images, type, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: { ...rest, categoryId: categoriesMap[type] },
    });

    const imagesData = images.map((img) => ({
      url: img,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({ data: imagesData });
  });

  console.log('Seed has been successfully executed!');
}

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();
