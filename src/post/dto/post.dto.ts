import { IsOptional, IsString } from 'class-validator';
import { SnsType } from '../types/post.enum';
export class PostDto {
  @IsOptional()
  @IsString()
  hashtag: string;
  @IsOptional()
  type: SnsType;
  @IsOptional()
  @IsString()
  orderBy: string;
  @IsOptional()
  @IsString()
  orderDirection: string;
  @IsOptional()
  @IsString()
  searchBy: string;
  @IsOptional()
  @IsString()
  search: string;
  @IsOptional()
  pageCount: number;
  @IsOptional()
  page: number;
}
