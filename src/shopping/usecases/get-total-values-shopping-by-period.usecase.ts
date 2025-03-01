import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class GetTotalValueShoppingByPeriodUseCase {
  constructor(private readonly shoppingService: ShoppingService) {}

  async execute(period: string, month?: string) {
    try {
      const today = new Date();
      let beginning: Date;
      let end: Date;

      if (period === 'all') {
        const response = await this.shoppingService.getTotalValueShopping();
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

      const response = await this.shoppingService.getTotalValueShoppingByPeriod(
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
        'Erro ao trazer a soma de suas compras. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
