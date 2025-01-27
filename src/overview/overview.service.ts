import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OverViewService {
  constructor(private prisma: PrismaService) {}

  async findShoppingValueByMonth(month: any) {
    return await this.prisma.shopping.findMany({
      where: {
        shopping_date: {},
      },
    });
  }
}
