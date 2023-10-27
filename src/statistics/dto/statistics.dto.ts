import { StatisticsType, StatisticsValue } from '../enums/statistics.enum';

export class StatisticsDto {
  hashtag: string;
  type: StatisticsType;
  start: Date;
  end: Date;
  value: StatisticsValue;
}
