import { Repository } from 'typeorm';
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator';
import { Post } from 'src/post/entities/post.entity';
import { StatisticsDto } from './dto/statistics.dto';
import { StatisticsType, StatisticsValue } from './enums/statistics.enum';
import { IStatisticsResult } from './type/statistics.interface';

@CustomRepository(Post)
export class StatisticsCustomRepository extends Repository<Post> {
  async getStatisticsPost(
    statisticsDto: StatisticsDto,
  ): Promise<IStatisticsResult[]> {
    const { hashtag, type, start, end, value } = statisticsDto;
    const queryBuilder = this.createQueryBuilder('post').innerJoin(
      'post.tags',
      'tag',
    );

    type === StatisticsType.DATE
      ? queryBuilder.select("TO_CHAR(post.created_at, 'YYYY-MM-DD') AS date")
      : queryBuilder.select(
          "TO_CHAR(post.created_at, 'YYYY-MM-DD HH24') AS hour",
        );

    // fix: Switch문이 더 좋은것 같아 수정
    // value === StatisticsValue.COUNT
    //   ? queryBuilder.addSelect('COUNT(*)', 'count')
    //   : value === StatisticsValue.VIEW_COUNT
    //   ? queryBuilder.addSelect('SUM(post.view_count)', 'count')
    //   : value === StatisticsValue.LIKE_COUNT
    //   ? queryBuilder.addSelect('SUM(post.like_count)', 'count')
    //   : queryBuilder.addSelect('SUM(post.share_count)', 'count');

    switch (value) {
      case StatisticsValue.COUNT:
        queryBuilder.addSelect('COUNT(*)', 'count');
        break;
      case StatisticsValue.VIEW_COUNT:
        queryBuilder.addSelect('SUM(post.view_count)', 'count');
        break;
      case StatisticsValue.LIKE_COUNT:
        queryBuilder.addSelect('SUM(post.like_count)', 'count');
        break;
      case StatisticsValue.SHARE_COUNT:
        queryBuilder.addSelect('SUM(post.share_count)', 'count');
        break;
      default:
        queryBuilder.addSelect('COUNT(*)', 'count'); // 혹시 몰라 default값으로
        break;
    }

    queryBuilder
      .where('tag.tag = :hashtag', { hashtag })
      .andWhere('post.createdAt >= :start', { start })
      .andWhere('post.createdAt <= :end', { end })
      .groupBy(`${type}`)
      .orderBy(`${type}`);

    const posts = await queryBuilder.getRawMany();

    return posts;
  }
}
