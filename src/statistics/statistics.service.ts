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
    // TODO: hashtag === '' ? 토큰으로 유저 계정 찾기 : hashtag

    const result =
      await this.statisticsCustomRepository.getStatisticsPost(statisticsDto);

    return result;
  }
}
