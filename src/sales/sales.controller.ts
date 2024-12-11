import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';

import { GetAllSalesUseCase } from './usecases/getAllSales';
import { GetOneSaleUseCase } from './usecases/getOneSale';

import { DeleteSaleUseCase } from './usecases/deleteSale';
import { CreateSalesDto } from './dto/create-sale.dto';
import { UpdateSalesDto } from './dto/update-sale.dto';
import { CreateSaleUseCase } from './usecases/createSales';
import { UpdateSaleUseCase } from './usecases/updateSale';


@Controller('sales')
export class SalesController {
  constructor(
    private readonly getAllSales: GetAllSalesUseCase,
    private readonly getOneSales: GetOneSaleUseCase,
    private readonly deleteSales: DeleteSaleUseCase,
    private readonly createSales: CreateSaleUseCase,
    private readonly updateSales: UpdateSaleUseCase
  ) {}

  @Post()
  create(@Body() createSaleDto: CreateSalesDto) {
    return this.createSales.execute(createSaleDto);
  }

  @Get()
  findAll() {
    return this.getAllSales.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getOneSales.execute(id);
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
