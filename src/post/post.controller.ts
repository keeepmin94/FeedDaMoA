import { Controller, Get, Query, Param, Patch } from '@nestjs/common';
import { PostService } from './post.service';
import { PostValidationPipe } from './pipes/postValidation.pipe';
import { PostDto } from './dto/post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 해시태그(디폴트:유저 계정) + 타입 + 정렬
  // 검색 + 타입 + 정렬
  // 검색 + 타입
  @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  async getPosts(@Query(PostValidationPipe) postDto: PostDto): Promise<object> {
    // console.log(postDto, typeof postDto.pageCount);
    return await this.postService.getPosts(postDto);
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
