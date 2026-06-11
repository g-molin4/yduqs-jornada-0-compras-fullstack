import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client/index';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const presencialCourseId = 'course-presencial-manha';
const eadCourseId = 'course-ead';
const originalPrice = 4752;

const prices = [
  {
    id: 'course-price-1x',
    name: '1x sem juros',
    installments: 1,
    price: '2613.60',
    totalPrice: '2613.60',
  },
  {
    id: 'course-price-3x',
    name: '3x sem juros',
    installments: 3,
    price: '900.90',
    totalPrice: '2702.70',
  },
  {
    id: 'course-price-6x',
    name: '6x sem juros',
    installments: 6,
    price: '465.30',
    totalPrice: '2791.80',
  },
  {
    id: 'course-price-9x',
    name: '9x sem juros',
    installments: 9,
    price: '320.10',
    totalPrice: '2880.90',
  },
  {
    id: 'course-price-12x',
    name: '12x sem juros',
    installments: 12,
    price: '245.50',
    totalPrice: '2946.00',
  },
  {
    id: 'course-price-15x',
    name: '15x sem juros',
    installments: 15,
    price: '200.97',
    totalPrice: '3014.55',
  },
  {
    id: 'course-price-18x',
    name: '18x sem juros',
    installments: 18,
    price: '169.95',
    totalPrice: '3059.10',
  },
].map((item) => ({
  ...item,
  discount: (originalPrice - Number(item.totalPrice)).toFixed(2),
}));

async function main() {
  await prisma.course.upsert({
    where: { id: presencialCourseId },
    update: {
      name: 'Presencial - Manha',
      modality: 'PRESENCIAL',
      status: 'ACTIVE',
      campus: 'CAMPINAS - VILA INDUSTRIAL',
      address: 'RUA DR. SALES DE OLIVEIRA, No 1661 - VILA INDUSTRIAL - CAMP...',
    },
    create: {
      id: presencialCourseId,
      name: 'Presencial - Manha',
      modality: 'PRESENCIAL',
      status: 'ACTIVE',
      campus: 'CAMPINAS - VILA INDUSTRIAL',
      address: 'RUA DR. SALES DE OLIVEIRA, No 1661 - VILA INDUSTRIAL - CAMP...',
    },
  });

  await prisma.course.upsert({
    where: { id: eadCourseId },
    update: {
      name: 'EAD',
      modality: 'EAD',
      status: 'ACTIVE',
      campus: 'BARRA DA TIJUCA - TOM JOB...',
      address: 'AV. DAS AMERICAS, 4.200, BLOCO 11 - BARRA DA TIJUCA...',
    },
    create: {
      id: eadCourseId,
      name: 'EAD',
      modality: 'EAD',
      status: 'ACTIVE',
      campus: 'BARRA DA TIJUCA - TOM JOB...',
      address: 'AV. DAS AMERICAS, 4.200, BLOCO 11 - BARRA DA TIJUCA...',
    },
  });

  for (const item of prices) {
    await prisma.coursePrices.upsert({
      where: { id: item.id },
      update: {
        courseId: presencialCourseId,
        name: item.name,
        installments: item.installments,
        price: item.price,
        totalPrice: item.totalPrice,
        active: true,
        discount: item.discount,
      },
      create: {
        id: item.id,
        courseId: presencialCourseId,
        name: item.name,
        installments: item.installments,
        price: item.price,
        totalPrice: item.totalPrice,
        active: true,
        discount: item.discount,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
