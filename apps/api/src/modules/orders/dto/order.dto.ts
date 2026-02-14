import { ApiProperty } from '@nestjs/swagger';
import { type IOrderDto, OrderStatus } from '@repo/api';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class OrderResponseDto implements IOrderDto {
  status: OrderStatus;
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  orderNumber: string;

  @ApiProperty({
    enum: OrderStatus,
    enumName: 'OrderStatus',
  })
  @IsEnum(OrderStatus)
  @Expose()
  orderStatus: OrderStatus;

  @ApiProperty()
  @IsString()
  @Expose()
  label: string;
}
