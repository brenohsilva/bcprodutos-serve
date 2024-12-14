import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { GetOneProductUseCase } from './get-one-product.usecase';

@Injectable()
export class UpdateProductsUseCase {
  constructor(private readonly productsService: ProductsService, private readonly getOneProduct: GetOneProductUseCase) {}

  async execute(id: string, data: UpdateProductDto) {
    try {
      
      const existingProduct = await this.getOneProduct.execute(id);
      if (!existingProduct) {
        throw new HttpException('Produto não encontrado.', HttpStatus.NOT_FOUND);
      }
     
      const updatedProduct = await this.productsService.update(Number(id), data);

      return {
        success: true,
        data: updatedProduct,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar o produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
