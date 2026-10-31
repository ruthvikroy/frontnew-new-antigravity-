import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
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
  Upload,
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
} from '../services/googleDrive.js';

export const GoogleDriveSignInButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 rounded border border-[var(--line)] bg-[var(--chip)] hover:border-[var(--accent)] text-[var(--accent)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
    aria-label="Sign in with Google"
  >
    <Cloud size={16} className="text-[var(--accent)]" />
    <span>{disabled ? 'Connecting...' : 'Sign in with Google'}</span>
  </button>
);

export function GoogleDrivePanel({
  isOpen,
  onClose,
  currentPreset,
  onApplyPreset,
  onCaptureCanvasDataUrl,
}) {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('Celestial_Observation');
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
      (authedUser) => {
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
    const dataUrl = onCaptureCanvasDataUrl ? onCaptureCanvasDataUrl() : null;
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
      const baseName = customName.trim() || 'Celestial_Snapshot';
      const filename = `${baseName}_${timestamp}.png`;
      const desc = `Celestial Snapshot | Moon & Earth Experience`;
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
      const baseName = customName.trim() || 'Celestial_Preset';
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

  const handleLoadPreset = async (file) => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const preset = await loadSimulationPresetFromDrive(file.id);
      if (onApplyPreset) onApplyPreset(preset);
      setStatusMessage({
        type: 'success',
        text: `Applied preset "${file.name}" to simulation.`,
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
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-label="Google Drive Archive"
    >
      <div className="relative w-full max-w-md max-h-[88vh] flex flex-col bg-[#000000] border border-[var(--line)] rounded shadow-2xl text-[var(--text)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--line)] bg-[var(--chip)]">
          <div className="flex items-center gap-2">
            <Cloud size={16} className="text-[var(--accent)]" />
            <div>
              <h2 className="font-bold text-[var(--accent)] tracking-tight">
                Google Drive Archive
              </h2>
              <p className="text-[var(--muted)]">
                Snapshots &amp; Simulation Presets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--text)] hover:bg-black transition-colors"
            aria-label="Close Google Drive panel"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {statusMessage && (
            <div
              className={`flex items-start gap-2 p-2.5 rounded border ${
                statusMessage.type === 'success'
                  ? 'bg-black border-[var(--accent)] text-[var(--accent)]'
                  : 'bg-black border-red-500/50 text-red-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-[var(--accent)]" />
              ) : (
                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-400" />
              )}
              <span className="flex-1 leading-relaxed">{statusMessage.text}</span>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
                aria-label="Dismiss status message"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {needsAuth ? (
            <div className="py-8 px-4 rounded border border-[var(--line)] bg-[var(--chip)] text-center space-y-4">
              <div className="w-10 h-10 rounded border border-[var(--line)] bg-black flex items-center justify-center mx-auto text-[var(--accent)]">
                <Cloud size={20} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-[var(--accent)]">
                  Connect Google Drive
                </h3>
                <p className="text-[var(--muted)] leading-relaxed max-w-xs mx-auto">
                  Sign in with Google to save 3D celestial snapshots and simulation presets to your personal Drive.
                </p>
              </div>
              <div className="flex justify-center pt-1">
                <GoogleDriveSignInButton onClick={handleLogin} disabled={isLoggingIn} />
              </div>
            </div>
          ) : (
            <>
              {/* Signed-in user banner */}
              <div className="flex items-center justify-between px-3 py-2 rounded bg-[var(--chip)] border border-[var(--line)]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded bg-black text-[var(--accent)] flex items-center justify-center font-bold">
                    {(user?.email || 'G')[0].toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-[var(--text)] font-medium truncate">
                      {user?.displayName || 'Google Drive Connected'}
                    </div>
                    <div className="text-[var(--muted)] truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-black transition-colors shrink-0"
                >
                  <LogOut size={11} />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Actions: Save snapshot & preset */}
              <div className="p-3 rounded border border-[var(--line)] bg-[var(--chip)] space-y-2.5">
                <label className="block text-[var(--muted)] font-medium">
                  File Prefix:
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Celestial_Observation"
                  className="w-full px-2.5 py-1.5 rounded bg-black border border-[var(--line)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleSaveSnapshot}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-black hover:bg-[var(--line)] border border-[var(--line)] hover:border-[var(--accent)] text-[var(--accent)] font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Camera size={13} />
                    <span>Save PNG Snapshot</span>
                  </button>
                  <button
                    onClick={handleSavePreset}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-black hover:bg-[var(--line)] border border-[var(--line)] hover:border-[var(--accent)] text-[var(--accent)] font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={13} />
                    <span>Save JSON Preset</span>
                  </button>
                </div>
              </div>

              {/* File list */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--accent)] flex items-center gap-1.5">
                    <FolderOpen size={13} className="text-[var(--accent)]" />
                    <span>Your Drive Files</span>
                  </span>
                  <button
                    onClick={() => fetchFiles(searchQuery)}
                    disabled={isLoadingFiles}
                    className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-black transition-colors cursor-pointer"
                  >
                    <RefreshCw size={11} className={isLoadingFiles ? 'animate-spin text-[var(--accent)]' : ''} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Drive files..."
                    className="w-full pl-8 pr-3 py-1.5 rounded bg-black border border-[var(--line)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {isLoadingFiles && files.length === 0 ? (
                    <div className="py-6 text-center text-[var(--muted)]">
                      Loading files...
                    </div>
                  ) : files.length === 0 ? (
                    <div className="py-6 text-center text-[var(--muted)] border border-dashed border-[var(--line)] rounded">
                      No matching files found.
                    </div>
                  ) : (
                    files.map((file) => {
                      const isJson = file.name.endsWith('.json');
                      const isImage = file.mimeType.startsWith('image/');
                      return (
                        <div
                          key={file.id}
                          className="p-2.5 rounded border border-[var(--line)] bg-[var(--chip)] flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {isJson ? (
                                <FileJson size={14} className="text-[var(--accent)] shrink-0" />
                              ) : isImage ? (
                                <ImageIcon size={14} className="text-[var(--accent)] shrink-0" />
                              ) : (
                                <FileText size={14} className="text-[var(--muted)] shrink-0" />
                              )}
                              <span className="truncate text-[var(--text)]" title={file.name}>
                                {file.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--accent)]"
                                  title="Open in Drive"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                              <button
                                onClick={() => setPendingConfirm({ type: 'delete', file })}
                                className="p-1 rounded text-[var(--muted)] hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          {isJson && (
                            <button
                              onClick={() => handleLoadPreset(file)}
                              disabled={isSaving}
                              className="py-1 px-2 rounded bg-black hover:bg-[var(--line)] border border-[var(--line)] hover:border-[var(--accent)] text-[var(--accent)] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Upload size={11} />
                              <span>Apply Preset to Scene</span>
                            </button>
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

        {/* Delete Confirmation */}
        {pendingConfirm && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-5">
            <div className="w-full max-w-xs rounded bg-[var(--chip)] border border-[var(--line)] p-4 shadow-2xl space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <AlertTriangle size={16} />
                <span>Delete File?</span>
              </div>
              <p className="text-[var(--text)]">
                Are you sure you want to permanently delete "{pendingConfirm.file.name}"?
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setPendingConfirm(null)}
                  className="px-3 py-1.5 rounded border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                >
                  Cancel
                </button>
                <button
                  onClick={executeConfirmedAction}
                  className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-semibold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
