import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { GetOneProductUseCase } from './getOneProduct';

@Injectable()
export class DeleteProductsUseCase {
  constructor(private readonly productsService: ProductsService, private readonly getOneProduct: GetOneProductUseCase) {}

  async execute(id: string) {
    try {
      const existingProduct = await this.getOneProduct.execute(id);
      if (!existingProduct) {
        throw new HttpException('Produto não encontrado.', HttpStatus.NOT_FOUND);
      }
     
      const deleteProduct = await this.productsService.remove(Number(id));

      return {
        success: true,
        data: "Product deleted successfully",
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao deletar o produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
