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
  UseGuards,
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
import { GetStocksProductsQuantityUseCase } from './usecases/get-stocks-products-quantity.usecase';
import { GetQuantityOfProductsByNameUseCase } from './usecases/get-quantity-of-products-by-name.usecase';
import { GetLastShoppingProductsUseCase } from './usecases/get-last-shopping-products.usecase';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
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
    private readonly findLastShoppingProducts: GetLastShoppingProductsUseCase,
    private readonly findStockProductsQuantity: GetStocksProductsQuantityUseCase,
    private readonly findStockProductsQuantityByName: GetQuantityOfProductsByNameUseCase
  ) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.addProducts.execute(data);
  }

  @Get('/last-sales-products')
  findLastProductsSold() {
    return this.findLastSalesProducts.execute();
  }
  
  @Get('/last-shopping-products')
  findLastProductsPurchased() {
    return this.findLastShoppingProducts.execute();
  }

  @Get()
  findAllByFilter(@Query() query: any) {
    return this.getAllProducts.execute(query);
  }

  @Get('/stocks/quantity-by-name')
  findStockProductQuantityByName(){
    return this.findStockProductsQuantityByName.execute()
  }

  @Get('/stocks/quantity')
  findStockProductQuantity(){
    return this.findStockProductsQuantity.execute()
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
