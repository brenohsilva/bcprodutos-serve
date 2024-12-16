import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class GetTotalShoppingByPeriodUseCase {
  constructor(private readonly shoppingService: ShoppingService) {}

  async execute(period: string) {
    try {
      const today = new Date();
      let beginning: Date;
      let end: Date;
      if (period == 'all') {
        const response = await this.shoppingService.getTotalShopping();
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
      const response = await this.shoppingService.getTotalShoppingByPeriod(
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
        'Erro ao trazer a quantidade total de suas compras. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
