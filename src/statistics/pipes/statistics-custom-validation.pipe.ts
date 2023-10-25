import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { StatisticsType, StatisticsValue } from '../enums/statistics.enum';

@Injectable()
export class StatisticsCustomValidationPipe implements PipeTransform {
  readonly TypeOptions = [StatisticsType.DATE, StatisticsType.HOUR];
  readonly ValueOptions = [
    StatisticsValue.COUNT,
    StatisticsValue.LIKE_COUNT,
    StatisticsValue.SHARE_COUNT,
    StatisticsValue.VIEW_COUNT,
  ];

  private isOptionValid(option: any, division: string) {
    const index =
      division === 'type'
        ? this.TypeOptions.indexOf(option)
        : this.ValueOptions.indexOf(option);
    return index !== -1;
  }

  transform(value_: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value_;
    const { type, start, end, value } = value_;

    // type ==> [date, hour] 중에 하나인지 확인
    if (!this.isOptionValid(type.toUpperCase(), 'type'))
      throw new BadRequestException(`type 값을 잘못 지정했습니다. ${type}`);

    // value [count, view_count, like_count, share_count] 즁에 하나인지
    if (!this.isOptionValid(value.toUpperCase(), 'value'))
      throw new BadRequestException(`value 값을 잘못 지정했습니다. ${value}`);

    console.log(start);
    console.log(end);

    value_.type = type.toUpperCase();
    value_.value = value.toUpperCase();

    return value_;
  }
}
