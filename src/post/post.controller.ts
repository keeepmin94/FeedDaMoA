import { Controller } from '@nestjs/common';
import { PostService } from './post.service';
import { Get, Param } from '@nestjs/common/decorators';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  getPostDetail(@Param('id') postId: string) {
    return this.postService.findOne(postId);
  }
}
