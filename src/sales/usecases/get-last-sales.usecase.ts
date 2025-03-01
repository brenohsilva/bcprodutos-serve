import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { ProductsService } from 'src/products/products.service';
import * as moment from 'moment';

@Injectable()
export class GetLastSalesUseCase {
  constructor(
    private readonly salesService: SalesService,
    private readonly productsService: ProductsService,
  ) {}

  async execute(month?: string) {
    try {
      let startDate: Date;
      let endDate: Date;
      const now = new Date();
      const selectedYear = now.getFullYear();
      let selectedMonth = now.getMonth() + 1;

      if (month) {
        const monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
          throw new HttpException(
            'Mês inválido. O valor deve estar entre 1 e 12.',
            HttpStatus.BAD_REQUEST,
          );
        }
        selectedMonth = monthNumber;
      }

      startDate = new Date(selectedYear, selectedMonth - 1, 1);
      endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

      const response = await this.salesService.findLastSales(
        startDate,
        endDate,
      );

      if (!response || response.length === 0) {
        return {
          success: true,
          data: [],
          message: 'Nenhuma venda encontrada para o período selecionado.',
        };
      }

      const formattedResponse = response.map((sale) => ({
        id: sale.id,
        description: sale.description,
        total_gross_value: sale.total_gross_value,
        total_net_value: sale.total_net_value,
        additional: sale.additional,
        discount: sale.discount,
        coast: sale.coast,
        payment_method: sale.payment_method,
        sales_date: moment(sale.sales_date).format('DD/MM/YYYY HH:mm'),
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
      console.error('Erro ao buscar as vendas:', error);
      throw new HttpException(
        'Erro ao buscar as vendas. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
