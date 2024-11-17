/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { GetAllProductsUseCase } from './usecases/getAllProducts';
import { AddProductsUseCase } from './usecases/addProducts';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, GetAllProductsUseCase, AddProductsUseCase],
})
export class ProductsModule {}
