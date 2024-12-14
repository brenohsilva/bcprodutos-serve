import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class GetTotalValueSalesByPeriodUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute(period: string) {
    try {
      const today = new Date();
      let beginning: Date;
      let end: Date;
      if (period == 'all') {
        const response = await this.salesService.getTotalValueSales();
        return {
          success: true,
          data: response,
        };
      }
      if (period == 'week') {
        beginning = startOfWeek(today, { weekStartsOn: 0 });
        end = endOfWeek(today, { weekStartsOn: 0 });
      }
      if (period == 'month') {
        beginning = startOfMonth(today);
        end = endOfMonth(today);
      }
      const response = await this.salesService.getTotalValueSalesByPeriod(
        beginning,
        end,
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao trazer a soma de suas vendas. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
