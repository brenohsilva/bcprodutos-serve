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
      const today = now.getDate();

      const isCurrentMonth =
        selectedYear === now.getFullYear() &&
        selectedMonth === now.getMonth() + 1;

      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const endDayOfMonth = isCurrentMonth
        ? new Date(selectedYear, selectedMonth - 1, today + 1)
        : new Date(selectedYear, selectedMonth, 1); // 1º dia do próximo mês (exclusivo)

      // Busca os lucros do período atual
      const currentMonthProfits = await this.overViewService.findProfits(
        firstDayOfMonth,
        endDayOfMonth,
      );

      const currentMonthTotal = currentMonthProfits.reduce(
        (acc, profit) => acc + Number(profit.profit_day),
        0,
      );

      // Período do mês anterior
      const previousMonth = selectedMonth - 1 || 12;
      const previousYear =
        previousMonth === 12 ? selectedYear - 1 : selectedYear;

      const firstDayOfPreviousMonth = new Date(
        previousYear,
        previousMonth - 1,
        1,
      );
      const endDayOfPreviousMonth = new Date(previousYear, previousMonth, 1); // 1º dia do mês seguinte (exclusivo)

      const previousMonthProfits = await this.overViewService.findProfits(
        firstDayOfPreviousMonth,
        endDayOfPreviousMonth,
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
