/**
 * Storage Service
 * 
 * Abstraction layer for file storage.
 * Phase 1: Local filesystem. Phase 3: S3-compatible storage.
 */

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { generateId } from "@/lib/utils";
import { APP_CONFIG } from "@/config/constants";

export interface StoredFile {
  id: string;
  filename: string;
  filePath: string;
  fileType: string;
  size: number;
}

/**
 * Save an uploaded file to local storage
 */
export async function saveFile(
  buffer: Buffer,
  originalFilename: string,
  fileType: string
): Promise<StoredFile> {
  const id = generateId();
  const ext = fileType === "pdf" ? "pdf" : fileType === "docx" ? "docx" : "txt";
  const filename = `${id}.${ext}`;
  const filePath = join(process.cwd(), APP_CONFIG.UPLOAD_DIR, filename);

  // Ensure upload directory exists
  await mkdir(join(process.cwd(), APP_CONFIG.UPLOAD_DIR), { recursive: true });

  // Write file
  await writeFile(filePath, buffer);

  return {
    id,
    filename: originalFilename,
    filePath,
    fileType,
    size: buffer.length,
  };
}

/**
 * Read a stored file from disk
 */
export async function readFile(filePath: string): Promise<Buffer> {
  const { readFile: fsReadFile } = await import("fs/promises");
  return fsReadFile(filePath);
}

/**
 * Delete a stored file
 */
export async function deleteFile(filePath: string): Promise<void> {
  const { unlink } = await import("fs/promises");
  await unlink(filePath).catch(() => {
    // File may not exist; ignore
  });
}
