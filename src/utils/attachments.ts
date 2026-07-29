import * as FileSystem from "expo-file-system/legacy";

const DOCUMENT_DIR = FileSystem.documentDirectory;
if (!DOCUMENT_DIR) {
  throw new Error("Document directory is unavailable.");
}

const ATTACHMENTS_ROOT = `${DOCUMENT_DIR}attachments/`;
const PENDING_DIR = `${ATTACHMENTS_ROOT}_pending/`;

function getProductDir(productId: number) {
  return `${ATTACHMENTS_ROOT}${productId}/`;
}

function uniqueFilename() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
}

async function ensureDir(dir: string) {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export function parseAttachments(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((uri) => typeof uri === "string") : [];
  } catch {
    return [];
  }
}

export function serializeAttachments(attachments: string[]): string {
  return JSON.stringify(attachments);
}

export async function saveAttachmentFromUri(
  sourceUri: string,
  productId?: number,
): Promise<string> {
  const dir = productId ? getProductDir(productId) : PENDING_DIR;
  await ensureDir(dir);

  const destination = `${dir}${uniqueFilename()}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destination });
  return destination;
}

export async function deleteAttachmentFile(uri: string) {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch {
    // Ignore missing or inaccessible files.
  }
}

export async function deleteProductAttachments(productId: number) {
  const dir = getProductDir(productId);
  try {
    const info = await FileSystem.getInfoAsync(dir);
    if (info.exists) {
      await FileSystem.deleteAsync(dir, { idempotent: true });
    }
  } catch {
    // Ignore cleanup failures.
  }
}

export async function finalizePendingAttachments(
  pendingUris: string[],
  productId: number,
): Promise<string[]> {
  const productDir = getProductDir(productId);
  await ensureDir(productDir);

  const finalized: string[] = [];

  for (const uri of pendingUris) {
    if (uri.startsWith(PENDING_DIR)) {
      const destination = `${productDir}${uniqueFilename()}`;
      await FileSystem.moveAsync({ from: uri, to: destination });
      finalized.push(destination);
      continue;
    }

    if (uri.startsWith(productDir)) {
      finalized.push(uri);
      continue;
    }

    const destination = `${productDir}${uniqueFilename()}`;
    await FileSystem.copyAsync({ from: uri, to: destination });
    finalized.push(destination);
  }

  return finalized;
}

export async function syncRemovedAttachments(
  previous: string[],
  current: string[],
) {
  const removed = previous.filter((uri) => !current.includes(uri));
  await Promise.all(removed.map((uri) => deleteAttachmentFile(uri)));
}

export function isPendingAttachment(uri: string) {
  return uri.startsWith(PENDING_DIR);
}
