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
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    private httpService: HttpService,
  ) {}

  async getPosts(postDto: PostDto): Promise<object> {
    try {
      const result = await this.postRepository.findPostByTag(postDto);
      return { message: '조건 검색에 성공했습니다.', result };
    } catch (error) {
      throw new InternalServerErrorException('조건 검색에 실패했습니다.');
    }
  }

  async getPostDetail(id: string): Promise<object> {
    try {
      return await this.processView(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '해당 id의 게시글 조회에 실패했습니다.',
      );
    }
  }

  async like(id: string): Promise<object> {
    try {
      return await this.processLikeOrShare(id, 'like');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `${error.message} | 좋아요를 실패했습니다.`,
      );
    }
  }

  async share(id: string): Promise<object> {
    try {
      return await this.processLikeOrShare(id, 'share');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `${error.message} | 공유를 실패했습니다.`,
      );
    }
  }

  private async sendRequestToSns(
    id: string,
    type: string,
    action: string,
  ): Promise<number> {
    try {
      // type에 맞는 sns에 post요청을 보내는 함수
      const tld = ['facebook', 'instagram', 'twitter'].includes(type)
        ? 'com'
        : 'net';
      const apiEndpoint = `https://www.${type}.${tld}/${action}/${id}`;

      const response = await lastValueFrom(this.httpService.post(apiEndpoint));
      if (response && response.status === 200) {
        return response.status;
      }
    } catch (error) {
      throw new InternalServerErrorException(
        '해당 id로 post요청을 보내는 데 실패했습니다.',
      );
    }
  }

  private async findPostById(id: string): Promise<Post> {
    // id로 post를 검색하고 없을 시 에러 반환
    const post: Post = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException(`해당 id의 게시글이 없습니다.`);
    }
    return post;
  }

  private async incrementCount(post, field: string): Promise<void> {
    try {
      post[field] += 1;
      await this.postRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException(
        '해당 action의 count를 올리는 데에 실패했습니다.',
      );
    }
  }

  private async processView(id: string): Promise<object> {
    // 게시글 조회 시 실행되는 함수
    const post: Post = await this.findPostById(id);

    await this.incrementCount(post, 'viewCount'); // api 요청 응답의 상태 코드가 200이면 viewCount + 1

    const postTags = post.tags.map((tag) => tag.tag);
    return { ...post, tags: postTags };
  }

  private async processLikeOrShare(
    // 게시글 좋아요 or 공유 시 실행되는 함수
    id: string,
    action: string,
  ): Promise<object> {
    const post: Post = await this.findPostById(id);

    await this.sendRequestToSns(id, post.type, action);
    await this.incrementCount(post, `${action}Count`); // api 요청 응답의 상태 코드가 200이면 Count + 1

    const postTags = post.tags.map((tag) => tag.tag);
    return { ...post, tags: postTags };
  }
}
