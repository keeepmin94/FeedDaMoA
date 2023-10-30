import { Controller } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Get, Query } from '@nestjs/common';
import { StatisticsCustomValidationPipe } from './pipes/statistics-custom-validation.pipe';
import { StatisticsDto } from './dto/statistics.dto';
import { IStatisticsResult } from './type/statistics.interface';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('통계')
@Controller('statistics')
@UseGuards(AuthGuard())
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @ApiOperation({
    summary: '게시글 통계 조회',
    description: '호출자가 원하는 게시글의 통계를 가져옵니다.',
  })
  @ApiQuery({
    name: 'hashtag',
    required: true,
    description: '검색할 해시태그',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    description: '시간대 별로 조회할지 날짜별로 조회할지',
  })
  @ApiQuery({
    name: 'start',
    required: true,
    description: '조회 시작일',
  })
  @ApiQuery({
    name: 'end',
    required: true,
    description: '조회 종료일',
  })
  @ApiQuery({
    name: 'value',
    required: true,
    description: '조회할 목록',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @Get()
  getStatisticsPost(
    @Query(StatisticsCustomValidationPipe) statisticsDto: StatisticsDto,
    @GetUser() user: User,
  ): Promise<IStatisticsResult[]> {
    return this.statisticsService.getStatisticsPost(statisticsDto, user);
  }
}
