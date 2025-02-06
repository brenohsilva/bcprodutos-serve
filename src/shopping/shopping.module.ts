import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { CreateShoppingUseCase } from './usecases/create-shopping.usecase';
import { PrismaService } from 'src/prisma.service';
import { GetAllShoppingUseCase } from './usecases/get-all-shopping.usecase';
import { GetOneShoppingUseCase } from './usecases/get-one-shopping.usecase';
import { UpdateShoppingUseCase } from './usecases/update-shopping.usecase';
import { DeleteShoppingUseCase } from './usecases/delete-shopping.usecase';
import { GetTotalShoppingByPeriodUseCase } from './usecases/get-total-shopping-by-period.usecase';
import { GetTotalShoppingProductsByPeriodUseCase } from './usecases/get-total-shopping-products-by-period.usecase';
import { GetTotalShoppingValueProductsByPeriodUseCase } from './usecases/get-total-shopping-value-products-by-period.usecase';
import { GetTotalValueShoppingByPeriodUseCase } from './usecases/get-total-values-shopping-by-period.usecase';
import { GetQuantityOfProductsPurchasedByPeriodUseCase } from './usecases/get-quantity-of-products-purchased-by-period.usecase';
import { ProductsService } from 'src/products/products.service';

@Module({
  controllers: [ShoppingController],
  providers: [
    ShoppingService,
    CreateShoppingUseCase,
    GetAllShoppingUseCase,
    GetOneShoppingUseCase,
    UpdateShoppingUseCase,
    DeleteShoppingUseCase,
    GetTotalShoppingByPeriodUseCase,
    GetTotalShoppingProductsByPeriodUseCase,
    GetTotalShoppingValueProductsByPeriodUseCase,
    GetTotalValueShoppingByPeriodUseCase,
    GetQuantityOfProductsPurchasedByPeriodUseCase,
    ProductsService,
    PrismaService,
  ],
})
export class ShoppingModule {}
