import { ApiProperty } from '@nestjs/swagger';
import {
  ICreateBarcodeScanEventDto,
  IScanEvent,
  ScanResult,
  ICreateQrCodeScanEventDto,
  BucketQRData,
} from '@repo/api';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateBarcodeScanEventDto implements ICreateBarcodeScanEventDto {
  @ApiProperty()
  @IsString()
  scannedCode: string;

  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  componentName: string;

  @ApiProperty()
  @IsString()
  componentId: string;

  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsString()
  operatorId: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  validBatches: string[];
}

class BucketQRDataDto implements BucketQRData {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  componentName: string;

  @ApiProperty()
  @IsString()
  componentId: string;

  @ApiProperty()
  @IsString()
  creator: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;
}

export class CreateQrCodeScanEventDto implements ICreateQrCodeScanEventDto {
  @ApiProperty({ type: BucketQRDataDto })
  @ValidateNested()
  @Type(() => BucketQRDataDto)
  qrData: BucketQRDataDto;

  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  componentName: string;

  @ApiProperty()
  @IsString()
  componentId: string;

  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsString()
  operatorId: string;
}

export class ScanEventDto implements IScanEvent {
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
  @IsOptional()
  @Expose()
  scannedComponentBatch: string;

  @ApiProperty({
    enum: ScanResult,
    enumName: 'ScanResult',
  })
  @IsEnum(ScanResult)
  @Expose()
  result: ScanResult;
}
