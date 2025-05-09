/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
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
          description: data.description || 'Venda Realizada',
          total_gross_value: data.total_gross_value,
          total_net_value: data.total_net_value,
          additional: data.additional || 0,
          discount: data.discount || 0,
          coast: data.coast,
          payment_method: data.payment_method || 'Pix',
        },
      });

      const itens = data.itens.map((item) => ({
        salesId: sales.id,
        productId: Number(item.productId),
        amount: item.amount,
        unit_price: item.unit_price,
        sub_total: item.amount * item.unit_price,
      }));

      await this.prisma.salesitens.createMany({
        data: itens,
      });

      await Promise.all(
        data.itens.map(async (item) => {
          await this.prisma.product.update({
            where: { id: Number(item.productId) },
            data: {
              amount: {
                decrement: item.amount,
              },
            },
          });
        }),
      );

      const salesWithItens = await this.prisma.sales.findUnique({
        where: { id: sales.id },
        include: { salesitens: true },
      });

      return salesWithItens;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return this.prisma.sales.findMany({
      include: {
        salesitens: true,
      },
    });
  }

  async findAllSalesItens() {
    return this.prisma.salesitens.findMany({
      include: {
        sales: {
          select: {
            sales_date: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findSalesByPeriod(beginning: Date, end: Date) {
    return this.prisma.sales.findMany({
      include: {
        salesitens: true,
      },
      where: {
        sales_date: {
          gte: beginning,
          lte: end,
        },
      },
    });
  }

  async findLastSales(beginning: Date, end: Date) {
    return await this.prisma.sales.findMany({
      include: {
        salesitens: {
          select: {
            product: {
              select: {
                name: true,
                category: true,
                type: true,
                size: true,
                color: true,
              },
            },
            amount: true,
            unit_price: true,
            sub_total: true,
          },
        },
      },
      orderBy: {
        sales_date: 'desc',
      },
      where: {
        sales_date: {
          gte: beginning,
          lte: end,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.sales.findUnique({
      where: {
        id,
      },
      include: {
        salesitens: true,
      },
    });
  }

  async getTotalValueSalesByPeriod(beginning: Date, end: Date): Promise<any> {
    const total = await this.prisma.sales.aggregate({
      _sum: {
        total_net_value: true,
        total_gross_value: true,
      },
      where: {
        sales_date: {
          gte: beginning,
          lte: end,
        },
      },
    });

    
    return {
      bruto: total._sum.total_gross_value
        ? total._sum.total_gross_value.toFixed(2)
        : '0.00',
      liquido: total._sum.total_net_value
        ? total._sum.total_net_value.toFixed(2)
        : '0.00',
    };
  }

  async getTotalValueSales() {
    const total = await this.prisma.sales.aggregate({
      _sum: {
        total_net_value: true,
      },
    });
    return total._sum.total_net_value;
  }

  async getTotalSalesByPeriod(beginning: Date, end: Date) {
    return await this.prisma.sales.count({
      where: {
        sales_date: {
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
    const total = await this.prisma.salesitens.aggregate({
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
    const total = await this.prisma.salesitens.aggregate({
      _sum: {
        sub_total: true,
      },
      where: {
        productId: productId,
      },
    });

    return Number(total._sum.sub_total) || 0;
  }

  async findTotalSalesProductByPeriod(
    productId: number,
    beginning: Date,
    end: Date,
  ) {
    const total = await this.prisma.salesitens.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        productId,
        sales: {
          sales_date: {
            gte: beginning,
            lte: end,
          },
        },
      },
    });
    return total._sum.amount || 0;
  }

  async findTotalSalesValueProductByPeriod(
    productId: number,
    beginning: Date,
    end: Date,
  ) {
    const total = await this.prisma.salesitens.aggregate({
      _sum: {
        sub_total: true,
      },
      where: {
        productId,
        sales: {
          sales_date: {
            gte: beginning,
            lte: end,
          },
        },
      },
    });
    return total._sum.sub_total || 0;
  }

  async update(id: number, data: UpdateSalesDto) {
    const salesData = await this.prisma.sales.update({
      where: { id },
      data: {
        sales_date: data.sales_date,
        total_net_value: data.total_net_value,
      },
    });
    if (data.itens) {
      for (const item of data.itens) {
        if (item.id) {
          const response = await this.prisma.salesitens.update({
            where: { id: item.id },
            data: {
              amount: item.amount,
              unit_price: item.unit_price,
              sub_total: item.amount * item.unit_price,
            },
          });
        } else {
          await this.prisma.salesitens.create({
            data: {
              salesId: id,
              productId: Number(item.productId),
              amount: item.amount,
              unit_price: item.unit_price,
              sub_total: item.amount * item.unit_price,
            },
          });
        }
      }

      const itemIds = data.itens.map((item) => item.id).filter(Boolean);
      await this.prisma.salesitens.deleteMany({
        where: {
          salesId: id,
          id: { notIn: itemIds },
        },
      });
    }

    return `sales updated successfully`;
  }

  async remove(salesId: number) {
    const deletesalesitens = this.prisma.salesitens.deleteMany({
      where: {
        salesId,
      },
    });
    const deletesales = this.prisma.sales.delete({
      where: {
        id: salesId,
      },
    });
    this.prisma.$transaction([deletesalesitens, deletesales]);

    return 'sales deleted successfully';
  }
}
