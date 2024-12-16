import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  image: string;
  @IsNotEmpty()
  category: string;
  size: number;
  @IsNotEmpty()
  amount: number;
  color: string;
  @IsNotEmpty()
  sales_price: number;
}
