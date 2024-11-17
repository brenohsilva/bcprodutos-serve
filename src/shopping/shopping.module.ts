import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService],
})
export class ShoppingModule {}
