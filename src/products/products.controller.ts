/* eslint-disable prettier/prettier */
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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetAllProductsUseCase } from './usecases/get-all-products.usecase';
import { AddProductsUseCase } from './usecases/add-products.usecase';
import { GetOneProductUseCase } from './usecases/get-one-product.usecase';
import { UpdateProductsUseCase } from './usecases/update-products.usecase';
import { DeleteProductsUseCase } from './usecases/delete-products.usecase';
import { GetLastSalesProductsUseCase } from './usecases/get-last-sales-products.usecase';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly getAllProducts: GetAllProductsUseCase,
    private readonly addProducts: AddProductsUseCase,
    private readonly getOneProduct: GetOneProductUseCase,
    private readonly updateProduct: UpdateProductsUseCase,
    private readonly deleteProduct: DeleteProductsUseCase,
    private readonly findLastSalesProducts: GetLastSalesProductsUseCase,
  ) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.addProducts.execute(data);
  }

  @Get('/last-sales')
  findLastProductsSold() {
    return this.findLastSalesProducts.execute();
  }
  
  @Get('/last-shopping')
  findLastProductsPurchased() {
    return this.findLastSalesProducts.execute();
  }

  @Get()
  findAll(@Query() query: any) {
    return this.getAllProducts.execute(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getOneProduct.execute(id);
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.updateProduct.execute(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteProduct.execute(id);
  }
}
