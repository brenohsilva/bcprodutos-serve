import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class GetOneProductUseCase {
  constructor(private readonly productsService: ProductsService) {}

  async execute(id: string) {
    try {
      const product = await this.productsService.findOne(Number(id));

      if (!product) {
        throw new HttpException(
          'Produto não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      // Repassa exceções do tipo HttpException diretamente
      if (error instanceof HttpException) {
        throw error;
      }

      // Lança um erro genérico para outros casos
      throw new HttpException(
        'Erro ao buscar o produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
