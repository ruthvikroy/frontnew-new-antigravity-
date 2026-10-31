import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
  Upload,
  FolderOpen,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Camera,
  FileJson,
  FileText,
  Image as ImageIcon,
  LogOut,
  Search,
  Save,
  X,
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  listDriveFiles,
  uploadLunarSnapshotToDrive,
  saveSimulationPresetToDrive,
  loadSimulationPresetFromDrive,
  deleteFileFromDrive,
} from '../../services/googleDrive.js';

export const GoogleDriveSignInButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="gsi-material-button"
    aria-label="Sign in with Google"
  >
    <div className="gsi-material-button-state"></div>
    <div className="gsi-material-button-content-wrapper">
      <div className="gsi-material-button-icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ display: 'block' }}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          ></path>
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          ></path>
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          ></path>
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          ></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
      </div>
      <span className="gsi-material-button-contents">
        {disabled ? 'Signing in...' : 'Sign in with Google'}
      </span>
      <span style={{ display: 'none' }}>Sign in with Google</span>
    </div>
  </button>
);

export const GoogleDrivePanel = ({
  isOpen,
  onClose,
  currentPreset,
  onApplyPreset,
  onCaptureCanvasDataUrl,
}) => {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('Mars_Recon_Observation');
  const [statusMessage, setStatusMessage] = useState(null);
  const [pendingConfirm, setPendingConfirm] = useState(null);

  const fetchFiles = useCallback(async (query = '') => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsLoadingFiles(true);
    try {
      const list = await listDriveFiles(query);
      setFiles(list);
      setNeedsAuth(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load files';
      if (msg === 'UNAUTHENTICATED') {
        setNeedsAuth(true);
      } else {
        setStatusMessage({ type: 'error', text: msg });
      }
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      authedUser => {
        setUser(authedUser);
        setNeedsAuth(false);
        fetchFiles();
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
        setFiles([]);
      }
    );
    return () => unsubscribe();
  }, [fetchFiles]);

  useEffect(() => {
    if (isOpen && !needsAuth) {
      fetchFiles(searchQuery);
    }
  }, [isOpen, needsAuth, fetchFiles, searchQuery]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
        await fetchFiles(searchQuery);
        setStatusMessage({
          type: 'success',
          text: 'Connected to Google Drive.',
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setFiles([]);
    setStatusMessage(null);
  };

  const handleSaveSnapshot = async () => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    const dataUrl = onCaptureCanvasDataUrl();
    if (!dataUrl) {
      setStatusMessage({
        type: 'error',
        text: 'Could not capture WebGL canvas snapshot.',
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const baseName = customName.trim() || 'Mars_Snapshot';
      const filename = `${baseName}_${timestamp}.png`;
      const desc = `3D Mars Snapshot | Relief: ${currentPreset.reliefScale} | Solar Phase: ${currentPreset.sunPhaseAngle}° | Target: ${currentPreset.selectedLandmarkId || 'Global'}`;
      const uploaded = await uploadLunarSnapshotToDrive(filename, dataUrl, desc);
      setStatusMessage({
        type: 'success',
        text: `Saved snapshot "${uploaded.name}" to Google Drive.`,
      });
      await fetchFiles(searchQuery);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Snapshot upload failed.';
      if (msg === 'UNAUTHENTICATED') setNeedsAuth(true);
      else setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreset = async () => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const baseName = customName.trim() || 'Mars_Preset';
      const filename = `${baseName}_preset.json`;
      const saved = await saveSimulationPresetToDrive(filename, currentPreset);
      setStatusMessage({
        type: 'success',
        text: `Saved simulation preset "${saved.name}" to Google Drive.`,
      });
      await fetchFiles(searchQuery);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Preset upload failed.';
      if (msg === 'UNAUTHENTICATED') setNeedsAuth(true);
      else setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadPreset = async file => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const preset = await loadSimulationPresetFromDrive(file.id);
      onApplyPreset(preset);
      setStatusMessage({
        type: 'success',
        text: `Applied preset "${file.name}" to the 3D Mars simulation.`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load preset.';
      if (msg === 'UNAUTHENTICATED') setNeedsAuth(true);
      else setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const executeConfirmedAction = async () => {
    if (!pendingConfirm) return;
    const { type, file } = pendingConfirm;
    setPendingConfirm(null);
    setIsSaving(true);
    setStatusMessage(null);

    try {
      if (type === 'delete') {
        await deleteFileFromDrive(file.id);
        setStatusMessage({
          type: 'success',
          text: `Deleted "${file.name}" from Google Drive.`,
        });
      } else if (type === 'overwrite') {
        await saveSimulationPresetToDrive(file.name, currentPreset, file.id);
        setStatusMessage({
          type: 'success',
          text: `Updated "${file.name}" with current simulation state.`,
        });
      }
      await fetchFiles(searchQuery);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      if (msg === 'UNAUTHENTICATED') setNeedsAuth(true);
      else setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-end bg-black/70 p-4 sm:p-6"
      role="dialog"
      aria-label="Google Drive Workspace Integration"
    >
      <div className="relative w-full max-w-md max-h-[88vh] flex flex-col bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl text-slate-200 text-xs overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-[#131c31]">
          <div className="flex items-center gap-2">
            <Cloud size={18} className="text-blue-400" />
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Google Drive Archive
              </h2>
              <p className="text-[11px] text-slate-400">
                Mars Snapshots &amp; Simulation Presets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Google Drive panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {statusMessage && (
            <div
              className={`flex items-start gap-2 p-2.5 rounded-lg border text-[11px] ${
                statusMessage.type === 'success'
                  ? 'bg-blue-950/60 border-blue-500/50 text-blue-200'
                  : 'bg-red-950/60 border-red-500/50 text-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-blue-400" />
              ) : (
                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-400" />
              )}
              <span className="flex-1 leading-relaxed">{statusMessage.text}</span>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
                aria-label="Dismiss status message"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {needsAuth ? (
            <div className="py-8 px-4 rounded-xl border border-slate-800 bg-[#131c31] text-center space-y-4">
              <div className="w-11 h-11 rounded-full bg-blue-600/15 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-400">
                <Cloud size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-slate-100 font-semibold text-sm">
                  Connect Google Drive
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                  Sign in with your Google account to save high-resolution 3D Mars
                  snapshots, back up orbital presets, and manage reconnaissance files in
                  your Google Drive.
                </p>
              </div>
              <div className="flex justify-center pt-1">
                <GoogleDriveSignInButton onClick={handleLogin} disabled={isLoggingIn} />
              </div>
            </div>
          ) : (
            <>
              {/* Signed-In User Bar */}
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#131c31] border border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-[10px]">
                      {(user?.email || 'G')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="truncate">
                    <div className="text-xs text-slate-200 font-medium truncate">
                      {user?.displayName || 'Google Drive Connected'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  title="Sign out of Google Drive"
                >
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Save / Upload Controls */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-[#131c31] space-y-2.5">
                <label className="block text-xs text-slate-300 font-medium">
                  File Prefix for New Capture / Preset:
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="Mars_Recon_Observation"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-red-500"
                />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleSaveSnapshot}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Camera size={14} />
                    <span>Save PNG Snapshot</span>
                  </button>
                  <button
                    onClick={handleSavePreset}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>Save JSON Preset</span>
                  </button>
                </div>
              </div>

              {/* Drive File Browser */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FolderOpen size={14} className="text-blue-400" />
                    <span>Your Google Drive Files</span>
                  </span>
                  <button
                    onClick={() => fetchFiles(searchQuery)}
                    disabled={isLoadingFiles}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw
                      size={12}
                      className={isLoadingFiles ? 'animate-spin text-blue-400' : ''}
                    />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Filter Drive files by name..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Files List */}
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {isLoadingFiles && files.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      Loading files from Google Drive...
                    </div>
                  ) : files.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                      No matching files found in your Google Drive.
                    </div>
                  ) : (
                    files.map(file => {
                      const isJson =
                        file.mimeType === 'application/json' ||
                        file.name.toLowerCase().endsWith('.json');
                      const isImage = file.mimeType.startsWith('image/');

                      return (
                        <div
                          key={file.id}
                          className="p-2.5 rounded-lg border border-slate-800 bg-[#131c31] hover:border-slate-700 transition-colors flex flex-col gap-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {isJson ? (
                                <FileJson size={15} className="text-red-400 shrink-0" />
                              ) : isImage ? (
                                <ImageIcon size={15} className="text-blue-400 shrink-0" />
                              ) : (
                                <FileText size={15} className="text-slate-400 shrink-0" />
                              )}
                              <div className="min-w-0">
                                <div
                                  className="text-slate-200 font-medium truncate text-xs"
                                  title={file.name}
                                >
                                  {file.name}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 truncate">
                                  {file.modifiedTime
                                    ? new Date(file.modifiedTime).toLocaleString()
                                    : file.mimeType}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                  title="Open in Google Drive"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                              <button
                                onClick={() => setPendingConfirm({ type: 'delete', file })}
                                className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Delete file from Google Drive"
                                aria-label={`Delete ${file.name}`}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          {isJson && (
                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800">
                              <button
                                onClick={() => handleLoadPreset(file)}
                                disabled={isSaving}
                                className="flex-1 py-1 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Upload size={11} />
                                <span>Load Preset</span>
                              </button>
                              <button
                                onClick={() => setPendingConfirm({ type: 'overwrite', file })}
                                disabled={isSaving}
                                className="py-1 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors cursor-pointer"
                                title="Overwrite this preset with current simulation settings"
                              >
                                Overwrite
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Explicit Confirmation Modal for Mutating / Destructive Actions */}
        {pendingConfirm && (
          <div
            className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-5"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="drive-confirm-title"
          >
            <div className="w-full max-w-xs rounded-xl bg-[#131c31] border border-slate-700 p-4 shadow-2xl space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-semibold text-xs">
                <AlertTriangle size={16} />
                <span id="drive-confirm-title">
                  {pendingConfirm.type === 'delete'
                    ? 'Delete File from Google Drive?'
                    : 'Overwrite Preset in Google Drive?'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pendingConfirm.type === 'delete' ? (
                  <>
                    Are you sure you want to permanently delete{' '}
                    <span className="text-white font-semibold">
                      &ldquo;{pendingConfirm.file.name}&rdquo;
                    </span>{' '}
                    from your Google Drive? This action cannot be undone.
                  </>
                ) : (
                  <>
                    Are you sure you want to overwrite the contents of{' '}
                    <span className="text-white font-semibold">
                      &ldquo;{pendingConfirm.file.name}&rdquo;
                    </span>{' '}
                    with your current 3D Mars simulation settings?
                  </>
                )}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setPendingConfirm(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={executeConfirmedAction}
                  className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
                >
                  {pendingConfirm.type === 'delete' ? 'Confirm Delete' : 'Confirm Overwrite'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
