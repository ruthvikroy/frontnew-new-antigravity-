import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

for (const scope of SCOPES) {
  provider.addScope(scope);
}

let isSigningIn = false;
let cachedAccessToken = null;

export const initAuth = (onAuthSuccess, onAuthFailure) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async () => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async () => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

/**
 * List files in the user's Google Drive.
 */
export async function listDriveFiles(searchQuery = '') {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('UNAUTHENTICATED');
  }

  const baseConditions = ['trashed = false'];
  if (searchQuery.trim()) {
    const escaped = searchQuery.trim().replace(/'/g, "\\'");
    baseConditions.push(`name contains '${escaped}'`);
  }

  const q = encodeURIComponent(baseConditions.join(' and '));
  const fields = encodeURIComponent(
    'files(id,name,mimeType,modifiedTime,size,webViewLink,thumbnailLink,description)'
  );
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=25&orderBy=modifiedTime desc&fields=${fields}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('UNAUTHENTICATED');
  }
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Drive API error (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Convert a base64 Data URL to a binary Blob.
 */
function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binaryStr = atob(parts[1]);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Upload a PNG snapshot of the 3D Moon canvas to Google Drive.
 */
export async function uploadLunarSnapshotToDrive(filename, dataUrl, description) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('UNAUTHENTICATED');
  }

  const metadata = {
    name: filename.endsWith('.png') ? filename : `${filename}.png`,
    mimeType: 'image/png',
    description,
  };

  const imageBlob = dataUrlToBlob(dataUrl);
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', imageBlob);

  const fields = encodeURIComponent('id,name,mimeType,modifiedTime,webViewLink,description');
  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=${fields}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (res.status === 401 || res.status === 403) {
    throw new Error('UNAUTHENTICATED');
  }
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Upload failed (${res.status})`);
  }

  return await res.json();
}

/**
 * Save or overwrite a Lunar Simulation Preset JSON file in Google Drive.
 */
export async function saveSimulationPresetToDrive(filename, preset, existingFileId) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('UNAUTHENTICATED');
  }

  const normalizedName = filename.endsWith('.json') ? filename : `${filename}.json`;
  const metadata = {
    name: normalizedName,
    mimeType: 'application/json',
    description: `Celestial Simulation Preset`,
  };

  const jsonBlob = new Blob([JSON.stringify(preset, null, 2)], {
    type: 'application/json',
  });

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', jsonBlob);

  const fields = encodeURIComponent('id,name,mimeType,modifiedTime,webViewLink,description');
  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart&fields=${fields}`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=${fields}`;

  const res = await fetch(url, {
    method: existingFileId ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('UNAUTHENTICATED');
  }
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Preset save failed (${res.status})`);
  }

  return await res.json();
}

/**
 * Read a JSON simulation preset file from Google Drive.
 */
export async function loadSimulationPresetFromDrive(fileId) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('UNAUTHENTICATED');
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('UNAUTHENTICATED');
  }
  if (!res.ok) {
    throw new Error(`Failed to read preset file (${res.status})`);
  }

  const parsed = await res.json();
  return parsed;
}

/**
 * Delete a file from Google Drive.
 */
export async function deleteFileFromDrive(fileId) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('UNAUTHENTICATED');
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('UNAUTHENTICATED');
  }
  if (!res.ok && res.status !== 204) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Failed to delete file (${res.status})`);
  }
  return true;
}
