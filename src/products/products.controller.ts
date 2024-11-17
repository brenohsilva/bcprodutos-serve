/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetAllProductsUseCase } from './usecases/getAllProducts';
import { AddProductsUseCase } from './usecases/addProducts';
import { GetOneProductUseCase } from './usecases/getOneProduct';
import { UpdateProductsUseCase } from './usecases/updateProducts';
import { DeleteProductsUseCase } from './usecases/deleteProduct';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly getAllProducts: GetAllProductsUseCase,
    private readonly addProducts: AddProductsUseCase,
    private readonly getOneProduct: GetOneProductUseCase,
    private readonly updateProduct: UpdateProductsUseCase,
    private readonly deleteProduct: DeleteProductsUseCase
  ) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.addProducts.execute(data);
  }

  @Get()
  findAll() {
    return this.getAllProducts.execute();
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
