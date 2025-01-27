import { Module } from '@nestjs/common';
import { OverViewController } from './overview.controller';
import { OverViewService } from './overview.service';
import { PrismaService } from 'src/prisma.service';
import { GetProfitUseCase } from './usecases/get-profit.usecase';
import { GetTotalValueSalesByPeriodUseCase } from 'src/sales/usecases/get-total-values-sales-by-period.usecase';
import { GetTotalValueShoppingByPeriodUseCase } from 'src/shopping/usecases/get-total-values-shopping-by-period.usecase';
import { SalesService } from 'src/sales/sales.service';
import { ShoppingService } from 'src/shopping/shopping.service';

@Module({
  controllers: [OverViewController],
  providers: [
    OverViewService,
    PrismaService,
    GetProfitUseCase,
    GetTotalValueSalesByPeriodUseCase,
    GetTotalValueShoppingByPeriodUseCase,
    SalesService,
    ShoppingService,
  ],
})
export class OverViewModule {}
