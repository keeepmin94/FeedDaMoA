import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Post } from 'src/post/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/common/decorator/typeorm-ex.module';
import { StatisticsCustomRepository } from './statistics.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmExModule.forCustomRepository([StatisticsCustomRepository]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
