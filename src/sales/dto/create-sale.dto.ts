import { CreateProductDto } from "src/products/dto/create-product.dto";

export class SalesItens {
    productId: number | string;
    amount: number;
    unitPrice: number;
}

export class CreateSalesDto {
    totalValue: number;
    itens: SalesItens[]
    newItens?: CreateProductDto[]
}
