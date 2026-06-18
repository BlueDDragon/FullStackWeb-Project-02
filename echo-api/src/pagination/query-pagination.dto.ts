import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class QueryPaginationDto {
    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page: number = 1;

    @ApiPropertyOptional({ example: 10 })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit: number = 10;
}