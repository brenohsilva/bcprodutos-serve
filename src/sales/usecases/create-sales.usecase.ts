/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { SalesService } from '../sales.service';
import { CreateSalesDto } from '../dto/create-sale.dto';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { RegisterProfitUseCase } from './register-profit-day.usecase';

@Injectable()
export class CreateSaleUseCase {
  constructor(
    private readonly salesService: SalesService,
    private prisma: PrismaService,
    private registerProfit: RegisterProfitUseCase,
  ) {}

  async execute(data: CreateSalesDto) {
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

      const sales = await this.salesService.create(data);

      if (sales) {
        const profit = await this.registerProfit.execute(
          existingProducts,
          sales,
        );
        return {
          success: true,
          data: 'Venda registrada com sucesso com o lucro de: ' + profit,
        };
      }
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HttpException(
          'Erro ao processar a venda, Verifique todos os campos e tente novamente',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(error);
      throw new HttpException(
        'Erro ao processar a venda. Tente novamente mais tarde.',

        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
