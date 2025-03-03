import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

@Injectable()
export class GetTotalShoppingByPeriodUseCase {
  constructor(private readonly shoppingService: ShoppingService) {}

  async execute(period: string, month?: string) {
    try {
      if (period === 'all') {
        const response = await this.shoppingService.getTotalShopping();
        return { success: true, data: response };
      }

      const today = new Date();
      let currentStart: Date, currentEnd: Date;
      let previousStart: Date, previousEnd: Date;

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
        currentStart = startOfMonth(baseDate);
        currentEnd = endOfMonth(baseDate);

        const prevMonth = subMonths(baseDate, 1);
        previousStart = startOfMonth(prevMonth);
        previousEnd = endOfMonth(prevMonth);
      } else if (period === 'week') {
        currentStart = startOfWeek(baseDate, { weekStartsOn: 0 });
        currentEnd = endOfWeek(baseDate, { weekStartsOn: 0 });

        const prevMonth = subMonths(baseDate, 1);
        const prevMonthSameWeek = new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth(),
          baseDate.getDate(),
        );

        previousStart = startOfWeek(prevMonthSameWeek, { weekStartsOn: 0 });
        previousEnd = endOfWeek(prevMonthSameWeek, { weekStartsOn: 0 });
      } else {
        throw new HttpException(
          'Período inválido. Use "week" ou "month".',
          HttpStatus.BAD_REQUEST,
        );
      }

      const [currentShopping, previousShopping] = await Promise.all([
        this.shoppingService.getTotalShoppingByPeriod(currentStart, currentEnd),
        this.shoppingService.getTotalShoppingByPeriod(
          previousStart,
          previousEnd,
        ),
      ]);

      return {
        success: true,
        data: {
          currentPeriod: currentShopping,
          previousPeriod: previousShopping,
        },
      };
    } catch (error) {
      console.error(
        'Erro ao trazer a quantidade total de suas compras:',
        error,
      );
      throw new HttpException(
        'Erro ao trazer a quantidade total de suas compras. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
