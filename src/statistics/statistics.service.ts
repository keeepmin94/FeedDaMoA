import { Injectable } from '@nestjs/common';
import { StatisticsDto } from './dto/statistics.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatisticsCustomRepository } from './statistics.repository';
import { IStatisticsResult } from './type/statistics.interface';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(StatisticsCustomRepository)
    private statisticsCustomRepository: StatisticsCustomRepository,
  ) {}

  async getStatisticsPost(
    statisticsDto: StatisticsDto,
  ): Promise<IStatisticsResult[]> {
    // hashtag === '' ? 토큰으로 유저 계정 찾기 : hashtag

    const result =
      await this.statisticsCustomRepository.getStatisticsPost(statisticsDto);

    return result;
  }

  // private fillDate(statistics: any[], startDateTime: Date, endDateTime: Date) {
  //   // 모든 시간대를 생성합니다.
  //   const allDates = [];
  //   const currentDate = new Date(startDateTime);
  //   while (currentDate <= endDateTime) {
  //     allDates.push(startDateTime);
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }

  //   const result = allDates.map((date) => {
  //     const d = date.toISOString().split('T')[0];
  //     const c = statistics.find((row) => row.date === d);

  //     return {
  //       date: d,
  //       count: c ? c.count : 0,
  //     };
  //   });

  //   return result;
  // }
}
