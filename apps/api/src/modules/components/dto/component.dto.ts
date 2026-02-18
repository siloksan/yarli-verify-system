import { ApiProperty } from '@nestjs/swagger';
import { IBatchInfo, IComponentDto } from '@repo/api';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class BatchInfoDto implements IBatchInfo {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  batchNumber: string;

  @ApiProperty()
  @IsString()
  @Expose()
  barcode: string;
}

export class ComponentDto implements IComponentDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ type: [BatchInfoDto] })
  @IsArray()
  @Type(() => BatchInfoDto)
  @Expose()
  batches: BatchInfoDto[];
}
