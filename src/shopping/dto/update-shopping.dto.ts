import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingDto } from './create-shopping.dto';

export class ShoppingItensUpdate {
  id: number;
  productId: number | string;
  amount: number;
  unit_price: number;
}
export class UpdateShoppingDto extends PartialType(CreateShoppingDto) {
  shopping_date: Date;
  itens: ShoppingItensUpdate[];
}
