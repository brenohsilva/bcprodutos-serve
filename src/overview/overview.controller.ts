import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetProfitUseCase } from './usecases/get-profit.usecase';
import { GetRevenueAmountInProductsUseCase } from './usecases/get-revenue-amount-in-products.usecase';
import { AuthGuard } from 'src/auth/auth.guard';
@UseGuards(AuthGuard)
@Controller('overview')
export class OverViewController {
  constructor(
    private readonly getProfitUseCase: GetProfitUseCase,
    private readonly getRevenueAmountUseCase: GetRevenueAmountInProductsUseCase,
  ) {}

  @Get('/profit')
  findProfit() {
    return this.getProfitUseCase.execute();
  }

  @Get('/revenue')
  findRevenueAmount() {
    return this.getRevenueAmountUseCase.execute();
  }
}
