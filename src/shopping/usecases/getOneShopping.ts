import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';


@Injectable()
export class GetOneShoppingUseCase {
    constructor(private readonly shoppingService: ShoppingService) {}
  async execute(id: string) {
    try {
      const product = await this.shoppingService.findOne(Number(id));

      if (!product) {
        throw new HttpException(
          'Compra não encontrada.',
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
        'Erro ao buscar a compra. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
