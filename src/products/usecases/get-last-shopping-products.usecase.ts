import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class GetLastShoppingProductsUseCase {
  constructor(private readonly productsService: ProductsService) {}

  async execute() {
    try {
      const response = await this.productsService.findLastShoppingProducts();
      const products = response.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        amount: item.amount,
        image: item.product.image,
        size: item.product.size,
        color: item.product.color,
        category: item.product.category,
        unitPrice: item.unit_price,
        subTotal: item.sub_total,
        salesDate: item.shopping.shopping_date,
      }));

      return {
        success: true,
        data: products,
      };
    } catch (error) {}
  }
}
