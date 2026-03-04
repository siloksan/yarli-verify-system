import { ApiProperty } from '@nestjs/swagger';
import { type IOrderDto, OrderStatus } from '@repo/api';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class OrderResponseDto implements IOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    enumName: 'OrderStatus',
  })
  @IsEnum(OrderStatus)
  @Expose()
  status: OrderStatus;

  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  orderNumber: string;

  @ApiProperty()
  @IsString()
  @Expose()
  label: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  @Expose()
  plannedAt?: string | null;

  @ApiProperty()
  @IsString()
  @Expose()
  weight: string;
}
