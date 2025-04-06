import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import {
  startOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  endOfMonth,
} from 'date-fns';

@Injectable()
export class GetTotalValueSalesByPeriodUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute(period: string, month?: string) {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // 1-12

      let baseDate = today;
      let selectedMonth = currentMonth;

      const isMonthProvided = !!month;

      if (isMonthProvided) {
        const monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
          throw new HttpException(
            'Mês inválido. O valor deve estar entre 1 e 12.',
            HttpStatus.BAD_REQUEST,
          );
        }
        selectedMonth = monthNumber;
        baseDate = new Date(currentYear, selectedMonth - 1, 1);
      }

      let currentPeriodStart: Date;
      let currentPeriodEnd: Date;
      let previousPeriodStart: Date;
      let previousPeriodEnd: Date;

      if (period === 'month') {
        currentPeriodStart = startOfMonth(baseDate);

        const isCurrentMonth =
          selectedMonth === currentMonth &&
          baseDate.getFullYear() === currentYear;

        if (isMonthProvided) {
          // Mês informado => pegar o mês inteiro
          currentPeriodEnd = endOfMonth(baseDate);
          const prevMonth = subMonths(baseDate, 1);
          previousPeriodStart = startOfMonth(prevMonth);
          previousPeriodEnd = endOfMonth(prevMonth);
        } else {
          // Mês NÃO informado => pegar até o dia atual
          currentPeriodEnd = new Date(
            currentYear,
            currentMonth - 1,
            today.getDate(),
            23,
            59,
            59,
            999,
          );

          const prevMonth = subMonths(baseDate, 1);
          previousPeriodStart = startOfMonth(prevMonth);
          previousPeriodEnd = new Date(
            prevMonth.getFullYear(),
            prevMonth.getMonth(),
            today.getDate(),
            23,
            59,
            59,
            999,
          );
        }
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
