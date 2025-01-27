import { Controller, Get } from '@nestjs/common';
import { GetProfitUseCase } from './usecases/get-profit.usecase';

@Controller('overview')
export class OverViewController {
  constructor(private readonly getProfitUseCase: GetProfitUseCase) {}

  @Get('/profit')
  findProfit() {
    return this.getProfitUseCase.execute();
  }
}
