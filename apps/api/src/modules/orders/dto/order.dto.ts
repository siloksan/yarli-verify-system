import { ApiProperty } from "@nestjs/swagger";
import { IOrdersDto } from "@repo/api";
import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

export class OrderResponseDto implements IOrdersDto {
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
}