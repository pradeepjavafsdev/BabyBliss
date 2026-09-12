import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ensureFirebaseAuth, getFirebaseStorage, isFirebaseConfigured } from './firebase';

function guessExtension(uri: string, mimeType?: string) {
  if (mimeType?.includes('png')) return 'png';
  if (mimeType?.includes('webp')) return 'webp';
  if (mimeType?.includes('gif')) return 'gif';
  if (mimeType?.includes('mp4') || mimeType?.includes('video')) return 'mp4';
  const fromUri = uri.split('?')[0]?.split('.').pop()?.toLowerCase();
  if (fromUri && fromUri.length <= 4) return fromUri;
  return 'jpg';
}

function contentTypeFor(ext: string, mimeType?: string) {
  if (mimeType) return mimeType;
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'mp4' || ext === 'mov') return 'video/mp4';
  return 'image/jpeg';
}

async function uriToBytes(uri: string): Promise<Uint8Array> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Could not read the selected photo.');
  }
  return new Uint8Array(await response.arrayBuffer());
}

export async function uploadMemoryMedia(
  localUri: string,
  babyId: string,
  memoryId: string,
  mimeType?: string
): Promise<string> {
  if (!isFirebaseConfigured()) return localUri;
  const storage = getFirebaseStorage();
  if (!storage) return localUri;

  await ensureFirebaseAuth();

  const ext = guessExtension(localUri, mimeType);
  const contentType = contentTypeFor(ext, mimeType);
  const path = `memories/${babyId}/${memoryId}.${ext}`;
  const fileRef = ref(storage, path);
  const bytes = await uriToBytes(localUri);
  await uploadBytes(fileRef, bytes, { contentType });
  return getDownloadURL(fileRef);
}

export async function deleteMemoryMedia(uri?: string): Promise<void> {
  if (!uri || !uri.includes('firebasestorage')) return;
  const storage = getFirebaseStorage();
  if (!storage) return;
  try {
    await deleteObject(ref(storage, uri));
  } catch (error) {
    console.warn('Firebase media delete failed', error);
  }
}

export function isRemoteMediaUri(uri?: string) {
  return Boolean(uri && (uri.startsWith('http://') || uri.startsWith('https://')));
}
