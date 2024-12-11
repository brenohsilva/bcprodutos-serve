import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { GetOneSaleUseCase } from './getOneSale';


@Injectable()
export class DeleteSaleUseCase {
  constructor(private readonly salesService: SalesService, private readonly getASale: GetOneSaleUseCase) {}

  async execute(id: string) {
    try {
      const existingShopping = await this.getASale.execute(id);
      if (!existingShopping) {
        throw new HttpException('Venda não encontrada.', HttpStatus.NOT_FOUND);
      }
     
      const deleteProduct = await this.salesService.remove(Number(id));

      return {
        success: true,
        data: "Sales deleted successfully",
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao deletar a venda. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
