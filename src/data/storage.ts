import { supabase } from '@/lib/supabase';

const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60;

const isAbsoluteUrl = (value: string) => /^https?:\/\//.test(value);

// Uploads a local file and returns the storage PATH (not a URL) — buckets
// are private, so the path is what gets stored in the DB and resolved to a
// signed URL later, on read.
export async function uploadImage(bucket: string, path: string, localUri: string): Promise<string> {
  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') ?? 'image/jpeg';

  const { error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
    contentType,
    upsert: true,
  });
  if (error) throw error;

  return path;
}

export function randomStoragePath(userId: string, extension = 'jpg'): string {
  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${userId}/${token}.${extension}`;
}

// Resolves a stored path to a short-lived signed URL — or passes an already-
// absolute URL straight through (the "paste a link" image source, which
// never touches Storage).
export async function resolveImageUrl(bucket: string, pathOrUrl: string): Promise<string> {
  if (isAbsoluteUrl(pathOrUrl)) return pathOrUrl;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(pathOrUrl, SIGNED_URL_EXPIRES_IN_SECONDS);
  if (error) throw error;
  return data.signedUrl;
}

// Batched form of resolveImageUrl — one round trip for every storage path,
// keyed by the original path/url so callers can look up each result.
export async function resolveImageUrls(bucket: string, pathsOrUrls: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(pathsOrUrls)];
  const result: Record<string, string> = {};

  const toSign = unique.filter((value) => !isAbsoluteUrl(value));
  for (const url of unique) {
    if (isAbsoluteUrl(url)) result[url] = url;
  }

  if (toSign.length > 0) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrls(toSign, SIGNED_URL_EXPIRES_IN_SECONDS);
    if (error) throw error;
    data.forEach((entry, i) => {
      if (entry.signedUrl) result[toSign[i]] = entry.signedUrl;
    });
  }

  return result;
}
