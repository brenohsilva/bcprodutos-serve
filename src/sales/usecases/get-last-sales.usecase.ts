import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class GetLastSalesUseCase {
  constructor(
    private readonly salesService: SalesService,
    private readonly productsService: ProductsService,
  ) {}

  async execute() {
    try {
      const response = await this.salesService.findLastSales();

      const formattedResponse = response.map((sale) => ({
        id: sale.id,
        description: sale.description,
        total_gross_value: sale.total_gross_value,
        total_net_value: sale.total_net_value,
        additional: sale.additional,
        discount: sale.discount,
        coast: sale.coast,
        payment_method: sale.payment_method,
        sales_date: sale.sales_date,
        products: sale.salesitens.map((item) => ({
          ...item.product,
          amount: item.amount,
          unit_price: item.unit_price,
          sub_total: item.sub_total,
        })),
      }));

      return {
        success: true,
        data: formattedResponse,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar as vendas',
        error: error.message,
      };
    }
  }
}
