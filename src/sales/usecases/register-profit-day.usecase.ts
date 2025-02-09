import { Injectable } from '@nestjs/common';
import { OverViewService } from 'src/overview/overview.service';

@Injectable()
export class RegisterProfitUseCase {
  constructor(private readonly overViewService: OverViewService) {}

  async execute(existingProducts: any[], sales: any) {
    try {
      console.log(existingProducts);
      const productCostMap = new Map(
        existingProducts.map((p) => [p.id, p.shopping_price]),
      );

      const totalCost = sales.salesitens.reduce((acc, item) => {
        const shoppingValue = productCostMap.get(item.productId) || 0;
        return acc + shoppingValue * item.amount;
      }, 0);

      const profit = sales.total_net_value - totalCost;

      const day = new Date();

      await this.overViewService.registerProfit(sales.id, day, profit);

      return profit;
    } catch (error) {
      console.error('Erro ao registrar lucro:', error);
      throw new Error('Erro ao registrar lucro.');
    }
  }
}
