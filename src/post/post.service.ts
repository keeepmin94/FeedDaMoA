import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PostRepository } from './post.repository';
import { PostDto } from './dto/returnPost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    private httpService: HttpService,
  ) {}

  async sendRequestToSns(id: string, type: string, action: string) {
    let tld = ['facebook', 'instagram', 'twitter'].includes(type)
      ? 'com'
      : 'net';

    const apiEndpoint = `https://www.${type}.${tld}/${action}/${id}`;
    const response = await lastValueFrom(this.httpService.post(apiEndpoint));
    if (response.status === 200) {
      return response.status;
    } else {
      throw new Error(
        `Failed to send SNS request for action ${action} with ID ${id}`,
      );
    }
  }

  async findPostById(id: string): Promise<PostDto> {
    const post: Post = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException(`해당 id의 게시글이 없습니다.`);
    }
    const postDto: PostDto = {
      id: post.id,
      type: post.type,
      title: post.title,
      content: post.content,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      shareCount: post.shareCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      tags: post.tags.map((tag) => tag.tag),
    };

    return postDto;
  }

  async updateCount(post, field: string): Promise<void> {
    post[field] += 1;
    await this.postRepository.save(post);
  }

  async getPostDetail(id: string): Promise<PostDto> {
    const post: PostDto = await this.findPostById(id);
    await this.updateCount(post, 'viewCount');
    return post;
  }

  async like(id: string): Promise<PostDto> {
    const post: PostDto = await this.findPostById(id);
    await this.sendRequestToSns(id, post.type, 'like');
    await this.updateCount(post, 'likeCount'); // api 요청 응답의 상태 코드가 200이면 likeCount + 1
    return post;
  }

  async share(id: string): Promise<PostDto> {
    const post: PostDto = await this.findPostById(id);
    await this.sendRequestToSns(id, post.type, 'share');
    await this.updateCount(post, 'shareCount'); // api 요청 응답의 상태 코드가 200이면 likeCount + 1
    return post;
  }
}
