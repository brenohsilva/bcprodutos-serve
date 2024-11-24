import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { UpdateShoppingDto } from './dto/update-shopping.dto';
import { CreateShoppingUseCase } from './usecases/createShopping';

@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService, private readonly createShopping: CreateShoppingUseCase) {}

  @Post()
   create(@Body() data: CreateShoppingDto) {
    return this.createShopping.execute(data);
  }

  @Get()
  findAll() {
    return this.shoppingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingDto: UpdateShoppingDto) {
    return this.shoppingService.update(+id, updateShoppingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingService.remove(+id);
  }
}
