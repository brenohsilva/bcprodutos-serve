import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import * as moment from 'moment';

@Injectable()
export class GetDailySalesUseCase {
  constructor(private readonly salesService: SalesService) {}
  async execute() {
    try {
      const now = new Date();
      const selectedYear = now.getFullYear();
      const selectedMonth = now.getMonth() + 1;
      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const firstDayOfNextMonth = new Date(selectedYear, selectedMonth, 1);
      const response = await this.salesService.findSalesByPeriod(
        firstDayOfMonth,
        firstDayOfNextMonth,
      );

      if (response) {
        const formattedData = response.map(
          ({ id, sales_date, total_gross_value }) => ({
            id,
            day: moment(sales_date).format('DD/MM'),
            total_gross_value,
          }),
        );
        return {
          success: true,
          data: formattedData,
        };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao pegar as vendas. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
