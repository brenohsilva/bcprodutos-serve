import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';

@Injectable()
export class GetLastShoppingUseCase {
  constructor(private readonly shoppingService: ShoppingService) {}

  async execute() {
    try {
      const response = await this.shoppingService.findLatestShopping();
      const formattedResponse = response.map((shopping) => ({
        id: shopping.id,
        description: shopping.description,
        total_value: shopping.total_value,
        shopping_date: shopping.shopping_date,
        payment_method: shopping.payment_method,
        installment: shopping.installment,
        tax: shopping.tax,
        products: shopping.shoppingitens.map((item) => ({
          name: item.product.name,
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
      throw new HttpException(
        'Erro ao buscar as suas compras. Tente novamente mais tarde.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
