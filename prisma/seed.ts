/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const produtos = [
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 38,
      color: 'Preto',
      type: 'Sem cadarço',
      amount: 2,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 39,
      color: 'Preto',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 40,
      color: 'Preto',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 41,
      color: 'Preto',
      type: 'Sem cadarço',
      amount: 2,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 42,
      color: 'Preto',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 43,
      color: 'Preto',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 44,
      color: 'Preto',
      type: 'Sem cadarço',
      amount: 2,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 38,
      color: 'Branco',
      type: 'Sem cadarço',
      amount: 2,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 39,
      color: 'Branco',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 40,
      color: 'Branco',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 41,
      color: 'Branco',
      type: 'Sem cadarço',
      amount: 2,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 42,
      color: 'Branco',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 43,
      color: 'Branco',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 44,
      color: 'Branco',
      type: 'Sem cadarço',
      amount: 2,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 38,
      color: 'Marrom',
      type: 'Sem cadarço',
      amount: 2,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 39,
      color: 'Marrom',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 40,
      color: 'Marrom',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 41,
      color: 'Marrom',
      type: 'Sem cadarço',
      amount: 2,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 42,
      color: 'Marrom',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
      name: 'Sapato Social',
      category: 'Calçados',
      size: 43,
      color: 'Marrom',
      type: 'Sem cadarço',
      amount: 1,
      salesPrice: 65.0,
    },
    {
        name: 'Sapato Social',
        category: 'Calçados',
        size: 44,
        color: 'Marrom',
        type: 'Sem cadarço',
        amount: 2,
        salesPrice: 65.0,
      },
  ];

  for (const produto of produtos) {
    await prisma.product.create({
      data: produto,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
