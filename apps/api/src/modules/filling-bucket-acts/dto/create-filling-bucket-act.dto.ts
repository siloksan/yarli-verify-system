import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IFillingActBucketDto } from '@repo/api';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateFillingBucketActDto implements IFillingActBucketDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose()
  weight?: string;

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
}
