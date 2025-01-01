/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly productsService: ProductsService) {}

  async execute(query: any) {
    console.log(query)
    try {
      const products = await this.productsService.findAll(query);

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Erro ao buscar os produtos. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
