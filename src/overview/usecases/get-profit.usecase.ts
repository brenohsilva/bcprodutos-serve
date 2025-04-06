import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OverViewService } from '../overview.service';

@Injectable()
export class GetProfitUseCase {
  constructor(private readonly overViewService: OverViewService) {}

  async execute(month?: number, year?: number) {
    try {
      const now = new Date();
      const today = now.getDate();

      const isMonthYearProvided = !!month || !!year;

      const selectedYear = year && !isNaN(year) ? year : now.getFullYear();
      const selectedMonth = month && !isNaN(month) ? month : now.getMonth() + 1;

      const isCurrentMonth =
        selectedYear === now.getFullYear() &&
        selectedMonth === now.getMonth() + 1;

      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);

      const endDayOfMonth = isMonthYearProvided
        ? new Date(selectedYear, selectedMonth, 1) // próximo mês (exclusivo)
        : new Date(selectedYear, selectedMonth - 1, today + 1); // até o dia atual (exclusivo)

      // Lucros do mês atual
      const currentMonthProfits = await this.overViewService.findProfits(
        firstDayOfMonth,
        endDayOfMonth,
      );

      const currentMonthTotal = currentMonthProfits.reduce(
        (acc, profit) => acc + Number(profit.profit_day),
        0,
      );

      // Mês anterior
      const previousMonth = selectedMonth - 1 || 12;
      const previousYear =
        previousMonth === 12 ? selectedYear - 1 : selectedYear;

      const firstDayOfPreviousMonth = new Date(
        previousYear,
        previousMonth - 1,
        1,
      );

      const endDayOfPreviousMonth = isMonthYearProvided
        ? new Date(previousYear, previousMonth, 1)
        : new Date(previousYear, previousMonth - 1, today + 1); // até o mesmo dia do mês anterior

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
