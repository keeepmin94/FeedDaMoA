import { Injectable } from '@nestjs/common';
import { StatisticsDto } from './dto/statistics.dto';

@Injectable()
export class StatisticsService {
  async getStatisticsPost(
    statisticsDto: StatisticsDto,
  ): Promise<{ date: string; cnt: number }[]> {
    console.log(statisticsDto);
    return [
      { date: '2023-01-01', cnt: 1 },
      { date: '2023-01-02', cnt: 2 },
    ];
  }
}
