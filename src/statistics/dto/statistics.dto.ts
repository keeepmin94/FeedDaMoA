import { StatisticsType, StatisticsValue } from '../enums/statistics.enum';
import { IsString } from 'class-validator';

export class StatisticsDto {
  @IsString()
  hashtag: string;
  @IsString()
  type: StatisticsType;
  @IsString()
  start: Date;
  @IsString()
  end: Date;
  @IsString()
  value: StatisticsValue;
}
