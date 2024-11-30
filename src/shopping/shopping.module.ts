import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { CreateShoppingUseCase } from './usecases/createShopping';
import { PrismaService } from 'src/prisma.service';
import { GetAllShoppingUseCase } from './usecases/getAllShopping';
import { GetOneShoppingUseCase } from './usecases/getOneShopping';
import { UpdateShoppingUseCase } from './usecases/updateShopping';
import { DeleteShoppingUseCase } from './usecases/deleteShopping';

@Module({
  controllers: [ShoppingController],
  providers: [
    ShoppingService,
    CreateShoppingUseCase,
    GetAllShoppingUseCase,
    GetOneShoppingUseCase,
    UpdateShoppingUseCase,
    DeleteShoppingUseCase,
    PrismaService,
  ],
})
export class ShoppingModule {}
