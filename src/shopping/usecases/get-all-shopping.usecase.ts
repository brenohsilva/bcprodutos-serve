/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';

@Injectable()
export class GetAllShoppingUseCase {
  constructor(private readonly shoppingService: ShoppingService) {}

  async execute() {
    try {
      const shopping = await this.shoppingService.findAll();

      return {
        success: true,
        data: shopping,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as suas compras. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
