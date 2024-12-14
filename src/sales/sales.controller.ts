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
  findTotalValueSales(@Query('range') range?: string) {
    return this.getTotalValueSalesByPeriod.execute(range);
  }

  @Get('/amount')
  findTotalSales(@Query('range') range?: string) {
    return this.getTotalSalesByPeriod.execute(range);
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
