/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class GetAllProductsUseCase {
    constructor(private readonly productsService: ProductsService) {}

    execute(){
        const products = this.productsService.findAll()
        return products
    }
}
