/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { GetAllProductsUseCase } from './usecases/get-all-products.usecase';
import { AddProductsUseCase } from './usecases/add-products.usecase';
import { GetOneProductUseCase } from './usecases/get-one-product.usecase';
import { DeleteProductsUseCase } from './usecases/delete-products.usecase';
import { UpdateProductsUseCase } from './usecases/update-products.usecase';
import { GetLastSalesProductsUseCase } from './usecases/get-last-sales-products.usecase';
import { GetLastShoppingProductsUseCase } from './usecases/get-last-shopping-products.usecase';
import { GetStocksProductsQuantityUseCase } from './usecases/get-stocks-products-quantity.usecase';
import { GetQuantityOfProductsByNameUseCase } from './usecases/get-quantity-of-products-by-name.usecase';

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
    GetLastSalesProductsUseCase,
    GetLastShoppingProductsUseCase,
    GetStocksProductsQuantityUseCase,
    GetQuantityOfProductsByNameUseCase
  ],
})
export class ProductsModule {}
