import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class GetQuantityOfSalesOfProductsUseCase {
  constructor(
    private readonly salesService: SalesService,
    private readonly productsService: ProductsService,
  ) {}

  async execute() {
    try {
      const response = await this.salesService.findAll();
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

      return detailedProducts;
    } catch (error) {
      console.error('Error counting total sales of products:', error);
      throw error;
    }
  }
}
