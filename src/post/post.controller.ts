import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostValidationPipe } from './pipes/postValidation.pipe';
import { PostDto } from './dto/post.dto';
import {
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@ApiTags('게시글')
@Controller('posts')
@UseGuards(AuthGuard())
export class PostController {
  constructor(private readonly postService: PostService) {}
  // 해시태그(디폴트:유저 계정) + 타입 + 정렬
  // 검색 + 타입 + 정렬
  // 검색 + 타입
  @ApiOperation({ summary: 'post 목록 반환' })
  @ApiQuery({
    name: 'hashtag',
    description:
      '맛집, 성수동 등 1건의 해시태그 이며, 정확히 일치하는 값(Exact)만 검색합니다.',
  })
  @ApiQuery({
    name: 'type',
    description:
      '게시물의 type 필드 값 별로 조회가 됩니다. 미입력 시 모든 type 이 조회됩니다.',
  })
  @ApiQuery({
    name: 'order_by',
    description:
      '정렬순서이며, created_at,updated_at,like_count,share_count,view_count 가 사용 가능합니다. 오름차순 , 내림차순 모두 가능하게 구현',
  })
  @ApiQuery({
    name: 'search_by',
    description:
      '검색 기준이며, title , content, title,content 이 사용 가능합니다. 각각 제목, 내용, 제목 + 내용 에 해당합니다.',
  })
  @ApiQuery({
    name: 'search',
    description:
      'search_by 에서 검색할 키워드 이며 유저가 입력합니다. 해당 문자가 포함된 게시물을 검색합니다.',
  })
  @ApiQuery({
    name: 'page',
    description: '조회하려는 페이지를 지정합니다.',
  })
  @ApiQuery({
    name: 'page_count',
    description: '페이지당 게시물 갯수를 지정합니다.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  async getPosts(
    @Query(PostValidationPipe) postDto: PostDto,
    @GetUser() user: User,
  ): Promise<object> {
    return await this.postService.getPosts(postDto, user);
  }

  @ApiOperation({ summary: '개별 post의 모든 필드 반환' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @Get(':id')
  async getPostDetail(@Param('id') id: string): Promise<object> {
    return await this.postService.getPostDetail(id);
  }

  @ApiOperation({ summary: '좋아요 : post의 like count 수정' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @Patch(':id/like')
  async patchLikeCount(@Param('id') id: string): Promise<object> {
    return await this.postService.like(id);
  }

  @ApiOperation({ summary: '공유 : post의 share count 수정' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @Patch(':id/share')
  async patchShareCount(@Param('id') id: string): Promise<object> {
    return await this.postService.share(id);
  }
}
