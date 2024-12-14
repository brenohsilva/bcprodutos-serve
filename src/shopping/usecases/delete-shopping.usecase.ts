import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';
import { GetOneShoppingUseCase } from './get-one-shopping.usecase';

@Injectable()
export class DeleteShoppingUseCase {
  constructor(private readonly shoppingService: ShoppingService, private readonly getAShopping: GetOneShoppingUseCase) {}

  async execute(id: string) {
    try {
      const existingShopping = await this.getAShopping.execute(id);
      if (!existingShopping) {
        throw new HttpException('Compra não encontrado.', HttpStatus.NOT_FOUND);
      }
     
      const deleteProduct = await this.shoppingService.remove(Number(id));

      return {
        success: true,
        data: "Shopping deleted successfully",
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao deletar o Shopping. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
