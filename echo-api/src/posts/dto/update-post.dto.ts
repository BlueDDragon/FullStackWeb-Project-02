import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePostDto, CreatePostWithImagesDto } from './create-post.dto';
import { IsArray, IsOptional, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class UpdatePostWithImagesDto extends PartialType(CreatePostWithImagesDto) {
    @ApiPropertyOptional({ 
        type: "string",
        isArray: true
    })
    @Transform(({ value }) => value.split(','))
    // @IsArray()
    // @IsUrl({}, { each: true })
    @IsOptional()
    removeImages: string[];
}