import { Controller } from '@nestjs/common';
import { PostService } from './post.service';
import { Get, Param, Patch } from '@nestjs/common/decorators';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

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
