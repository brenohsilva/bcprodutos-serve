import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ShoppingService } from "../shopping.service";
import { UpdateShoppingDto } from "../dto/update-shopping.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UpdateShoppingUseCase {
  constructor(private readonly shoppingService: ShoppingService, private prisma: PrismaService) {}

  async execute(id: string, data: UpdateShoppingDto, ) {
    try {

        const existingShopping = await this.prisma.shopping.findUnique({
            where: {id: Number(id)},
            include: { itens: true },
          });
    
          if (!existingShopping) {
            throw new HttpException('Compra não encontrada.', HttpStatus.NOT_FOUND);
          }

      const updatedShopping = await this.shoppingService.update(Number(id), data);
      return {
        success: true,
        data: updatedShopping,
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
