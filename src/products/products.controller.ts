/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetAllProductsUseCase } from './usecases/getAllProducts';
import { AddProductsUseCase } from './usecases/addProducts';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService, private readonly getAllProducts: GetAllProductsUseCase, private readonly addProducts: AddProductsUseCase) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.addProducts.execute(data)
  }

  @Get()
  findAll() {
    return this.getAllProducts.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
