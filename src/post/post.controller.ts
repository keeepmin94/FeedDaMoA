import { Controller } from '@nestjs/common';
import { PostService } from './post.service';
import { Get, Param, Patch } from '@nestjs/common/decorators';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  getPostDetail(@Param('id') id: string) {
    return this.postService.getPostDetail(id);
  }

  @Patch(':id/like')
  patchLikeCount(@Param('id') id: string) {
    return this.postService.like(id);
  }

  @Patch(':id/share')
  patchShareCount(@Param('id') id: string) {
    return this.postService.share(id);
  }
}
