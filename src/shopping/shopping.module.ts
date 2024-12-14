import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { CreateShoppingUseCase } from './usecases/create-shopping.usecase';
import { PrismaService } from 'src/prisma.service';
import { GetAllShoppingUseCase } from './usecases/get-all-shopping.usecase';
import { GetOneShoppingUseCase } from './usecases/get-one-shopping.usecase';
import { UpdateShoppingUseCase } from './usecases/update-shopping.usecase';
import { DeleteShoppingUseCase } from './usecases/delete-shopping.usecase';

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
