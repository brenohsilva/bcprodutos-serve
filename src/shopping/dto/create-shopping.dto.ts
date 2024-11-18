import { CreateProductDto } from "src/products/dto/create-product.dto";

export class ShoppingItens {
    productId: number | string;
    amount: number;
    unitPrice: number;
}

export class CreateShoppingDto {
    totalValue: number;
    itens: ShoppingItens[]
    newItens?: CreateProductDto[]
}
