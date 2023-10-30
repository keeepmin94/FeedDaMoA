import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StatisticsDto } from './dto/statistics.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatisticsCustomRepository } from './statistics.repository';
import { IStatisticsResult } from './type/statistics.interface';
import { StatisticsType } from './enums/statistics.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(StatisticsCustomRepository)
    private statisticsCustomRepository: StatisticsCustomRepository,
  ) {}

  async getStatisticsPost(
    statisticsDto: StatisticsDto,
    user: User,
  ): Promise<IStatisticsResult[]> {
    statisticsDto.hashtag =
      statisticsDto.hashtag === '' || statisticsDto.hashtag === undefined
        ? user.username
        : statisticsDto.hashtag;

    const { type, start, end } = statisticsDto;
    try {
      const result =
        await this.statisticsCustomRepository.getStatisticsPost(statisticsDto);

      const resultWithZero = this.makeWithZeroCount(result, start, end, type);
      return resultWithZero;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // DB에서 받아온 데이터를 가공해 count가 없는 날짜에 count: 0 넣기
  private makeWithZeroCount(
    result: IStatisticsResult[],
    start: Date,
    end: Date,
    type: StatisticsType,
  ): IStatisticsResult[] {
    const allDays = [];
    const currentDate = new Date(start); // Date 타입 깊은 복사

    // 조회시작 날짜부터 종료날짜까지 (하루하루|매시간) 배열에 (yyyy-MM-dd|yyyy-MM-dd HH) 형식으로 넣어주기
    while (currentDate <= end) {
      const pushDate =
        type === StatisticsType.DATE
          ? currentDate.toISOString().split('T')[0]
          : currentDate.toISOString().split('T')[0] +
            ' ' +
            ('0' + currentDate.getHours()).slice(-2);
      allDays.push(pushDate);

      // 루틴마다 type에 따라 하루 | 한시간 씩 더해주기
      type === StatisticsType.DATE
        ? currentDate.setDate(currentDate.getDate() + 1)
        : currentDate.setHours(currentDate.getHours() + 1);
    }

    // 위에서 만든 모든 일자|매시간 이들어있는 배열(pushDate)을 루프하면서 db에서 가져온 결과의 count가 있는 날짜 찾아 넣어주고 없으면 0 넣어 새로운 배열 반환
    const resultWithZeroCount = allDays.map((date) => {
      const existingResult = result.find((row) => row.date === date);

      return {
        date,
        count: existingResult ? Number(existingResult.count) : 0,
      };
    });

    return resultWithZeroCount;
  }
}
