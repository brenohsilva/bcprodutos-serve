import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesDto } from './create-sale.dto';

export class SalesItensUpdate {
  id: number;
  productId: number | string;
  amount: number;
  unit_price: number;
}
export class UpdateSalesDto extends PartialType(CreateSalesDto) {
  sales_date: Date;
  itens: SalesItensUpdate[];
}
