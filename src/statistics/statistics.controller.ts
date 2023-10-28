import { Controller } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Get, Query } from '@nestjs/common';
import { StatisticsCustomValidationPipe } from './pipes/statistics-custom-validation.pipe';
import { StatisticsDto } from './dto/statistics.dto';
import { IStatisticsResult } from './type/statistics.interface';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

@Controller('statistics')
@UseGuards(AuthGuard())
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  getStatisticsPost(
    @Query(StatisticsCustomValidationPipe) statisticsDto: StatisticsDto,
    @GetUser() user: User,
  ): Promise<IStatisticsResult[]> {
    return this.statisticsService.getStatisticsPost(statisticsDto, user);
  }
}
