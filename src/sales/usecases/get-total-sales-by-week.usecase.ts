import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalesService } from '../sales.service';
import { endOfWeek, startOfWeek } from 'date-fns';

@Injectable()
export class GetTotalSalesByWeekUseCase {
  constructor(private readonly salesService: SalesService) {}

  async execute() {
    try {
      const today = new Date();
      const beginning = startOfWeek(today, { weekStartsOn: 0 });
      const end = endOfWeek(today, { weekStartsOn: 0 });
      const response = await this.salesService.findSalesByWeek(beginning, end);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao trazer a soma de suas vendas. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
