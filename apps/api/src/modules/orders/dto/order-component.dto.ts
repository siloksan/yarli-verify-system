import { ApiProperty } from "@nestjs/swagger";
import { IOrderComponentDto } from "@repo/api";
import { Expose, Type } from "class-transformer";
import { IsString } from "class-validator";
import { OrderResponseDto } from "./order.dto";

export class OrderComponentResponseDto implements IOrderComponentDto {
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
    componentName: string;
    
    @ApiProperty()
    @IsString()
    @Expose()
    requiredQty: string;

    @ApiProperty()
    @IsString()
    @Expose()
    unit: string;
    
    @ApiProperty()
    @IsString()
    @Expose()
    validBatches: string[];
}

export class OrderWithComponentsResponseDto extends OrderResponseDto {
    @ApiProperty({ type: [OrderComponentResponseDto] })
    @Type(() => OrderComponentResponseDto) // This is crucial!
    @Expose()
    components: OrderComponentResponseDto[];  
}