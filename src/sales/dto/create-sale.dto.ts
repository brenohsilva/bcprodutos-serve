import { CreateProductDto } from 'src/products/dto/create-product.dto';

export class SalesItens {
  productId: number | string;
  amount: number;
  unit_price: number;
}

export class CreateSalesDto {
  total_value: number;
  payment_method: string;
  coast: number;
  itens: SalesItens[];
  newItens?: CreateProductDto[];
}
