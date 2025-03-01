import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GetLastSalesUseCase } from './get-last-sales.usecase';

@Injectable()
export class GetBestSalesOfMonthUseCase {
  constructor(private readonly getLastSalesUseCase: GetLastSalesUseCase) {}

  async execute(month?: string) {
    try {
      const response = await this.getLastSalesUseCase.execute(month);

      if (!response || !response.data || response.data.length === 0) {
        throw new HttpException(
          'Nenhuma venda encontrada para o mês especificado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const salesByDate: Record<string, number> = {};

      for (const sale of response.data) {
        const date = sale.sales_date;
        const value = sale.total_net_value.toNumber();

        salesByDate[date] = (salesByDate[date] || 0) + value;
      }

      let bestDay = '';
      let highestTotal = 0;

      for (const [date, total] of Object.entries(salesByDate)) {
        if (total > highestTotal) {
          bestDay = date;
          highestTotal = total;
        }
      }

      return {
        best_sales_day: bestDay,
        total_net_value: highestTotal,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao processar o melhor dia de vendas do mês.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
