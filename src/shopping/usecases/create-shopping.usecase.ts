/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ShoppingService } from '../shopping.service';
import { PrismaService } from 'src/prisma.service';
import { CreateShoppingDto } from '../dto/create-shopping.dto';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

@Injectable()
export class CreateShoppingUseCase {
  constructor(
    private readonly shoppingService: ShoppingService,
    private prisma: PrismaService,
  ) {}

  async execute(data: CreateShoppingDto) {
    try {
      const productIds = data.itens.map((item) => Number(item.productId));
      const existingProducts = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      if (existingProducts.length !== productIds.length) {
        throw new HttpException(
          'Um ou mais produtos não foram encontrados.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const shopping = await this.shoppingService.create(data);

      if (shopping) {
        return {
          success: true,
          data: 'Compra registrada com sucesso',
        };
      }
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HttpException(
          'Erro ao processar a compra, Verifique todos os campos e tente novamente',
          HttpStatus.BAD_REQUEST
        );
      }

      console.log(error);
      throw new HttpException(
        'Erro ao processar a compra. Tente novamente mais tarde.',

        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
