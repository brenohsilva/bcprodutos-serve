import { Injectable } from '@nestjs/common';
import { GetTotalValueSalesByPeriodUseCase } from 'src/sales/usecases/get-total-values-sales-by-period.usecase';
import { GetTotalValueShoppingByPeriodUseCase } from 'src/shopping/usecases/get-total-values-shopping-by-period.usecase';

@Injectable()
export class GetProfitUseCase {
  constructor(
    private readonly getTotalValueSalesByPeriodUseCase: GetTotalValueSalesByPeriodUseCase,
    private readonly getTotalValueShoppingByPeriodUseCase: GetTotalValueShoppingByPeriodUseCase,
  ) {}

  async execute() {
    try {
      const salesValueByMonth =
        await this.getTotalValueSalesByPeriodUseCase.execute('month');
      const shoppingValueByMoth =
        await this.getTotalValueShoppingByPeriodUseCase.execute('month');

      const data = {
        sales_value: salesValueByMonth.data,
        shopping_value: shoppingValueByMoth.data,
        profit: (salesValueByMonth.data || 0) - (shoppingValueByMoth.data || 0),
      };

      return {
        success: true,
        data,
      };
    } catch (error) {}
  }
}
