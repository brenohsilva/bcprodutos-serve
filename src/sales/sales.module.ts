import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { CreateSaleUseCase } from './usecases/create-sales.usecase';

import { PrismaService } from 'src/prisma.service';
import { DeleteSaleUseCase } from './usecases/delete-sales.usecase';
import { UpdateSaleUseCase } from './usecases/update-sales.usecase';
import { GetTotalValueSalesByPeriodUseCase } from './usecases/get-total-values-sales-by-period.usecase';
import { FindAllSalesUseCase } from './usecases/find-all-sales.usecase';
import { FindOneSaleUseCase } from './usecases/find-one-sale.usecase';
import { GetTotalSalesByPeriodUseCase } from './usecases/get-total-sales-by-period.usecase';
import { GetTotalSalesProductsByPeriodUseCase } from './usecases/get-total-sales-products-by-period.usecase';
import { GetTotalSalesValueProductsByPeriodUseCase } from './usecases/get-total-sales-value-produccts-by-period.usecase';
import { GetQuantityOfSalesOfProductsUseCase } from './usecases/get-quantity-of-sales-of-products.usecase';
import { ProductsService } from 'src/products/products.service';
import { GetQuantityOfProductsSoldByPeriodUseCase } from './usecases/get-quantity-of-products-sold-by-period.usecase';
import { GetLastSalesUseCase } from './usecases/get-last-sales.usecase';
import { RegisterProfitUseCase } from './usecases/register-profit-day.usecase';
import { OverViewService } from 'src/overview/overview.service';
import { JwtService } from '@nestjs/jwt';
import { GetDailySalesUseCase } from './usecases/get-daily-sales.usecase';
import { GetBestSalesOfMonthUseCase } from './usecases/get-best-sales-of-month.usecase';
import { GetSalesValuesByMonthUseCase } from './usecases/general/get-sales-values-by-month.usecase';

@Module({
  controllers: [SalesController],
  providers: [
    SalesService,
    PrismaService,
    ProductsService,
    OverViewService,
    JwtService,
    FindAllSalesUseCase,
    FindOneSaleUseCase,
    DeleteSaleUseCase,
    CreateSaleUseCase,
    UpdateSaleUseCase,
    GetTotalValueSalesByPeriodUseCase,
    GetTotalSalesByPeriodUseCase,
    GetTotalSalesProductsByPeriodUseCase,
    GetTotalSalesValueProductsByPeriodUseCase,
    GetQuantityOfSalesOfProductsUseCase,
    GetQuantityOfProductsSoldByPeriodUseCase,
    GetLastSalesUseCase,
    RegisterProfitUseCase,
    GetDailySalesUseCase,
    GetBestSalesOfMonthUseCase,
    GetSalesValuesByMonthUseCase
  ],
})
export class SalesModule {}
