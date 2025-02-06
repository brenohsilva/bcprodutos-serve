import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { ProductsService } from 'src/products/products.service';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class GetQuantityOfProductsSoldByPeriodUseCase {
  constructor(
    private readonly salesService: SalesService,
    private readonly productsService: ProductsService,
  ) {}

  async execute(period: string) {
    try {
      const today = new Date();
      let beginning: Date;
      let end: Date;
      if (period == 'week') {
        beginning = startOfWeek(today, { weekStartsOn: 0 });
        end = endOfWeek(today, { weekStartsOn: 0 });
      }
      if (period == 'month') {
        beginning = startOfMonth(today);
        end = endOfMonth(today);
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

      const productSold = detailedProducts.reduce((sum, product) => {
        sum += product.total_sold;
        return sum;
      }, 0);

      return { success: true, data: productSold };
    } catch (error) {
      console.error('Error counting total sales of products:', error);
      throw error;
    }
  }
}
