import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  image: string;
  @IsNotEmpty()
  amount: number;
  type: string;
  size: number;
  color: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  sales_price: number;
}
