import { Controller, Get, Query, Param, Patch } from '@nestjs/common';
import { PostService } from './post.service';
import { PostValidationPipe } from './pipes/postValidation.pipe';
import { PostDto } from './dto/post.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  // 해시태그(디폴트:유저 계정) + 타입 + 정렬
  // 검색 + 타입 + 정렬
  // 검색 + 타입
  @ApiOperation({ summary: 'post 목록 반환' })
  @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  async getPosts(@Query(PostValidationPipe) postDto: PostDto): Promise<object> {
    // console.log(postDto, typeof postDto.pageCount);
    return await this.postService.getPosts(postDto);
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
