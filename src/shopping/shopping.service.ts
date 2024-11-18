import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { UpdateShoppingDto } from './dto/update-shopping.dto';
import { PrismaService } from 'src/prisma.service';
import { ShoppingItens } from '@prisma/client';

@Injectable()
export class ShoppingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateShoppingDto) {

    try {
      const shopping = await this.prisma.shopping.create({
        data: {
          totalValue: data.totalValue
        }
      })

      const itens = data.itens.map((item)=> ({
        shoppingId: shopping.id,
        productId: Number(item.productId),
        amount: item.amount,
        unitPrice: item.unitPrice,
        subtotal: item.amount * item.unitPrice,
      }))

      await this.prisma.shoppingItens.createMany({
        data: itens,
      });
      
      const shoppingWithItens = await this.prisma.shopping.findUnique({
        where: { id: shopping.id },
        include: { itens: true },
      });

      return shoppingWithItens

    } catch (error) {
      throw new HttpException(
        'Erro ao criar a compra. Verifique os dados e tente novamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }

  async findAll() {
    return this.prisma.shopping.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} shopping`;
  }

  update(id: number, updateShoppingDto: UpdateShoppingDto) {
    return `This action updates a #${id} shopping`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopping`;
  }
}
