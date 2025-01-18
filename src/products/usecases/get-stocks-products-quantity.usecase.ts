import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class GetStocksProductsQuantityUseCase {
  constructor(private readonly productsService: ProductsService) {}
  async execute() {
    try {
      const response = await this.productsService.findAll();
      let quantity = 0;
      response.map((product) => {
        quantity += product.amount;
      });

      return {
        total_stock: quantity,
      };
    } catch (error) {}
  }
}
