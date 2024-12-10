import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SalesService } from "../Sales.service";

import { PrismaService } from "src/prisma.service";
import { UpdateSalesDto } from "../dto/update-sale.dto";

@Injectable()
export class UpdateSalesUseCase {
  constructor(private readonly SalesService: SalesService, private prisma: PrismaService) {}

  async execute(id: string, data: UpdateSalesDto, ) {
    try {

        const existingSales = await this.prisma.sales.findUnique({
            where: {id: Number(id)},
            include: { itens: true },
          });
    
          if (!existingSales) {
            throw new HttpException('Venda não encontrada.', HttpStatus.NOT_FOUND);
          }

      const updatedSales = await this.SalesService.update(Number(id), data);
      return {
        success: true,
        data: updatedSales,
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
