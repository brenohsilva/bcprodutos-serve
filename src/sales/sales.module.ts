import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { CreateSaleUseCase } from './usecases/createSales';

import { GetAllSalesUseCase } from './usecases/getAllSales';
import { GetOneSaleUseCase } from './usecases/getOneSale';
import { PrismaService } from 'src/prisma.service';
import { DeleteSaleUseCase } from './usecases/deleteSale';
import { UpdateSaleUseCase } from './usecases/updateSale';


@Module({
  controllers: [SalesController],
  providers: [
    SalesService,
    PrismaService,
    GetAllSalesUseCase,
    GetOneSaleUseCase,
    DeleteSaleUseCase,
    CreateSaleUseCase,
    UpdateSaleUseCase
  ],
})
export class SalesModule {}
