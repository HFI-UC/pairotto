import { logger } from "../../logger.js";

export interface StoredImage {
  base64: string;
  mimeType: string;
  fileName?: string;
  timestamp: number;
}

const lastImageByUser = new Map<string, StoredImage>();

export function setLastImage(userId: string, image: Omit<StoredImage, "timestamp">) {
  logger.debug(userId)
  lastImageByUser.set(userId, { ...image, timestamp: Date.now() });
}

export function getLastImage(userId: string): StoredImage | undefined {
  logger.debug(userId)
  return lastImageByUser.get(userId);
}

export function clearLastImage(userId: string) {
  lastImageByUser.delete(userId);
}
