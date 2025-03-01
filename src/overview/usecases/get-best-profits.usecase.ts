import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OverViewService } from 'src/overview/overview.service';

@Injectable()
export class GetBestProfitOfMonthUseCase {
  constructor(private readonly overViewService: OverViewService) {}

  async execute(month?: number) {
    try {
      const now = new Date();
      const selectedYear = now.getFullYear();
      const selectedMonth = month && !isNaN(month) ? month : now.getMonth() + 1;
      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const firstDayOfNextMonth = new Date(selectedYear, selectedMonth, 1);

      const response = await this.overViewService.findProfits(
        firstDayOfMonth,
        firstDayOfNextMonth,
      );

      if (!response || response.length === 0) {
        throw new HttpException(
          'Nenhum lucro encontrado para o mês especificado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const profitByDate: Record<string, number> = {};

      for (const profit of response) {
        const date = profit.day.toISOString().split('T')[0];
        const value = profit.profit_day.toNumber();

        profitByDate[date] = (profitByDate[date] || 0) + value;
      }

      let bestDay = '';
      let highestProfit = 0;

      for (const [date, total] of Object.entries(profitByDate)) {
        if (total > highestProfit) {
          bestDay = date;
          highestProfit = total;
        }
      }

      return {
        best_profit_day: bestDay,
        total_profit: highestProfit,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao processar o melhor dia de lucro do mês.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
