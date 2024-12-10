/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';


@Injectable()
export class GetAllShoppingUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute() {
    try {
      const sales = await this.salesService.findAll();

      return {
        success: true,
        data: sales,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as suas vendas. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
