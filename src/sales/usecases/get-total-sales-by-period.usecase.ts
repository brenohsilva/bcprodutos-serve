import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import {
  endOfMonth,
  startOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

@Injectable()
export class GetTotalSalesByPeriodUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute(period: string, month?: string) {
    try {
      const today = new Date();
      let currentPeriodStart: Date;
      let currentPeriodEnd: Date;
      let previousPeriodStart: Date;
      let previousPeriodEnd: Date;

      if (period === 'all') {
        const response = await this.salesService.getTotalSales();
        return { success: true, data: response };
      }

      let baseDate = today;

      if (month) {
        const monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
          throw new HttpException(
            'Mês inválido. O valor deve estar entre 1 e 12.',
            HttpStatus.BAD_REQUEST,
          );
        }
        baseDate = new Date(
          today.getFullYear(),
          monthNumber - 1,
          today.getDate(),
        );
      }

      if (period === 'month') {
        currentPeriodStart = startOfMonth(baseDate);
        currentPeriodEnd = endOfMonth(baseDate);

        const prevMonth = subMonths(baseDate, 1);
        previousPeriodStart = startOfMonth(prevMonth);
        previousPeriodEnd = endOfMonth(prevMonth);
      }

      if (period === 'week') {
        currentPeriodStart = startOfWeek(baseDate, { weekStartsOn: 0 });
        currentPeriodEnd = endOfWeek(baseDate, { weekStartsOn: 0 });

        const prevMonth = subMonths(baseDate, 1);
        const prevMonthSameWeek = new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth(),
          baseDate.getDate(),
        );

        previousPeriodStart = startOfWeek(prevMonthSameWeek, {
          weekStartsOn: 0,
        });
        previousPeriodEnd = endOfWeek(prevMonthSameWeek, { weekStartsOn: 0 });
      }

      const currentPeriodData = await this.salesService.getTotalSalesByPeriod(
        currentPeriodStart,
        currentPeriodEnd,
      );

      const previousPeriodData = await this.salesService.getTotalSalesByPeriod(
        previousPeriodStart,
        previousPeriodEnd,
      );

      return {
        success: true,
        data: {
          currentPeriod: currentPeriodData,
          previousPeriod: previousPeriodData,
        },
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
