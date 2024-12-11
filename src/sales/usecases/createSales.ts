/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { SalesService } from '../sales.service';
import { CreateSalesDto } from '../dto/create-sale.dto';


@Injectable()
export class CreateSaleUseCase {
  constructor(private readonly salesService: SalesService, private prisma: PrismaService) {}

  async execute(data: CreateSalesDto) {
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

        const shopping = this.salesService.create(data)

        return {
            success: true,
            data: 'Venda registrada com sucesso',
          };

    } catch (error) {

        if (error instanceof HttpException) {
            throw error;
          }
    
          // Erro genérico
          throw new HttpException(
            'Erro ao processar a venda. Tente novamente mais tarde.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        
    }
  }
}
