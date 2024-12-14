import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { UpdateShoppingDto } from './dto/update-shopping.dto';
import { CreateShoppingUseCase } from './usecases/create-shopping.usecase';
import { GetAllShoppingUseCase } from './usecases/get-all-shopping.usecase';
import { GetOneShoppingUseCase } from './usecases/get-one-shopping.usecase';
import { UpdateShoppingUseCase } from './usecases/update-shopping.usecase';
import { DeleteShoppingUseCase } from './usecases/delete-shopping.usecase';

@Controller('shopping')
export class ShoppingController {
  constructor(
    private readonly shoppingService: ShoppingService,
    private readonly createShopping: CreateShoppingUseCase,
    private readonly getAllShopping: GetAllShoppingUseCase,
    private readonly getOneShopping: GetOneShoppingUseCase,
    private readonly updateShopping: UpdateShoppingUseCase,
    private readonly deleteShopping: DeleteShoppingUseCase
  ) {}

  @Post()
  create(@Body() data: CreateShoppingDto) {
    return this.createShopping.execute(data);
  }

  @Get()
  findAll() {
    return this.getAllShopping.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getOneShopping.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShoppingDto: UpdateShoppingDto,
  ) {
    return this.updateShopping.execute(id, updateShoppingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteShopping.execute(id);
  }
}
