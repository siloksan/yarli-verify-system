import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IBucketCreateDto, IBucketResponseDto } from '@repo/api';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateBucketDto implements IBucketCreateDto {
  @ApiProperty()
  @IsString()
  @Expose()
  componentId: string;

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

class ComponentDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;
}

export class BucketResponseDto implements IBucketResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  creator: string;

  @ApiProperty({
    description: 'Creation date in ISO 8601 format',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  @IsDateString()
  @Expose()
  createdAt: string;

  @ApiProperty({
    description: 'Date of update in ISO 8601 format',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  @IsDateString()
  @Expose()
  updatedAt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose()
  location?: string;

  @ApiProperty({ type: ComponentDto })
  @ValidateNested()
  @Type(() => ComponentDto)
  @Expose()
  component: ComponentDto;
}
