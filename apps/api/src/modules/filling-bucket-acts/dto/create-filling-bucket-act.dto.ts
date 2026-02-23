import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreatFillingActBucketDto, IFillingActBucketResponseDto } from '@repo/api';
import { Expose } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateFillingBucketActDto implements ICreatFillingActBucketDto {
  @ApiProperty()
  @IsString()
  componentId: string;

  @ApiProperty()
  @IsString()
  batchId: string;

  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  workerName: string;

  @ApiPropertyOptional({
    nullable: true,
    type: String
  })
  @IsOptional()
  @IsString()
  @Expose()
  weight: string | null;

  @ApiProperty()
  @IsString()
  @Expose()
  bucketId: string;
}

export class FillingBucketActResponseDto implements IFillingActBucketResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  componentName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  componentBatch: string;

  @ApiProperty()
  @IsString()
  @Expose()
  workerName: string;

  @ApiPropertyOptional({
    nullable: true,
    type: String
  })
  @IsOptional()
  @IsString()
  @Expose()
  weight: string | null;

  @ApiProperty()
  @IsString()
  @Expose()
  bucketId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  componentId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  orderId: string;

  @ApiProperty({
    description: 'Creation date in ISO 8601 format',
    example: '2024-01-15T10:30:00.000Z',
    type: String
  })
  @IsDateString()
  @Expose()
  createdAt: string; 
}