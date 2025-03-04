import { Injectable } from '@nestjs/common';
import { SalesService } from 'src/sales/sales.service';

@Injectable()
export class GetProductSoldByMonthUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute(month: number) {
    const salesItens = await this.salesService.findAllSalesItens();

    const productSalesCount: Record<string, number> = {};

    salesItens.forEach((item) => {
      const saleMonth = item.sales.sales_date.getMonth() + 1; // getMonth() retorna 0-11
      if (saleMonth === month) {
        if (!productSalesCount[item.product.name]) {
          productSalesCount[item.product.name] = 0;
        }
        productSalesCount[item.product.name] += item.amount;
      }
    });

    return {
      success: true,
      data: productSalesCount,
    };
  }
}
