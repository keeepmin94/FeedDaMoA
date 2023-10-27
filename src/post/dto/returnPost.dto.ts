export class PostDto {
  id: string;
  type: string;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
