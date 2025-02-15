import { Module } from '@nestjs/common';
import { OverViewController } from './overview.controller';
import { OverViewService } from './overview.service';
import { PrismaService } from 'src/prisma.service';
import { GetBalanceUseCase } from './usecases/get-balance.usecase';
import { GetTotalValueSalesByPeriodUseCase } from 'src/sales/usecases/get-total-values-sales-by-period.usecase';
import { GetTotalValueShoppingByPeriodUseCase } from 'src/shopping/usecases/get-total-values-shopping-by-period.usecase';
import { SalesService } from 'src/sales/sales.service';
import { ShoppingService } from 'src/shopping/shopping.service';
import { GetRevenueAmountInProductsUseCase } from './usecases/get-revenue-amount-in-products.usecase';
import { ProductsService } from 'src/products/products.service';
import { JwtService } from '@nestjs/jwt';
import { GetProfitUseCase } from './usecases/get-profit.usecase';

@Module({
  controllers: [OverViewController],
  providers: [
    OverViewService,
    PrismaService,
    JwtService,
    ProductsService,
    SalesService,
    ShoppingService,
    GetBalanceUseCase,
    GetTotalValueSalesByPeriodUseCase,
    GetTotalValueShoppingByPeriodUseCase,
    GetRevenueAmountInProductsUseCase,
    GetProfitUseCase,
  ],
})
export class OverViewModule {}
