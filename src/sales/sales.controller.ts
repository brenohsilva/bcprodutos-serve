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
import { FindAllSalesUseCase } from './usecases/find-all-sales.usecase';
import { FindOneSaleUseCase } from './usecases/find-one-sale.usecase';
import { DeleteSaleUseCase } from './usecases/delete-sales.usecase';
import { CreateSalesDto } from './dto/create-sale.dto';
import { UpdateSalesDto } from './dto/update-sale.dto';
import { CreateSaleUseCase } from './usecases/create-sales.usecase';
import { UpdateSaleUseCase } from './usecases/update-sales.usecase';
import { GetTotalValueSalesByPeriodUseCase } from './usecases/get-total-values-sales-by-period.usecase';
import { GetTotalSalesByPeriodUseCase } from './usecases/get-total-sales-by-period.usecase';
import { GetTotalSalesProductsByPeriodUseCase } from './usecases/get-total-sales-products-by-period.usecase';
import { GetTotalSalesValueProductsByPeriodUseCase } from './usecases/get-total-sales-value-produccts-by-period.usecase';
import { GetQuantityOfSalesOfProductsUseCase } from './usecases/get-quantity-of-sales-of-products.usecase';
import { GetQuantityOfProductsSoldByPeriodUseCase } from './usecases/get-quantity-of-products-sold-by-period';

@Controller('sales')
export class SalesController {
  constructor(
    private readonly findAllSales: FindAllSalesUseCase,
    private readonly findOneSales: FindOneSaleUseCase,
    private readonly deleteSales: DeleteSaleUseCase,
    private readonly createSales: CreateSaleUseCase,
    private readonly updateSales: UpdateSaleUseCase,
    private readonly getTotalValueSalesByPeriod: GetTotalValueSalesByPeriodUseCase,
    private readonly getTotalSalesByPeriod: GetTotalSalesByPeriodUseCase,
    private readonly getTotalSalesProductsByPeriod: GetTotalSalesProductsByPeriodUseCase,
    private readonly getTotalSalesValueProductsByPeriod: GetTotalSalesValueProductsByPeriodUseCase,
    private readonly getQuantityOfSalesUseCase: GetQuantityOfSalesOfProductsUseCase,
    private readonly getQuantityOfProductsSoldByPeriod: GetQuantityOfProductsSoldByPeriodUseCase,
  ) {}

  @Post()
  create(@Body() createSaleDto: CreateSalesDto) {
    return this.createSales.execute(createSaleDto);
  }

  @Get()
  findAll() {
    return this.findAllSales.execute();
  }

  @Get('/values')
  findTotalValueSalesByPeriod(@Query('range') range?: string) {
    return this.getTotalValueSalesByPeriod.execute(range);
  }
  @Get('/values/products/:id')
  findTotalSalesValueProductsByPeriod(
    @Param('id') productId: string,
    @Query('range') range?: string,
  ) {
    return this.getTotalSalesValueProductsByPeriod.execute(productId, range);
  }

  @Get('/amount')
  findTotalSalesByPeriod(@Query('range') range?: string) {
    return this.getTotalSalesByPeriod.execute(range);
  }

  @Get('/amount/products/:id')
  findTotalSalesProductsByPeriod(
    @Param('id') productId: string,
    @Query('range') range?: string,
  ) {
    return this.getTotalSalesProductsByPeriod.execute(productId, range);
  }

  @Get('quantity-by-products')
  findQuantityOfSalesOfProducts() {
    return this.getQuantityOfSalesUseCase.execute();
  }

  @Get('quantity-of-products-sold')
  findQuantityOfProductsSoldByPeriod(@Query('range') range?: string) {
    return this.getQuantityOfProductsSoldByPeriod.execute(range);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneSales.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSalesDto) {
    return this.updateSales.execute(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteSales.execute(id);
  }
}
