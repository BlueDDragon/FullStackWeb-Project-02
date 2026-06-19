import { PartialType } from '@nestjs/swagger';
import { CreateBookmarkFolderDto } from './create-bookmark-folder.dto';

export class UpdateBookmarkFolderDto extends PartialType(CreateBookmarkFolderDto) {}
