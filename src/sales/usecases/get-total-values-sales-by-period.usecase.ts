import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { startOfMonth, subMonths, startOfWeek, endOfWeek } from 'date-fns';

@Injectable()
export class GetTotalValueSalesByPeriodUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute(period: string, month?: string) {
    try {
      const today = new Date();
      let currentPeriodStart: Date;
      let currentPeriodEnd: Date;
      let previousPeriodStart: Date;
      let previousPeriodEnd: Date;

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
        currentPeriodEnd = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          today.getDate(), // Pegamos até o dia atual do mês
        );

        const prevMonth = subMonths(baseDate, 1);
        previousPeriodStart = startOfMonth(prevMonth);
        previousPeriodEnd = new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth(),
          today.getDate(), // Pegamos até o mesmo dia do mês anterior
        );
      }

      if (period === 'week') {
        currentPeriodStart = startOfWeek(baseDate, { weekStartsOn: 0 }); // Domingo
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

      currentPeriodEnd.setHours(23, 59, 59, 999);

      const currentPeriodData =
        await this.salesService.getTotalValueSalesByPeriod(
          currentPeriodStart,
          currentPeriodEnd,
        );

      const previousPeriodData =
        await this.salesService.getTotalValueSalesByPeriod(
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
        'Erro ao trazer a soma de suas vendas. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
