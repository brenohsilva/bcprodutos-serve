import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SalesService } from '../Sales.service';
import { GetOneSaleUseCase } from './getOneSale';

@Injectable()
export class DeleteSalesUseCase {
  constructor(private readonly SalesService: SalesService, private readonly getASales: GetOneSaleUseCase) {}

  async execute(id: string) {
    try {
      const existingSales = await this.getASales.execute(id);
      if (!existingSales) {
        throw new HttpException('Sale not found.', HttpStatus.NOT_FOUND);
      }
     
      const deleteProduct = await this.SalesService.remove(Number(id));

      return {
        success: true,
        data: "Sales deleted successfully",
      };
    } catch (error) {
      throw new HttpException(
        'failed to deleted a sale, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
