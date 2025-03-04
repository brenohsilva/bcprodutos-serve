import { Injectable } from '@nestjs/common';
import { FindAllSalesUseCase } from 'src/sales/usecases/find-all-sales.usecase';
import { OverViewService } from '../overview.service';

@Injectable()
export class GetYearSummaryUseCase {
  constructor(
    private getAllSalesUseCase: FindAllSalesUseCase,
    private readonly overViewService: OverViewService,
  ) {}

  async execute() {
    try {
      const sales = await this.getAllSalesUseCase.execute();
      const profits = await this.overViewService.getAllProfits();

      // Agrupar vendas por mês
      const salesSummary = sales.data.reduce(
        (acc, sale) => {
          const date = new Date(sale.sales_date);
          const month = date.toLocaleString('pt-BR', { month: 'long' });

          const totalGrossValue = sale.total_gross_value.toNumber();

          if (!acc[month]) {
            acc[month] = 0;
          }

          acc[month] += totalGrossValue;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Agrupar profits por mês
      const profitsSummary = profits.reduce(
        (acc, profit) => {
          const date = new Date(profit.day);
          const month = date.toLocaleString('pt-BR', { month: 'long' });

          const profitValue = profit.profit_day.toNumber();

          if (!acc[month]) {
            acc[month] = 0;
          }

          acc[month] += profitValue;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        success: true,
        data: {
          sales: salesSummary,
          profits: profitsSummary,
        },
      };
    } catch (error) {
      console.error('Erro ao obter o resumo anual:', error);
      throw error;
    }
  }
}
