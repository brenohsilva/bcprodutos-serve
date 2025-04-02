import { Injectable } from '@nestjs/common';
import { SalesService } from 'src/sales/sales.service';

@Injectable()
export class GetSalesValuesByMonthUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute(month: string, year: number = 2025) {

    const monthNumber = parseInt(month, 10);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      throw new Error("Mês inválido. Deve estar entre '1' e '12'.");
    }

    const beginning = new Date(year, monthNumber - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, monthNumber, 0, 23, 59, 59, 999);

    const previousMonth = new Date(year, monthNumber - 2, 1, 0, 0, 0, 0);
    const previousMonthEnd = new Date(
      year,
      monthNumber - 1,
      0,
      23,
      59,
      59,
      999,
    );
    const currentMonthSales =
      await this.salesService.getTotalValueSalesByPeriod(beginning, end);
    const previousMonthSales =
      await this.salesService.getTotalValueSalesByPeriod(
        previousMonth,
        previousMonthEnd,
      );

    return {
      currentMonthSales,
      previousMonthSales,
    };
  }
}
