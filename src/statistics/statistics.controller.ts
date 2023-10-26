import { Controller } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Get, Query } from '@nestjs/common';
import { StatisticsCustomValidationPipe } from './pipes/statistics-custom-validation.pipe';
import { StatisticsDto } from './dto/statistics.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  getStatisticsPost(
    @Query(StatisticsCustomValidationPipe) statisticsDto: StatisticsDto,
  ): Promise<{ date: string; cnt: number }[]> {
    return this.statisticsService.getStatisticsPost(statisticsDto);
  }
}
