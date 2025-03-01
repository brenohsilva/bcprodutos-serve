import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class GetTotalSalesByPeriodUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute(period: string, month?: string) {
    try {
      const today = new Date();
      let beginning: Date;
      let end: Date;

      if (period === 'all') {
        const response = await this.salesService.getTotalSales();
        return {
          success: true,
          data: response,
        };
      }

      if (period === 'week') {
        beginning = startOfWeek(today, { weekStartsOn: 0 });
        end = endOfWeek(today, { weekStartsOn: 0 });
      }

      if (period === 'month') {
        if (month) {
          const monthNumber = parseInt(month, 10);
          if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            throw new HttpException(
              'Mês inválido. O valor deve estar entre 1 e 12.',
              HttpStatus.BAD_REQUEST,
            );
          }

          const year = today.getFullYear();
          beginning = new Date(year, monthNumber - 1, 1);
          end = endOfMonth(beginning);
        } else {
          beginning = startOfMonth(today);
          end = endOfMonth(today);
        }
      }

      const response = await this.salesService.getTotalSalesByPeriod(
        beginning,
        end,
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao trazer a quantidade total de suas vendas. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
