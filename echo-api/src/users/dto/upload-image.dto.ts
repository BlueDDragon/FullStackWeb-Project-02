import { ApiProperty } from "@nestjs/swagger";

export class UploadImagesDto {
    @ApiProperty({
        type: 'string',
        format: 'binary'
    })
    image: any;
}