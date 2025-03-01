import { Injectable } from '@nestjs/common';
import { GetTotalValueSalesByPeriodUseCase } from 'src/sales/usecases/get-total-values-sales-by-period.usecase';
import { GetTotalValueShoppingByPeriodUseCase } from 'src/shopping/usecases/get-total-values-shopping-by-period.usecase';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    private readonly getTotalValueSalesByPeriodUseCase: GetTotalValueSalesByPeriodUseCase,
    private readonly getTotalValueShoppingByPeriodUseCase: GetTotalValueShoppingByPeriodUseCase,
  ) {}

  async execute(month?: string) {
    try {
      const salesValueByMonth =
        await this.getTotalValueSalesByPeriodUseCase.execute('month', month);
      const shoppingValueByMoth =
        await this.getTotalValueShoppingByPeriodUseCase.execute('month', month);

      const data = {
        sales_value: salesValueByMonth.data.liquido,
        shopping_value: shoppingValueByMoth.data,
        balance: (
          (Number(salesValueByMonth.data.liquido) || 0) -
          (Number(shoppingValueByMoth.data) || 0)
        ).toFixed(2),
      };

      return {
        success: true,
        data,
      };
    } catch (error) {}
  }
}
