import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OverViewService } from '../overview.service';
import * as moment from 'moment';

@Injectable()
export class GetDailyProfitsUseCase {
  constructor(private readonly overViewService: OverViewService) {}

  async execute(month?: string) {
    try {
      const now = new Date();
      const selectedYear = now.getFullYear();
      let selectedMonth = now.getMonth() + 1;

      if (month) {
        const monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
          throw new HttpException(
            'Mês inválido. O valor deve estar entre 1 e 12.',
            HttpStatus.BAD_REQUEST,
          );
        }
        selectedMonth = monthNumber;
      }

      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const firstDayOfNextMonth = new Date(selectedYear, selectedMonth, 1);

      const response = await this.overViewService.findProfits(
        firstDayOfMonth,
        firstDayOfNextMonth,
      );

      if (!response || response.length === 0) {
        return {
          success: true,
          data: [],
          message: 'Nenhum lucro encontrado para o período selecionado.',
        };
      }

      const formattedData = response.map(({ id, day, profit_day }) => ({
        id,
        day: moment(day).format('DD/MM'),
        profit_day,
      }));

      return {
        success: true,
        data: formattedData,
      };
    } catch (error) {
      console.error('Erro ao contabilizar os lucros:', error);
      throw new HttpException(
        'Erro ao contabilizar os lucros. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
