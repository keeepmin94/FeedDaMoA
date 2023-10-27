import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { SocialMediaType } from '../types/post.enum';

@Injectable()
export class PostValidationPipe implements PipeTransform {
  readonly valueOptions = [
    SocialMediaType.Facebook,
    SocialMediaType.Twitter,
    SocialMediaType.Instagram,
    SocialMediaType.Threads,
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isValueValid(value)) {
      throw new BadRequestException('Invalid value');
    }
    return value;
  }

  private isValueValid(value: any): boolean {
    return this.valueOptions.includes(value);
  }
}

// ### 게시물 목록(API)

// Feed에 나타나는 게시물 목록 API

// - 아래 **`쿼리 파라미터`**를 사용 가능합니다.

// | query | 속성 | default(미입력 시 값) | 설명 |
// | --- | --- | --- | --- |
// | hashtag | string | 본인계정 | 맛집, 성수동 등 1건의 해시태그 이며, 정확히 일치하는 값(Exact)만 검색합니다. |
// | type | string |  | 게시물의 type 필드 값 별로 조회가 됩니다. 미입력 시 모든 type 이 조회됩니다. |
// | order_by | string | created_at | 정렬순서이며, created_at,updated_at,like_count,share_count,view_count 가 사용 가능합니다.
// 오름차순 , 내림차순 모두 가능하게 구현 |
// | search_by | string | title,content | 검색 기준이며, title , content, title,content 이 사용 가능합니다. 각각 제목, 내용, 제목 + 내용 에 해당합니다. |
// | search | string |  | search_by 에서 검색할 키워드 이며 유저가 입력합니다. 해당 문자가 포함된 게시물을 검색합니다. |
// | page_count | number | 10 | 페이지당 게시물 갯수를 지정합니다. |
// | page | number | 0 | 조회하려는 페이지를 지정합니다. |
// - 게시물 목록 API에선 `content` 는 **최대 20자** 까지만 포함됩니다.
//     - 기타 필드 추가하셨을 경우, 목록 구성에 필요하지 않은 필드는 제외 합니다.
