import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetBalanceUseCase } from './usecases/get-balance.usecase';
import { GetRevenueAmountInProductsUseCase } from './usecases/get-revenue-amount-in-products.usecase';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetProfitUseCase } from './usecases/get-profit.usecase';
import { GetDailyProfitsUseCase } from './usecases/get-daily-profits.usecase';
import { GetItensSoldByMonthUseCase } from './usecases/get-itens-sold-by-month.usecase';
@UseGuards(AuthGuard)
@Controller('overview')
export class OverViewController {
  constructor(
    private readonly getBalanceUseCase: GetBalanceUseCase,
    private readonly getRevenueAmountUseCase: GetRevenueAmountInProductsUseCase,
    private readonly getProfitUseCase: GetProfitUseCase,
    private readonly getDailyProfitUseCase: GetDailyProfitsUseCase,
    private readonly getItensSoldByMonthUseCase: GetItensSoldByMonthUseCase
  ) {}

  @Get('/balance')
  findBalance(@Query('month') month?: string) {
    return this.getBalanceUseCase.execute(month);
  }

  @Get('/revenue')
  findRevenueAmount() {
    return this.getRevenueAmountUseCase.execute();
  }

  @Get('/daily-profits')
  findDailyProfits(@Query('month') month?: string) {
    return this.getDailyProfitUseCase.execute(month);
  }

  @Get('/itens-sold')
  findProductsSold(@Query('month') month?: string) {
    return this.getItensSoldByMonthUseCase.execute(month);
  }

  @Get('/profits')
  findProfit(@Query('month') month?: string, @Query('year') year?: string) {
    return this.getProfitUseCase.execute(Number(month), Number(year));
  }
}
