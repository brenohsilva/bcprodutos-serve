import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { SalesService } from "../sales.service";
import { UpdateSalesDto } from "../dto/update-sale.dto";

@Injectable()
export class UpdateSaleUseCase {
  constructor(private readonly salesService: SalesService, private prisma: PrismaService) {}

  async execute(id: string, data: UpdateSalesDto, ) {
    try {

        const existingSale = await this.prisma.sales.findUnique({
            where: {id: Number(id)},
            include: { itens: true },
          });
    
          if (!existingSale) {
            throw new HttpException('Venda não encontrada.', HttpStatus.NOT_FOUND);
          }

      const updatedSales = await this.salesService.update(Number(id), data);
      return {
        success: true,
        data: existingSale,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Erro ao atualizar a venda. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
