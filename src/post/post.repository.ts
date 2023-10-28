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

  async findPostByTag(postDto: PostDto) {
    const queryBuilder = this.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tags')
      .where('tags.tag = :hashtag', {
        hashtag: postDto.hashtag,
      });

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
          if (searchBy === 'title+content') {
            search
              .orWhere('posts.title LIKE :searchValue')
              .orWhere('posts.content LIKE :searchValue', { searchValue });
          }
        }),
      );
    }
    console.log(postDto.orderBy);
    let orderByColumn = 'created_at';
    if (
      postDto.orderBy === 'updated_at' ||
      postDto.orderBy === 'like_count' ||
      postDto.orderBy === 'share_count' ||
      postDto.orderBy === 'view_count'
    ) {
      orderByColumn = postDto.orderBy;
    }
    const orderDirection = postDto.orderDirection === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`posts.${orderByColumn}`, orderDirection);

    const limit = postDto.pageCount;
    const offset = postDto.pageCount * (postDto.page - 1); // DTO에서 pageCount string과 page string을 number로 바꿈

    // const pageInfo = await queryBuilder.skip(offset).take(limit);
    const posts = await queryBuilder.getMany();
    return { posts };
  }
}
