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
          total_value: data.total_value,
          coast: data.coast,
          payment_method: data.payment_method || 'Pix'
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

      const salesWithItens = await this.prisma.sales.findUnique({
        where: { id: sales.id },
        include: { salesitens: true },
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
        salesitens: true,
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

  async getTotalValueSalesByPeriod(beginning: Date, end: Date) {
    const total = await this.prisma.sales.aggregate({
      _sum: {
        total_value: true,
      },
      where: {
        sales_date: {
          gte: beginning,
          lte: end,
        },
      },
    });
    return total._sum.total_value || 0;
  }

  async getTotalValueSales() {
    const total = await this.prisma.sales.aggregate({
      _sum: {
        total_value: true,
      },
    });
    return total._sum.total_value;
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
  
    return total._sum.sub_total || 0;
  }

  async findTotalSalesProductByPeriod(productId: number, beginning: Date, end: Date){
    const total = await this.prisma.salesitens.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        productId,
        sales: {
          sales_date: {
            gte: beginning,
            lte: end
          }
        }
      }
    })
    return total._sum.amount || 0
  }

  async findTotalSalesValueProductByPeriod(productId: number, beginning: Date, end: Date){
    const total = await this.prisma.salesitens.aggregate({
      _sum: {
        sub_total: true,
      },
      where: {
        productId,
        sales: {
          sales_date: {
            gte: beginning,
            lte: end
          }
        }
      }
    })
    return total._sum.sub_total || 0
  }

  async update(id: number, data: UpdateSalesDto) {
    const salesData = await this.prisma.sales.update({
      where: { id },
      data: {
        sales_date: data.sales_date,
        total_value: data.total_value,
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
