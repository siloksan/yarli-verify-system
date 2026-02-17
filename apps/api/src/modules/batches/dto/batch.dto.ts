import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { type IBatchDto } from '@repo/api';

export class BatchDto implements IBatchDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  batch: string;

  @ApiProperty()
  @IsString()
  @Expose()
  componentId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  componentName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  code: string;
}
