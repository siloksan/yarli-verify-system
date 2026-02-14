import { ApiProperty } from "@nestjs/swagger";
import { IComponentDto } from "@repo/api";
import { Expose } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class ComponentDto implements IComponentDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  code: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  batches: string[];
}