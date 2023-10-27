import { Injectable } from '@nestjs/common';
import { StatisticsDto } from './dto/statistics.dto';
import { Post } from 'src/post/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatisticsType, StatisticsValue } from './enums/statistics.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getStatisticsPost(
    statisticsDto: StatisticsDto,
  ): Promise<{ date: string; count: number }[]> {
    //
    const { hashtag, type, start, end, value } = statisticsDto;

    // hashtag === '' ? 토큰으로 유저 계정 찾기 : hashtag

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.tags', 'tag');

    type === StatisticsType.DATE
      ? queryBuilder.select("TO_CHAR(post.created_at, 'YYYY-MM-DD') AS date")
      : queryBuilder.select(
          "TO_CHAR(post.created_at, 'YYYY-MM-DD HH24') AS hour",
        );

    value === StatisticsValue.COUNT
      ? queryBuilder.addSelect('COUNT(*)', 'count')
      : value === StatisticsValue.VIEW_COUNT
      ? queryBuilder.addSelect('SUM(post.view_count)', 'count')
      : value === StatisticsValue.LIKE_COUNT
      ? queryBuilder.addSelect('SUM(post.like_count)', 'count')
      : queryBuilder.addSelect('SUM(post.share_count)', 'count');

    queryBuilder
      .where('tag.name = :hashtag', { hashtag })
      .andWhere('post.createdAt >= :start', { start })
      .andWhere('post.createdAt <= :end', { end })
      .groupBy(`${type}`)
      .orderBy(`${type}`);

    const posts = await queryBuilder.getRawMany();

    //return this.fillDate(posts, start, end);
    return posts;
  }

  // private fillDate(statistics: any[], startDateTime: Date, endDateTime: Date) {
  //   // 모든 시간대를 생성합니다.
  //   const allDates = [];
  //   const currentDate = new Date(startDateTime);
  //   while (currentDate <= endDateTime) {
  //     allDates.push(startDateTime);
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }

  //   const result = allDates.map((date) => {
  //     const d = date.toISOString().split('T')[0];
  //     const c = statistics.find((row) => row.date === d);

  //     return {
  //       date: d,
  //       count: c ? c.count : 0,
  //     };
  //   });

  //   return result;
  // }
}
