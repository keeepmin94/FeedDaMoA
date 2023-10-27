import { Controller } from '@nestjs/common';
import { PostService } from './post.service';
import { Get, Query, Param, Patch } from '@nestjs/common/decorators';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 해시태그(디폴트:유저 계정) + 타입 + 정렬
  // 검색 + 타입 + 정렬
  // 검색 + 타입
  @Get()
  async getPosts(
    @Query('hashtag') hashTag: string,
    @Query('type') type: string,
    @Query('order_by') orderBy: string,
    @Query('search_by') searchBy: string,
    @Query('search') search: string,
    @Query('page_count') pageCount: number,
    @Query('page') page: number,
  ): Promise<object> {
    console.log(hashTag);
    return await this.postService.getPosts(
      hashTag,
      type,
      orderBy,
      searchBy,
      search,
      pageCount,
      page,
    );
  }

  @Get(':id')
  async getPostDetail(@Param('id') id: string): Promise<object> {
    return await this.postService.getPostDetail(id);
  }

  @Patch(':id/like')
  async patchLikeCount(@Param('id') id: string): Promise<object> {
    return await this.postService.like(id);
  }

  @Patch(':id/share')
  async patchShareCount(@Param('id') id: string): Promise<object> {
    return await this.postService.share(id);
  }
}
