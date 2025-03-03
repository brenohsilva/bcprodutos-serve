import { Injectable } from '@nestjs/common';
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
          description: data.description,
          total_value: data.total_value,
          payment_method: data.payment_method,
          installment: data.installment,
          tax: data.tax,
        },
      });

      const itens = data.itens.map((item) => ({
        shoppingId: shopping.id,
        productId: Number(item.productId),
        amount: item.amount,
        unit_price: item.sub_total / item.amount,
        sub_total: item.sub_total,
      }));

      await this.prisma.shoppingitens.createMany({
        data: itens,
      });

      await Promise.all(
        data.itens.map(async (item) => {
          const product = await this.prisma.product.findUnique({
            where: { id: Number(item.productId) },
            select: { amount: true, shopping_price: true },
          });

          const newUnitPrice = item.sub_total / item.amount;
          let updatedShoppingPrice = newUnitPrice;

          if (Number(product.shopping_price) > 0) {
            updatedShoppingPrice =
              (Number(product.shopping_price) + newUnitPrice) / 2;
          }

          await this.prisma.product.update({
            where: { id: Number(item.productId) },
            data: {
              amount: { increment: item.amount },
              shopping_price: updatedShoppingPrice,
            },
          });
        }),
      );

      const shoppingWithItens = await this.prisma.shopping.findUnique({
        where: { id: shopping.id },
        include: { shoppingitens: true },
      });

      return shoppingWithItens;
    } catch (error) {
      throw error;
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

  async findShoppingByPeriod(beginning: Date, end: Date) {
    return this.prisma.shopping.findMany({
      include: {
        shoppingitens: true,
      },
      where: {
        shopping_date: {
          gte: beginning,
          lte: end,
        },
      },
    });
  }

  async findLatestShopping() {
    return await this.prisma.shopping.findMany({
      take: 5,
      orderBy: {
        shopping_date: 'desc',
      },
      include: {
        shoppingitens: {
          select: {
            product: {
              select: {
                name: true,
              },
            },
            amount: true,
            unit_price: true,
            sub_total: true,
          },
        },
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
    return total._sum.total_value ? total._sum.total_value.toFixed(2) : '0.00';
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

    return Number(total._sum.sub_total) || 0;
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
