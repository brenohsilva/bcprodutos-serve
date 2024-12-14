import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { CreateSaleUseCase } from './usecases/create-sales.usecase';

import { GetAllSalesUseCase } from './usecases/get-all-sales.usecase';
import { GetOneSaleUseCase } from './usecases/get-one-sale.usecase';
import { PrismaService } from 'src/prisma.service';
import { DeleteSaleUseCase } from './usecases/delete-sales.usecase';
import { UpdateSaleUseCase } from './usecases/update-sales.usecase';
import { GetTotalSalesByWeekUseCase } from './usecases/get-total-sales-by-week.usecase';

@Module({
  controllers: [SalesController],
  providers: [
    SalesService,
    PrismaService,
    GetAllSalesUseCase,
    GetOneSaleUseCase,
    DeleteSaleUseCase,
    CreateSaleUseCase,
    UpdateSaleUseCase,
    GetTotalSalesByWeekUseCase,
  ],
})
export class SalesModule {}
