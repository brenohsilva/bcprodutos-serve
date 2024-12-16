import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { UpdateShoppingDto } from './dto/update-shopping.dto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class ShoppingService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateShoppingDto) {
    try {
      const shopping = await this.prisma.shopping.create({
        data: {
          total_value: data.total_value,
        },
      });

      const itens = data.itens.map((item) => ({
        shoppingId: shopping.id,
        productId: Number(item.productId),
        amount: item.amount,
        unit_price: item.unit_price,
        sub_total: item.amount * item.unit_price,
      }));

      await this.prisma.shoppingitens.createMany({
        data: itens,
      });

      const shoppingWithItens = await this.prisma.shopping.findUnique({
        where: { id: shopping.id },
        include: { shoppingitens: true },
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
        shoppingitens: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.shopping.findUnique({
      where: {
        id,
      },
      include: {
        shoppingitens: true,
      },
    });
  }

  async getTotalShoppingByPeriod(beginning: Date, end: Date) {
    return await this.prisma.shopping.count({
      where: {
        shopping_date: {
          gte: beginning,
          lte: end,
        },
      },
    });
  }

  async getTotalShopping() {
    return await this.prisma.shopping.count();
  }

  async getTotalValueShoppingByPeriod(beginning: Date, end: Date) {
    const total = await this.prisma.shopping.aggregate({
      _sum: {
        total_value: true,
      },
      where: {
        shopping_date: {
          gte: beginning,
          lte: end,
        },
      },
    });
    return total._sum.total_value || 0;
  }

  async getTotalValueShopping() {
    const total = await this.prisma.shopping.aggregate({
      _sum: {
        total_value: true,
      },
    });
    return total._sum.total_value;
  }

  async findTotalShoppingByProduct(productId: number): Promise<number> {
    const total = await this.prisma.shoppingitens.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        productId: productId,
      },
    });

    return total._sum.amount || 0;
  }

  async findTotalShoppingValueByProduct(productId: number): Promise<number> {
    const total = await this.prisma.shoppingitens.aggregate({
      _sum: {
        sub_total: true,
      },
      where: {
        productId: productId,
      },
    });

    return total._sum.sub_total || 0;
  }

  async findTotalShoppingProductByPeriod(
    productId: number,
    beginning: Date,
    end: Date,
  ) {
    const total = await this.prisma.shoppingitens.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        productId,
        shopping: {
          shopping_date: {
            gte: beginning,
            lte: end,
          },
        },
      },
    });
    return total._sum.amount || 0;
  }

  async findTotalShoppingValueProductByPeriod(
    productId: number,
    beginning: Date,
    end: Date,
  ) {
    const total = await this.prisma.shoppingitens.aggregate({
      _sum: {
        sub_total: true,
      },
      where: {
        productId,
        shopping: {
          shopping_date: {
            gte: beginning,
            lte: end,
          },
        },
      },
    });
    return total._sum.sub_total || 0;
  }

  async update(id: number, data: UpdateShoppingDto) {
    const shoppingData = await this.prisma.shopping.update({
      where: { id },
      data: {
        shopping_date: data.shopping_date,
        total_value: data.total_value,
      },
    });

    for (const item of data.itens) {
      if (item.id) {
        const response = await this.prisma.shoppingitens.update({
          where: { id: item.id },
          data: {
            amount: item.amount,
            unit_price: item.unit_price,
            sub_total: item.amount * item.unit_price,
          },
        });
      } else {
        await this.prisma.shoppingitens.create({
          data: {
            shoppingId: id,
            productId: Number(item.productId),
            amount: item.amount,
            unit_price: item.unit_price,
            sub_total: item.amount * item.unit_price,
          },
        });
      }
    }
    const itemIds = data.itens.map((item) => item.id).filter(Boolean);
    await this.prisma.shoppingitens.deleteMany({
      where: {
        shoppingId: id,
        id: { notIn: itemIds },
      },
    });

    return `shopping updated successfully`;
  }

  async remove(shoppingId: number) {
    const deleteshoppingitens = this.prisma.shoppingitens.deleteMany({
      where: {
        shoppingId,
      },
    });
    const deleteShopping = this.prisma.shopping.delete({
      where: {
        id: shoppingId,
      },
    });
    this.prisma.$transaction([deleteshoppingitens, deleteShopping]);

    return 'shopping deleted successfully';
  }
}
