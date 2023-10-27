import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    private httpService: HttpService,
  ) {}

  private async sendRequestToSns(
    id: string,
    type: string,
    action: string,
  ): Promise<number> {
    try {
      const tld = ['facebook', 'instagram', 'twitter'].includes(type)
        ? 'com'
        : 'net';
      const apiEndpoint = `https://www.${type}.${tld}/${action}/${id}`;
      const response = await lastValueFrom(this.httpService.post(apiEndpoint));
      if (response.status !== 200) {
        throw new Error(`Response status code : ${response.status}`);
      }
      return response.status;
    } catch (error) {
      throw new InternalServerErrorException(
        `${type}으로 post 요청을 보내는 데에 실패했습니다. ${error.message}`,
      );
    }
  }

  private async findPostById(id: string): Promise<Post> {
    const post: Post = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException(`해당 id의 게시글이 없습니다.`);
    }

    return post;
  }

  private async incrementCount(post, field: string): Promise<void> {
    post[field] += 1;
    await this.postRepository.save(post);
  }

  private async processView(id: string): Promise<object> {
    const post: Post = await this.findPostById(id);

    await this.incrementCount(post, 'viewCount'); // api 요청 응답의 상태 코드가 200이면 likeCount + 1

    const postTags = post.tags.map((tag) => tag.tag);
    return { ...post, tags: postTags };
  }

  private async processLikeOrShare(
    id: string,
    action: string,
  ): Promise<object> {
    const post: Post = await this.findPostById(id);

    await this.sendRequestToSns(id, post.type, action);
    await this.incrementCount(post, `${action}Count`); // api 요청 응답의 상태 코드가 200이면 likeCount + 1

    const postTags = post.tags.map((tag) => tag.tag);
    return { ...post, tags: postTags };
  }

  async getPostDetail(id: string): Promise<object> {
    return await this.processView(id);
  }

  async like(id: string): Promise<object> {
    return await this.processLikeOrShare(id, 'like');
  }

  async share(id: string): Promise<object> {
    return await this.processLikeOrShare(id, 'share');
  }
}
