import { CreateProductDto } from 'src/products/dto/create-product.dto';

export class ShoppingItens {
  productId: number | string;
  amount: number;
  unit_price: number;
}

export class CreateShoppingDto {
  total_value: number;
  payment_method: string;
  installment: number;
  itens: ShoppingItens[];
  newItens?: CreateProductDto[];
}
