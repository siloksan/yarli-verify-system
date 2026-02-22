import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IBucketCreateDto } from '@repo/api';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateBucketDto implements IBucketCreateDto {
  @ApiProperty()
  @IsString()
  @Expose()
  componentName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  creator: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose()
  location?: string;
}
