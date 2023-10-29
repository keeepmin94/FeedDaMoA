import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { SnsType } from '../types/post.enum';

@Injectable()
export class PostValidationPipe implements PipeTransform {
  readonly valueOptions = [
    SnsType.Facebook,
    SnsType.Twitter,
    SnsType.Instagram,
    SnsType.Threads,
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value_: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') throw new Error('잘못된 파라미터 입니다.');
    // 쿼리 매개변수에 대한 기본값 설정
    // console.log(value_, metatype);
    const defaultValue = {
      hashtag: '성수맛집', //추후 본인계정으로 수정 ,거기에 넣어야쥐
      orderBy: 'created_at', // 기본 정렬 기준을 생성일자로 설정
      orderDirection: 'DESC', // 기본 정렬을 내림차순 정렬
      searchBy: 'title, content', // 기본 검색 기준을 제목 + 내용으로 설정
      pageCount: 10, // 기본 페이지 개수를 10으로 설정
      page: 1, // 기본 페이지 번호를 1로 설정
    };

    // 쿼리 매개변수의 값이 존재하지 않는 경우 기본값을 사용
    for (const key in defaultValue) {
      if (!value_[key]) {
        value_[key] = defaultValue[key];
      }
    }

    if (!/^\d+$/.test(value_.pageCount) || !/^\d+$/.test(value_.page)) {
      throw new BadRequestException(
        '숫자와 문자가 섞인 값은 허용되지 않습니다.',
      );
    }

    value_.pageCount = +value_.pageCount;
    value_.page = +value_.page;

    // console.log(typeof value_.page);
    if (value_.type && !this.valueOptions.includes(value_.type)) {
      throw new BadRequestException('올바른 type이 아닙니다.');
    }
    return value_;
  }
}
