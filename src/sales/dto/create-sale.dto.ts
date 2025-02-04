export class SalesItens {
  productId: number | string;
  amount: number;
  unit_price: number;
}

export class CreateSalesDto {
  description?: string;
  total_gross_value: number;
  total_net_value: number;
  additional?: number;
  discount?: number;
  coast: number;
  payment_method: string;
  itens: SalesItens[];
}
