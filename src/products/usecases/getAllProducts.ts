/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly productsService: ProductsService) {}

  async execute() {
    try {
      const products = await this.productsService.findAll();

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar os produtos. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
