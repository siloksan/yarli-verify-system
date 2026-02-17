import { ApiProperty } from '@nestjs/swagger';
import { ICreateScanEventDto, IScanEventDto, ScanResult } from '@repo/api';
import { Expose } from 'class-transformer';
import { IsArray, IsString, IsEnum } from 'class-validator';

export class CreateScanEventDto implements ICreateScanEventDto {
  @ApiProperty()
  @IsString()
  @Expose()
  scannedCode: string;

  @ApiProperty()
  @IsString()
  @Expose()
  orderId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  componentName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  componentId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  deviceId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  operatorId: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  validBatches: string[];
}

export class ScanEventDto implements IScanEventDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  orderId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  scannedComponentName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  scannedComponentBatch: string;

  @ApiProperty({
    enum: ScanResult,
    enumName: 'ScanResult',
  })
  @IsEnum(ScanResult)
  @Expose()
  scanResult: ScanResult;
}
