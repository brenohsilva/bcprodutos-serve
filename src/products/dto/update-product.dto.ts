import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  name?: string;
  image?: string;
  category?: string;
  size?: number;
  amount?: number;
  color?: string;
  sales_price?: number;
}
