import { ApiProperty } from '@nestjs/swagger';
import { IOrderComponentDto, type IScanEvent, ScanResult } from '@repo/api';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderResponseDto } from './order.dto';

class ScanEvent implements IScanEvent {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  batchId: string;

  @ApiProperty({
    enum: ScanResult,
    enumName: 'ScanResult',
  })
  @IsEnum(ScanResult)
  @Expose()
  result: ScanResult;

  @ApiProperty()
  @IsString()
  @Expose()
  deviceId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  operatorId: string;
}

export class OrderComponent implements IOrderComponentDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  orderId: string;

 @ApiProperty()
  @IsNumber()
  @Expose()
  position: number;

  @ApiProperty()
  @IsString()
  @Expose()
  componentName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  requiredQty: string;

  @ApiProperty()
  @IsString()
  @Expose()
  unit: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  validBatches: string[];

  @ApiProperty({ type: [ScanEvent] })
  @Type(() => ScanEvent)
  @Expose()
  scanEvents: ScanEvent[];
}

export class OrderWithComponentsResponseDto extends OrderResponseDto {
  @ApiProperty({ type: [OrderComponent] })
  @Type(() => OrderComponent)
  @Expose()
  components: OrderComponent[];
}
