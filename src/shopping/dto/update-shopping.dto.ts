import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingDto } from './create-shopping.dto';


export class ShoppingItensUpdate {
    id: number;
    productId: number | string;
    amount: number;
    unitPrice: number;
}
export class UpdateShoppingDto extends PartialType(CreateShoppingDto) {
    shoppingDate: Date;
    totalValue: number;
    itens: ShoppingItensUpdate[];
    
}


