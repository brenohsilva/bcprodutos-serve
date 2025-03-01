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

      // Calcula o primeiro e o último dia do mês atual
      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const firstDayOfNextMonth = new Date(selectedYear, selectedMonth, 1);

      // Busca os lucros do mês atual
      const currentMonthProfits = await this.overViewServcice.findProfits(
        firstDayOfMonth,
        firstDayOfNextMonth,
      );

      // Calcula o total de lucro do mês atual
      const currentMonthTotal = currentMonthProfits.reduce((acc, profit) => {
        return acc + Number(profit.profit_day);
      }, 0);

      // Calcula a data do mesmo dia no mês anterior
      const previousMonthDate = new Date(
        selectedYear,
        selectedMonth - 2,
        now.getDate(),
      );
      const firstDayOfPreviousMonth = new Date(
        previousMonthDate.getFullYear(),
        previousMonthDate.getMonth(),
        1,
      );
      const firstDayOfCurrentMonth = new Date(
        previousMonthDate.getFullYear(),
        previousMonthDate.getMonth() + 1,
        1,
      );

      // Busca os lucros do mesmo dia no mês anterior
      const previousMonthProfits = await this.overViewServcice.findProfits(
        firstDayOfPreviousMonth,
        firstDayOfCurrentMonth,
      );

      // Calcula o total de lucro do mesmo dia no mês anterior
      const previousMonthTotal = previousMonthProfits.reduce((acc, profit) => {
        return acc + Number(profit.profit_day);
      }, 0);

      return {
        success: true,
        data: {
          currentMonthTotal,
          previousMonthTotal,
        },
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
