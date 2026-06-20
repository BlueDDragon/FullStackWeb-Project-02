import { join, parse } from "path";
import { domainConstants, portConstants } from "./constants";
import { unlink } from 'fs/promises';
import { existsSync } from "fs";

export function getImageId(file: Express.Multer.File) {
    return parse(file.filename).name;
}

export function getImageUploadUrl(file: Express.Multer.File) {
    return `${domainConstants.domain}:${portConstants.port}/${file.path}`;
}

export async function removeOldFile(fileUrl: string) {
  if (!fileUrl) return;

  try {
    const pathname = new URL(fileUrl).pathname;
    const filePath = join(process.cwd(), pathname.replace(/^\/+/, ''));
    if (existsSync(filePath)) await unlink(filePath);
  } catch (error) {
    console.log(`fail to image delete:`, fileUrl, error);
  }
}

export async function removeOldFiles(fileUrls: string[]) {
  await Promise.all(fileUrls.map(removeOldFile));
}

export async function removeUploadedFiles(files: Express.Multer.File[]) {
  if (!files || files.length === 0) return;

  await Promise.all(
    files.map(async (file) => {
      try { 
        if (existsSync(file.path)) await unlink(file.path);
      } catch (error) {
        console.log(`fail to image delete:`, file.path, error);
      }
    }),
  );
}

export async function cleanupOnError<T>(files: Express.Multer.File[], callback: () => Promise<T>): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    await removeUploadedFiles(files);
    throw error;
  }
}