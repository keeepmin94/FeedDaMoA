import { Brackets, Repository } from 'typeorm';
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator';
import { Post } from './entities/post.entity';
import { PostDto } from './dto/post.dto';
// import { Tag } from './entities/tag.entity';

@CustomRepository(Post)
export class PostRepository extends Repository<Post> {
  async findPostById(id: string): Promise<Post> {
    return await this.createQueryBuilder('post')
      .where('post.id = :id', { id })
      .leftJoinAndSelect('post.tags', 'tags')
      .getOne();
  }

  private buildQueryBuilder(postDto: PostDto) {
    const limit = postDto.pageCount;
    const offset = postDto.pageCount * (postDto.page - 1); // DTO에서 pageCount string과 page string을 number로 바꿈
    const queryBuilder = this.createQueryBuilder('posts')
      .leftJoin('posts.tags', 'tags')
      .where('tags.tag = :hashtag', {
        hashtag: postDto.hashtag,
      })
      .offset(offset)
      .limit(limit);

    if (postDto.type) {
      queryBuilder.andWhere('posts.type = :type', { type: postDto.type });
    }

    if (postDto.searchBy && postDto.search) {
      const searchBy = postDto.searchBy;
      const searchValue = `%${postDto.search}%`;

      queryBuilder.andWhere(
        new Brackets((search) => {
          if (searchBy === 'title') {
            search.orWhere('posts.title LIKE :searchValue', { searchValue });
          }
          if (searchBy === 'content') {
            search.orWhere('posts.content LIKE :searchValue', { searchValue });
          }
          if (searchBy === 'title,content') {
            search
              .orWhere('posts.title LIKE :searchValue')
              .orWhere('posts.content LIKE :searchValue', { searchValue });
          }
        }),
      );
    }
    // console.log(queryBuilder.getQuery());
    let orderByColumn = [
      'updated_at',
      'like_count',
      'share_count',
      'view_count',
    ].includes(postDto.orderBy)
      ? postDto.orderBy
      : 'created_at';
    const orderDirection = postDto.orderDirection === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`posts.${orderByColumn}`, orderDirection);
    return queryBuilder;
  }

  async findPostByTag(postDto: PostDto) {
    const queryBuilder = this.buildQueryBuilder(postDto);
    const posts = await queryBuilder.getRawMany();
    const postIds = posts.map((post) => post.posts_id);

    const postsWithAllTags = await this.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tags')
      .whereInIds(postIds)
      .getMany();

    const postsWithTruncatedContent = postsWithAllTags.map((post) => ({
      ...post,
      content: post.content.substring(0, 20),
    }));

    return { posts: postsWithTruncatedContent };
  }
}
