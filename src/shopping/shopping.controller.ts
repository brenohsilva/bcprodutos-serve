import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { UpdateShoppingDto } from './dto/update-shopping.dto';
import { CreateShoppingUseCase } from './usecases/create-shopping.usecase';
import { GetAllShoppingUseCase } from './usecases/get-all-shopping.usecase';
import { GetOneShoppingUseCase } from './usecases/get-one-shopping.usecase';
import { UpdateShoppingUseCase } from './usecases/update-shopping.usecase';
import { DeleteShoppingUseCase } from './usecases/delete-shopping.usecase';
import { GetTotalValueShoppingByPeriodUseCase } from './usecases/get-total-values-shopping-by-period.usecase';
import { GetTotalShoppingByPeriodUseCase } from './usecases/get-total-shopping-by-period.usecase';
import { GetTotalShoppingProductsByPeriodUseCase } from './usecases/get-total-shopping-products-by-period.usecase';
import { GetTotalShoppingValueProductsByPeriodUseCase } from './usecases/get-total-shopping-value-products-by-period.usecase';
import { GetQuantityOfProductsPurchasedByPeriodUseCase } from './usecases/get-quantity-of-products-purchased-by-period.usecase';

@Controller('shopping')
export class ShoppingController {
  constructor(
    private readonly shoppingService: ShoppingService,
    private readonly createShopping: CreateShoppingUseCase,
    private readonly getAllShopping: GetAllShoppingUseCase,
    private readonly getOneShopping: GetOneShoppingUseCase,
    private readonly updateShopping: UpdateShoppingUseCase,
    private readonly deleteShopping: DeleteShoppingUseCase,
    private readonly getTotalValueShoppingByPeriod: GetTotalValueShoppingByPeriodUseCase,
    private readonly getTotalShoppingByPeriod: GetTotalShoppingByPeriodUseCase,
    private readonly getTotalShoppingProductsByPeriod: GetTotalShoppingProductsByPeriodUseCase,
    private readonly getTotalShoppingValueProductsByPeriod: GetTotalShoppingValueProductsByPeriodUseCase,
    private readonly getQuantityOfProductsPurchasedByPeriod: GetQuantityOfProductsPurchasedByPeriodUseCase,
  ) {}

  @Post()
  create(@Body() data: CreateShoppingDto) {
    return this.createShopping.execute(data);
  }

  @Get('/values')
  findTotalValueShoppingByPeriod(@Query('range') range?: string) {
    return this.getTotalValueShoppingByPeriod.execute(range);
  }

  @Get('/quantity-of-products-purchased')
  findQuantityOfProductsPurchasedByPeriod(@Query('range') range?: string) {
    return this.getQuantityOfProductsPurchasedByPeriod.execute(range);
  }

  @Get('/amount')
  findTotalShoppingByPeriod(@Query('range') range?: string) {
    return this.getTotalShoppingByPeriod.execute(range);
  }

  @Get('/amount/products/:id')
  findTotalShoppingProductsByPeriod(
    @Param('id') productId: string,
    @Query('range') range?: string,
  ) {
    return this.getTotalShoppingProductsByPeriod.execute(productId, range);
  }

  @Get()
  findAll() {
    return this.getAllShopping.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getOneShopping.execute(id);
  }

  @Get('/values/products/:id')
  findTotalShoppingValueProductsByPeriod(
    @Param('id') productId: string,
    @Query('range') range?: string,
  ) {
    return this.getTotalShoppingValueProductsByPeriod.execute(productId, range);
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
