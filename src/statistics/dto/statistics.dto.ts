import { ApiProperty } from '@nestjs/swagger';
import { StatisticsType, StatisticsValue } from '../enums/statistics.enum';
import { IsString } from 'class-validator';

export class StatisticsDto {
  @ApiProperty({ example: '성수맛집', description: '해시태그', required: true })
  @IsString()
  hashtag: string;
  @ApiProperty({
    example: 'date',
    description: '날짜별 | 시간대별로 조회할 것인지(date | hour)',
    required: true,
  })
  @IsString()
  type: StatisticsType;
  @ApiProperty({
    example: '2023-10-22',
    description: '조회 시작일',
    required: true,
  })
  @IsString()
  start: Date;
  @ApiProperty({
    example: '2023-10-29',
    description: '조회 종료일',
    required: true,
  })
  @IsString()
  end: Date;
  @ApiProperty({
    example: 'count',
    description:
      '통계로 가져올 목록 (count | like_count | view_count | share_count)',
    required: true,
  })
  @IsString()
  value: StatisticsValue;
}
