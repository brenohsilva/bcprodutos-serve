import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class GetLastSalesProductsUseCase {
  constructor(private readonly productsService: ProductsService) {}

  async execute() {
    try {
      const response = await this.productsService.findLastSalesProducts();
      const products = response.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        image: item.product.image,
        size: item.product.size,
        color: item.product.color,
        category: item.product.category,
        unitPrice: item.unit_price,
        subTotal: item.sub_total,
        salesDate: item.sales.sales_date,
      }));

      return {
        success: true,
        data: products,
      };
    } catch (error) {}
  }
}
