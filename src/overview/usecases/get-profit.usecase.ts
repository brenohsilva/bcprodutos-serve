import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OverViewService } from '../overview.service';

@Injectable()
export class GetProfitUseCase {
  constructor(private readonly overViewService: OverViewService) {}

  async execute(month?: number, year?: number) {
    try {
      const now = new Date();
      const selectedYear = year && !isNaN(year) ? year : now.getFullYear();
      const selectedMonth = month && !isNaN(month) ? month : now.getMonth() + 1;
      const today = now.getDate(); // Pega o dia atual do mês
      // Datas do período atual (até o dia atual)
      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const todayOfMonth = new Date(selectedYear, selectedMonth - 1, today + 1);
      
      // Busca os lucros do período atual
      const currentMonthProfits = await this.overViewService.findProfits(
        firstDayOfMonth,
        todayOfMonth,
      );


      const currentMonthTotal = currentMonthProfits.reduce(
        (acc, profit) => acc + Number(profit.profit_day),
        0,
      );

      // Datas do mesmo período no mês anterior
      const previousMonth = selectedMonth - 1 || 12;
      const previousYear =
        previousMonth === 12 ? selectedYear - 1 : selectedYear;

      const firstDayOfPreviousMonth = new Date(
        previousYear,
        previousMonth - 1,
        1,
      );
      const sameDayOfPreviousMonth = new Date(
        previousYear,
        previousMonth - 1,
        today + 1,
      );

      // Busca os lucros do mesmo período no mês anterior
      const previousMonthProfits = await this.overViewService.findProfits(
        firstDayOfPreviousMonth,
        sameDayOfPreviousMonth,
      );

      const previousMonthTotal = previousMonthProfits.reduce(
        (acc, profit) => acc + Number(profit.profit_day),
        0,
      );

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
