import { ApiProperty } from "@nestjs/swagger";
import { IOrderComponentDto } from "@repo/api";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

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