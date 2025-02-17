import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetBalanceUseCase } from './usecases/get-balance.usecase';
import { GetRevenueAmountInProductsUseCase } from './usecases/get-revenue-amount-in-products.usecase';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetProfitUseCase } from './usecases/get-profit.usecase';
import { GetDailyProfitsUseCase } from './usecases/get-daily-profits.usecase';
@UseGuards(AuthGuard)
@Controller('overview')
export class OverViewController {
  constructor(
    private readonly getBalanceUseCase: GetBalanceUseCase,
    private readonly getRevenueAmountUseCase: GetRevenueAmountInProductsUseCase,
    private readonly getProfitUseCase: GetProfitUseCase,
    private readonly getDailyProfitUseCase: GetDailyProfitsUseCase,
  ) {}

  @Get('/balance')
  findBalance() {
    return this.getBalanceUseCase.execute();
  }

  @Get('/revenue')
  findRevenueAmount() {
    return this.getRevenueAmountUseCase.execute();
  }

  @Get('/daily-profits')
  findDailyProfits() {
    return this.getDailyProfitUseCase.execute();
  }

  @Get('/profits')
  findProfit(@Query('month') month?: string, @Query('year') year?: string) {
    return this.getProfitUseCase.execute(Number(month), Number(year));
  }

  
}
