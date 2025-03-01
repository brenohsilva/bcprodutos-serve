import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { ProductsService } from 'src/products/products.service';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class GetQuantityOfProductsSoldByPeriodUseCase {
  constructor(
    private readonly salesService: SalesService,
    private readonly productsService: ProductsService,
  ) {}

  async execute(period: string, month?: string) {
    try {
      const today = new Date();
      let beginning: Date;
      let end: Date;

      if (period === 'week') {
        beginning = startOfWeek(today, { weekStartsOn: 0 });
        end = endOfWeek(today, { weekStartsOn: 0 });
      } else if (period === 'month') {
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
      } else {
        throw new HttpException(
          'Período inválido. Use "week" ou "month".',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = await this.salesService.findSalesByPeriod(
        beginning,
        end,
      );

      const totalSalesByProduct = response.reduce(
        (acc, sale) => {
          sale.salesitens.forEach((item) => {
            if (!acc[item.productId]) {
              acc[item.productId] = 0;
            }
            acc[item.productId] += item.amount;
          });
          return acc;
        },
        {} as Record<number, number>,
      );

      const detailedProducts = await Promise.all(
        Object.keys(totalSalesByProduct).map(async (productId) => {
          const product = await this.productsService.findOne(Number(productId));
          return {
            ...product,
            total_sold: totalSalesByProduct[Number(productId)],
          };
        }),
      );

      const totalProductsSold = detailedProducts.reduce((sum, product) => {
        return sum + product.total_sold;
      }, 0);

      return { success: true, data: totalProductsSold };
    } catch (error) {
      console.error(
        'Erro ao contar a quantidade total de produtos vendidos:',
        error,
      );
      throw new HttpException(
        'Erro ao contar a quantidade total de produtos vendidos. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
