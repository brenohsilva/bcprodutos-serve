import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OverViewService } from '../overview.service';

@Injectable()
export class GetProfitUseCase {
  constructor(private readonly overViewServcice: OverViewService) {}
  async execute(month?: number, year?: number) {
    try {
      const now = new Date();
      const selectedYear = year && !isNaN(year) ? year : now.getFullYear();
      const selectedMonth = month && !isNaN(month) ? month : now.getMonth() + 1;
      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const firstDayOfNextMonth = new Date(selectedYear, selectedMonth, 1);
      const response = await this.overViewServcice.findProfits(
        firstDayOfMonth,
        firstDayOfNextMonth,
      );

      const total = response.reduce((acc, profit) => {
        return acc + Number(profit.profit_day);
      }, 0);
      return {
        success: true,
        data: total,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao contabilizar os lucros. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
