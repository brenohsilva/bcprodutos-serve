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
          totalValue: data.totalValue,
        },
      });

      const itens = data.itens.map((item) => ({
        shoppingId: shopping.id,
        productId: Number(item.productId),
        amount: item.amount,
        unitPrice: item.unitPrice,
        subtotal: item.amount * item.unitPrice,
      }));

      await this.prisma.shoppingItens.createMany({
        data: itens,
      });

      const shoppingWithItens = await this.prisma.shopping.findUnique({
        where: { id: shopping.id },
        include: { itens: true },
      });

      return shoppingWithItens;
    } catch (error) {
      throw new HttpException(
        'Erro ao criar a compra. Verifique os dados e tente novamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return this.prisma.shopping.findMany({
      include: {
        itens: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.shopping.findUnique({
      where: {
        id,
      },
      include: {
        itens: true,
      },
    });
  }

  async update(id: number, data: UpdateShoppingDto) {
    
      const shoppingData = await this.prisma.shopping.update({
        where: { id },
        data: {
          shoppingDate: data.shoppingDate,
          totalValue: data.totalValue,
        },
      });
 
      for (const item of data.itens) {
        if (item.id) {
          const response = await this.prisma.shoppingItens.update({
            where: { id: item.id },
            data: {
              amount: item.amount,
              unitPrice: item.unitPrice,
              subtotal: item.amount * item.unitPrice,
            },
          });
        } else {
          await this.prisma.shoppingItens.create({
            data: {
              shoppingId: id,
              productId: Number(item.productId),
              amount: item.amount,
              unitPrice: item.unitPrice,
              subtotal: item.amount * item.unitPrice,
            },
          });
        }
      }
      const itemIds = data.itens.map((item) => item.id).filter(Boolean);
      await this.prisma.shoppingItens.deleteMany({
        where: {
          shoppingId: id,
          id: { notIn: itemIds },
        },
      });
      
    return `shopping updated successfully`;
  }

  async remove(shoppingId: number) {
    const deleteShoppingItens = this.prisma.shoppingItens.deleteMany({
      where: {
        shoppingId
      }
    })
    const deleteShopping = this.prisma.shopping.delete({
      where: {
        id: shoppingId
      }
    })
    this.prisma.$transaction([deleteShoppingItens, deleteShopping])
    
    return 'shopping deleted successfully';
  }
}
