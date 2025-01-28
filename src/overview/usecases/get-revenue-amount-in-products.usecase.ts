import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class GetRevenueAmountInProductsUseCase {
  constructor(private readonly productService: ProductsService) {}

  async execute() {
    try {
      const products = await this.productService.findAll();
      const totalRevenue = products.reduce((acc, product) => {
        return acc + product.sales_price * product.amount;
      }, 0);

      return {
        success: true,
        revenue_amount: totalRevenue,
      };
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      throw error;
    }
  }
}
