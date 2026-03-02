import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ICreateFillingActBucketDto,
  IFillingActBucketResponseDto,
  ICreateFillingContainerActDto,
  IFillingContainerActResponseDto,
} from '@repo/api';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsDecimal,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFillingBucketActDto implements ICreateFillingActBucketDto {
  @ApiProperty()
  @IsString()
  workerName: string;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsDecimal()
  weight: string | null;

  @ApiProperty()
  @IsString()
  bucketId: string;

  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  validBatchesId: ICreateFillingActBucketDto['validBatchesId'];

  @ApiProperty()
  @IsString()
  componentBarcode: string;

  @ApiProperty()
  @IsString()
  recipeComponentId: string;

  @ApiProperty()
  @IsString()
  recipeComponentName: string;
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
    type: String,
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
    type: String,
  })
  @IsDateString()
  @Expose()
  createdAt: string;
}

export class CreateFillingContainerAct implements ICreateFillingContainerActDto {
  @ApiProperty()
  @IsString()
  workerName: string;

  @ApiProperty()
  @IsString()
  componentBarcode: string;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsDecimal()
  weight: string | null;
}

export class FillingContainerActResponseDto implements IFillingContainerActResponseDto {
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
  componentBatchNumber: string;

  @ApiProperty()
  @IsString()
  @Expose()
  workerName: string;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose()
  weight: string | null;

  @ApiProperty({
    description: 'Creation date in ISO 8601 format',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  @IsDateString()
  @Expose()
  createdAt: string;
}
