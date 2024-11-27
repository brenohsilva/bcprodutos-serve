import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { CreateShoppingUseCase } from './usecases/createShopping';
import { PrismaService } from 'src/prisma.service';
import { GetAllShoppingUseCase } from './usecases/getAllShopping';
import { GetOneShoppingUseCase } from './usecases/getOneShopping';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService, CreateShoppingUseCase, GetAllShoppingUseCase, GetOneShoppingUseCase, PrismaService],
})
export class ShoppingModule {}
