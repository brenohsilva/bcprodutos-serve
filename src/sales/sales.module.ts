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


@Module({
  controllers: [SalesController],
  providers: [
    SalesService,
    PrismaService,
    FindAllSalesUseCase,
    FindOneSaleUseCase,
    DeleteSaleUseCase,
    CreateSaleUseCase,
    UpdateSaleUseCase,
    GetTotalValueSalesByPeriodUseCase,
    GetTotalSalesByPeriodUseCase,
    GetTotalSalesProductsByPeriodUseCase,
    GetTotalSalesValueProductsByPeriodUseCase
  ],
})
export class SalesModule {}
