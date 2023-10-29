import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../post.service';
import { PostRepository } from '../post.repository';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Post } from '../entities/post.entity';
import { SnsType } from '../types/post.enum';

describe('PostService', () => {
  let service: PostService;
  let postRepository: PostRepository;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useFactory: () => ({
            findPostById: jest.fn(),
            save: jest.fn(),
          }),
        },
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('like', () => {
    it('should increment likeCount and return updated post', async () => {
      const post = createPost();
      jest.spyOn(postRepository, 'findPostById').mockResolvedValue(post);
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ status: 200 } as any));

      const result = await service.like(post.id);

      expect(post.likeCount).toBe(1);
      expect(postRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ likeCount: 1 }),
      );
      expect(result).toEqual({ ...post, tags: [] });
    });

    it('should throw an error when post is not found', async () => {
      // Arrange
      const id = '1';
      jest.spyOn(postRepository, 'findPostById').mockResolvedValue(null);

      // Act & Assert
      await expect(service.like(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('share', () => {
    it('should increment shareCount and return updated post', async () => {
      const post = createPost();
      jest.spyOn(postRepository, 'findPostById').mockResolvedValue(post);
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ status: 200 } as any));

      const result = await service.share(post.id);

      expect(post.shareCount).toBe(1);
      expect(postRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ shareCount: 1 }),
      );
      expect(result).toEqual({ ...post, tags: [] });
    });

    it('should throw an error when post is not found', async () => {
      // Arrange
      const id = '1';
      jest.spyOn(postRepository, 'findPostById').mockResolvedValue(null);

      // Act & Assert
      await expect(service.share(id)).rejects.toThrow(NotFoundException);
    });
  });

  function createPost() {
    const post = new Post();

    (post.id = '1'), (post.type = SnsType.Instagram);
    post.title = 'postTitle';
    post.content = 'postContent';
    post.viewCount = 0;
    post.likeCount = 0;
    post.shareCount = 0;
    post.tags = [];
    post.createdAt = new Date('2023-10-26T14:31:20.093Z');
    post.updatedAt = new Date('2023-10-26T14:31:20.093Z');
    return post;
  }
});
