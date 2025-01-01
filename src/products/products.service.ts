/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return await this.prisma.product.create({ data });
  }

  async findAll(filter: any) {
    let { category, type, size, name, sortBy, sortOrder } = filter;
    size = Number(size)
  console.log(size)
    return await this.prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(type && {type} ),
        ...(size && {size}),
        ...(name && { name: { startsWith: name } }),
      },
      orderBy: sortBy
        ? {
            [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc',
          }
        : undefined,
    });
  }
  

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: {id}
    });
  }

  async update(id: number, data: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.product.delete({
      where:{id}
    });
  }

  async findLastSalesProducts(){
    return await this.prisma.salesitens.findMany({
      orderBy: {
        sales: {
          sales_date: 'desc'
        }
      },
      take: 5,
      include:{
        product: true,
        sales: {
          select: {
            sales_date: true
          }
        }
      }
    })
  }

  async findLastShoppingProducts(){
    return await this.prisma.shoppingitens.findMany({
      orderBy: {
        shopping: {
          shopping_date: 'desc'
        }
      },
      take: 5,
      include:{
        product: true,
        shopping: {
          select: {
            shopping_date: true
          }
        }
      }
    })
  }

  
}
