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

  // type | value 열거형 유효성 검사
  private isOptionValid(option: any, division: string): boolean {
    const index =
      division === 'type'
        ? this.TypeOptions.indexOf(option)
        : this.ValueOptions.indexOf(option);
    return index !== -1;
  }

  // startDate, endDate 날짜 형식 유효성 검사
  private isValidDate(dateStart: string, dateEnd: string): boolean {
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(dateStart) &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateEnd)
    );
  }

  // startDate, endDate 날짜 기간 유효성 검사(by tpye)
  private validateCalculate(
    dateStart: string,
    dateEnd: string,
    type: string,
  ): void {
    // 1. 날짜형식으로 포맷 (비교 및 기간 구하기 위해)
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    // 2. 날짜 비교 (startdate가 더 크면 에러)
    if (start > end) {
      const message = `조회 시작일이 종료일 보다 큽니다.`;
      throw new BadRequestException(message);
    }

    //3. type에 따라서 날짜 차이 비교 (date면 한달, hour면 일주일)
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24); // 1일은 24시간 * 60분 * 60초 * 1000밀리초
    const limit = type === 'date' ? 30 : 7; // date시 최대 30일 조회 | hour시 최대 7일 조회

    if (dayDiff > limit) {
      const message = `${type} 설정시 최대 기간은 ${limit}입니다.`;
      throw new BadRequestException(message);
    }

    return;
  }

  transform(value_: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value_;
    const { type, start, end, value } = value_;

    // type ==> [date, hour] 중에 하나인지 확인
    if (!this.isOptionValid(type.toUpperCase(), 'type'))
      throw new BadRequestException(`type 값을 잘못 지정했습니다. ${type}`);

    // 3. 2에 따라 start, end 형식 확인
    // date 일 때 해당 hashtag 가 포함된 게시물 수를 일자별로 제공합니다. (최대 한달(30일) 조회 가능합니다.)
    // hour 일 때 해당 hashtag 가 포함된 게시물 수를 시간별로 제공합니다. start 일자의 00시 부터 1시간 간격으로, 최대 일주일(7일) 조회 가능합니다.
    if (!this.isValidDate(start, end))
      throw new BadRequestException(`날짜를 확인해 주세요.`);

    // value [count, view_count, like_count, share_count] 즁에 하나인지
    if (!this.isOptionValid(value.toUpperCase(), 'value'))
      throw new BadRequestException(`value 값을 잘못 지정했습니다. ${value}`);

    this.validateCalculate(start, end, type);

    value_.type = type.toUpperCase();
    value_.value = value.toUpperCase();

    console.log(value_);
    return value_;
  }
}
