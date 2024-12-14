import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';

@Injectable()
export class FindOneSaleUseCase {
  constructor(private readonly salesService: SalesService) {}
  async execute(id: string) {
    try {
      const product = await this.salesService.findOne(Number(id));

      if (!product) {
        throw new HttpException('Venda não encontrada.', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Erro ao buscar a venda. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
