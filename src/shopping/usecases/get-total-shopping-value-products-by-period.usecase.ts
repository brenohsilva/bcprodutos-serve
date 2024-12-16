import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class GetTotalShoppingValueProductsByPeriodUseCase {
  constructor(private readonly shoppingService: ShoppingService) {}
  async execute(productId: string, period: string) {
    try {
      const product = this.shoppingService.findOne(Number(productId));
      if (!product) {
        throw new HttpException(
          'Produto não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const today = new Date();
      let beginning: Date;
      let end: Date;

      if (period == 'all') {
        const response =
          await this.shoppingService.findTotalShoppingValueByProduct(
            Number(productId),
          );
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
      const response =
        await this.shoppingService.findTotalShoppingValueProductByPeriod(
          Number(productId),
          beginning,
          end,
        );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao buscar o valor total de compras por produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
