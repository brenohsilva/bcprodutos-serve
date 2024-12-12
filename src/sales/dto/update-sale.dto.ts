import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesDto } from './create-sale.dto';



export class SalesItensUpdate {
    id: number;
    productId: number | string;
    amount: number;
    unitPrice: number;
}
export class UpdateSalesDto extends PartialType(CreateSalesDto) {
    salesDate: Date;
    itens: SalesItensUpdate[];
    
}


