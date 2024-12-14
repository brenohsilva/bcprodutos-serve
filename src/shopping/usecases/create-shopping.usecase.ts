/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingService } from '../shopping.service';
import { PrismaService } from 'src/prisma.service';
import { CreateShoppingDto } from '../dto/create-shopping.dto';

@Injectable()
export class CreateShoppingUseCase {
  constructor(private readonly shoppingService: ShoppingService, private prisma: PrismaService) {}

  async execute(data: CreateShoppingDto) {
    try {
        const productIds = data.itens.map((item)=> Number(item.productId))
        const existingProducts = await this.prisma.product.findMany({
            where: {
                id: { in: productIds}
            }
        })

        if (existingProducts.length !== productIds.length) {
            throw new HttpException(
                'Um ou mais produtos não foram encontrados.',
                HttpStatus.BAD_REQUEST,
              );
        }

        const shopping = this.shoppingService.create(data)

        return {
            success: true,
            data: 'Compra registrada com sucesso',
          };

    } catch (error) {

        if (error instanceof HttpException) {
            throw error;
          }
    
          // Erro genérico
          throw new HttpException(
            'Erro ao processar a compra. Tente novamente mais tarde.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        
    }
  }
}
