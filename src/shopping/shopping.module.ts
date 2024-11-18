import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { CreateShoppingUseCase } from './usecases/createShopping';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService, CreateShoppingUseCase, PrismaService],
})
export class ShoppingModule {}
