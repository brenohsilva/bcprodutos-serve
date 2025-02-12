import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OverViewService {
  constructor(private prisma: PrismaService) {}

  async registerProfit(salesId: number, day: Date, profit_day: number) {
    return this.prisma.profits.create({
      data: {
        salesId,
        day,
        profit_day,
      },
    });
  }

  // async findShoppingValueByMonth(month: any) {
  //   return await this.prisma.shopping.findMany({
  //     where: {
  //       shopping_date: {},
  //     },
  //   });
  // }
}
