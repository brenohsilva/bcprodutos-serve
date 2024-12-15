/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateSalesDto } from './dto/update-sale.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateSalesDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSalesDto) {
    try {
      const sales = await this.prisma.sales.create({
        data: {
          totalValue: data.totalValue,
        },
      });

      const itens = data.itens.map((item) => ({
        salesId: sales.id,
        productId: Number(item.productId),
        amount: item.amount,
        unitPrice: item.unitPrice,
        subtotal: item.amount * item.unitPrice,
      }));

      await this.prisma.salesItens.createMany({
        data: itens,
      });

      const salesWithItens = await this.prisma.sales.findUnique({
        where: { id: sales.id },
        include: { itens: true },
      });

      return salesWithItens;
    } catch (error) {
      throw new HttpException(
        'Erro ao criar a venda. Verifique os dados e tente novamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return this.prisma.sales.findMany({
      include: {
        itens: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.sales.findUnique({
      where: {
        id,
      },
      include: {
        itens: true,
      },
    });
  }

  async getTotalValueSalesByPeriod(beginning: Date, end: Date) {
    const total = await this.prisma.sales.aggregate({
      _sum: {
        totalValue: true,
      },
      where: {
        salesDate: {
          gte: beginning,
          lte: end,
        },
      },
    });
    return total._sum.totalValue || 0;
  }

  async getTotalValueSales() {
    const total = await this.prisma.sales.aggregate({
      _sum: {
        totalValue: true,
      },
    });
    return total._sum.totalValue;
  }

  async getTotalSalesByPeriod(beginning: Date, end: Date) {
    return await this.prisma.sales.count({
      where: {
        salesDate: {
          gte: beginning,
          lte: end,
        },
      },
    });
  }

  async getTotalSales() {
    return await this.prisma.sales.count();
  }

  async findTotalSalesByProduct(productId: number): Promise<number> {
    const total = await this.prisma.salesItens.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        productId: productId,
      },
    });
  
    return total._sum.amount || 0;
  }
  
  async findTotalSalesValueByProduct(productId: number): Promise<number> {
    const total = await this.prisma.salesItens.aggregate({
      _sum: {
        subtotal: true,
      },
      where: {
        productId: productId,
      },
    });
  
    return total._sum.subtotal || 0;
  }

  async findTotalSalesProductByPeriod(productId: number, beginning: Date, end: Date){
    const total = await this.prisma.salesItens.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        productId,
        sales: {
          salesDate: {
            gte: beginning,
            lte: end
          }
        }
      }
    })
    return total._sum.amount || 0
  }

  async findTotalSalesValueProductByPeriod(productId: number, beginning: Date, end: Date){
    const total = await this.prisma.salesItens.aggregate({
      _sum: {
        subtotal: true,
      },
      where: {
        productId,
        sales: {
          salesDate: {
            gte: beginning,
            lte: end
          }
        }
      }
    })
    return total._sum.subtotal || 0
  }

  async update(id: number, data: UpdateSalesDto) {
    const salesData = await this.prisma.sales.update({
      where: { id },
      data: {
        salesDate: data.salesDate,
        totalValue: data.totalValue,
      },
    });
    if (data.itens) {
      for (const item of data.itens) {
        if (item.id) {
          const response = await this.prisma.salesItens.update({
            where: { id: item.id },
            data: {
              amount: item.amount,
              unitPrice: item.unitPrice,
              subtotal: item.amount * item.unitPrice,
            },
          });
        } else {
          await this.prisma.salesItens.create({
            data: {
              salesId: id,
              productId: Number(item.productId),
              amount: item.amount,
              unitPrice: item.unitPrice,
              subtotal: item.amount * item.unitPrice,
            },
          });
        }
      }

      const itemIds = data.itens.map((item) => item.id).filter(Boolean);
      await this.prisma.salesItens.deleteMany({
        where: {
          salesId: id,
          id: { notIn: itemIds },
        },
      });
    }

    return `sales updated successfully`;
  }

  async remove(salesId: number) {
    const deletesalesItens = this.prisma.salesItens.deleteMany({
      where: {
        salesId,
      },
    });
    const deletesales = this.prisma.sales.delete({
      where: {
        id: salesId,
      },
    });
    this.prisma.$transaction([deletesalesItens, deletesales]);

    return 'sales deleted successfully';
  }
}
