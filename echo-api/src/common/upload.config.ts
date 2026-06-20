import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';

export const ALLOWED_MINE = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// export const imageUploadOptions = {
//     storage: diskStorage({
//         destination: uploadConstants.dir,
//         filename:(_req, file, callback) => {
//             const unique = randomUUID();
//             const ext = extname(file.originalname).toLowerCase();
//             callback(null, `${unique}${ext}`);
//         }
//     }),
//     fileFilter:(_req, file, callback) => {
//         if (!ALLOWED_MINE.includes(file.mimetype)) {
//             callback(new BadRequestException(), false);
//             return;
//         }
//         callback(null, true);
//     },
//     limit: { fileSize: MAX_FILE_SIZE },
// }

export function createImageUploadOptions(destination: string) {
    return {
        storage: diskStorage({
            destination: destination,
            filename:(_req, file, callback) => {
                const unique = randomUUID();
                const ext = extname(file.originalname).toLowerCase();
                callback(null, `${unique}${ext}`);
            }
        }),
        fileFilter:(_req, file, callback) => {
            if (!ALLOWED_MINE.includes(file.mimetype)) {
                callback(new BadRequestException(), false);
                return;
            }
            callback(null, true);
        },
        limit: { fileSize: MAX_FILE_SIZE },
        limits: { fileSize: MAX_FILE_SIZE },
    }
}
