import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OverViewService } from '../overview.service';
import * as moment from 'moment';

@Injectable()
export class GetDailyProfitsUseCase {
  constructor(private readonly overViewServcice: OverViewService) {}
  async execute() {
    try {
      const now = new Date();
      const selectedYear = now.getFullYear();
      const selectedMonth = now.getMonth() + 1;
      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const firstDayOfNextMonth = new Date(selectedYear, selectedMonth, 1);
      const response = await this.overViewServcice.findProfits(
        firstDayOfMonth,
        firstDayOfNextMonth,
      );

      if (response) {
        const formattedData = response.map(({ id, day, profit_day }) => ({
          id,
          day: moment(day).format('DD/MM'),
          profit_day,
        }));
        return {
          success: true,
          data: formattedData,
        };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao contabilizar os lucros. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
