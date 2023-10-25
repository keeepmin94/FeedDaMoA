import { Controller } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Get, Query, UsePipes } from '@nestjs/common';
import { StatisticsCustomValidationPipe } from './pipes/statistics-custom-validation.pipe';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  @UsePipes(new StatisticsCustomValidationPipe())
  getTest(@Query() query) {
    return query;
  }
}
