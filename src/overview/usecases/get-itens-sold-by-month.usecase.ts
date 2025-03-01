import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OverViewService } from '../overview.service';

@Injectable()
export class GetItensSoldByMonthUseCase {
  constructor(private readonly overViewService: OverViewService) {}

  async execute(month?: string) {
    try {
      const now = new Date();
      const selectedYear = now.getFullYear();
      let selectedMonth = now.getMonth() + 1;

      if (month) {
        const monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
          throw new HttpException(
            'Mês inválido. O valor deve estar entre 1 e 12.',
            HttpStatus.BAD_REQUEST,
          );
        }
        selectedMonth = monthNumber;
      }

      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const firstDayOfNextMonth = new Date(selectedYear, selectedMonth, 1);

      const response = await this.overViewService.findSalesItensByMonth(
        firstDayOfMonth,
        firstDayOfNextMonth,
      );

      const itemsSold = response.reduce(
        (acc, item) => {
          const productName = item.product.name;
          acc[productName] = (acc[productName] || 0) + item.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

      return itemsSold;
    } catch (error) {
      throw new HttpException(
        'Erro ao processar os itens vendidos.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
