import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class GetQuantityOfProductsByNameUseCase {
  constructor(private readonly productsService: ProductsService) {}

  async execute() {
    try {
      const products = await this.productsService.findAll();

      const productCounts = products.reduce((acc, product) => {
        acc[product.name] = (acc[product.name] || 0) + 1;
        return acc;
      }, {});

      return {
        success: true,
        data: productCounts,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao buscar os produtos. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
