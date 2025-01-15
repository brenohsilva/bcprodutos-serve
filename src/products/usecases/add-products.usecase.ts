import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AddProductsUseCase {
  constructor(private readonly productsService: ProductsService) {}

  async execute(data: CreateProductDto) {
    try {
      const product = await this.productsService.create(data);
      return {
        success: true,
        data: product,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Já existe um produto com esses dados.',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException(
        'Erro ao criar o produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
