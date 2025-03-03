import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { ProductsService } from 'src/products/products.service';
import {
  endOfMonth,
  startOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

@Injectable()
export class GetQuantityOfProductsSoldByPeriodUseCase {
  constructor(
    private readonly salesService: SalesService,
    private readonly productsService: ProductsService,
  ) {}

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
        currentPeriodEnd = endOfMonth(baseDate);

        const prevMonth = subMonths(baseDate, 1);
        previousPeriodStart = startOfMonth(prevMonth);
        previousPeriodEnd = endOfMonth(prevMonth);
      } else if (period === 'week') {
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
      } else {
        throw new HttpException(
          'Período inválido. Use "week" ou "month".',
          HttpStatus.BAD_REQUEST,
        );
      }

      const [currentSales, previousSales] = await Promise.all([
        this.salesService.findSalesByPeriod(
          currentPeriodStart,
          currentPeriodEnd,
        ),
        this.salesService.findSalesByPeriod(
          previousPeriodStart,
          previousPeriodEnd,
        ),
      ]);

      const getTotalProductsSold = async (sales) => {
        const totalSalesByProduct = sales.reduce(
          (acc, sale) => {
            sale.salesitens.forEach((item) => {
              if (!acc[item.productId]) acc[item.productId] = 0;
              acc[item.productId] += item.amount;
            });
            return acc;
          },
          {} as Record<number, number>,
        );

        const detailedProducts = await Promise.all(
          Object.keys(totalSalesByProduct).map(async (productId) => {
            const product = await this.productsService.findOne(
              Number(productId),
            );
            return {
              ...product,
              total_sold: totalSalesByProduct[Number(productId)],
            };
          }),
        );

        return detailedProducts.reduce(
          (sum, product) => sum + product.total_sold,
          0,
        );
      };

      const [currentTotal, previousTotal] = await Promise.all([
        getTotalProductsSold(currentSales),
        getTotalProductsSold(previousSales),
      ]);

      return {
        success: true,
        data: {
          currentPeriod: currentTotal,
          previousPeriod: previousTotal,
        },
      };
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
