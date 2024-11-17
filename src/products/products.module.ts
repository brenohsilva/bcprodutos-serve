/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { GetAllProductsUseCase } from './usecases/getAllProducts';
import { AddProductsUseCase } from './usecases/addProducts';
import { GetOneProductUseCase } from './usecases/getOneProduct';
import { DeleteProductsUseCase } from './usecases/deleteProduct';
import { UpdateProductsUseCase } from './usecases/updateProducts';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    GetAllProductsUseCase,
    GetOneProductUseCase,
    AddProductsUseCase,
    UpdateProductsUseCase,
    DeleteProductsUseCase,
  ],
})
export class ProductsModule {}
