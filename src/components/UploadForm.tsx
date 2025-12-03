import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { uploadImage } from '../api';

type UploadFormProps = {
  isLoading: boolean;
  onUploadStart: () => void;
  onUploadSuccess: (svg: string) => void;
  onUploadError: (message: string) => void;
};

export function UploadForm({ isLoading, onUploadStart, onUploadSuccess, onUploadError }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectionLabel, setSelectionLabel] = useState('No file chosen');
  const [clipboardStatus, setClipboardStatus] = useState<{ message: string; tone: 'info' | 'error' } | null>(null);
  const clipboardTimeout = useRef<number | undefined>(undefined);

  const assignFile = (nextFile: File | null, label?: string) => {
    setFile(nextFile);
    setSelectionLabel(label ?? (nextFile ? nextFile.name : 'No file chosen'));
  };

  const showClipboardStatus = (message: string, tone: 'info' | 'error' = 'info') => {
    setClipboardStatus({ message, tone });
    if (clipboardTimeout.current !== undefined) {
      window.clearTimeout(clipboardTimeout.current);
    }
    clipboardTimeout.current = window.setTimeout(() => setClipboardStatus(null), 3000);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    assignFile(nextFile);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      onUploadError('Please choose a PNG or JPEG file.');
      return;
    }

    try {
      onUploadStart();
      const svg = await uploadImage(file);
      onUploadSuccess(svg);
    } catch (err) {
      console.error(err);
      onUploadError(err instanceof Error ? err.message : 'Failed to convert image');
    }
  };

  const normalizeClipboardFile = (pastedFile: File) => {
    const extension = pastedFile.type.includes('png') ? 'png' : pastedFile.type.includes('jpeg') ? 'jpg' : 'img';
    return 'name' in pastedFile && pastedFile.name
      ? pastedFile
      : new File([pastedFile], `clipboard-${Date.now()}.${extension}`, { type: pastedFile.type });
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = Array.from(event.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith('image/'));
      if (!imageItem) {
        showClipboardStatus('Clipboard does not contain an image.', 'error');
        return;
      }

      const pastedFile = imageItem.getAsFile();
      if (!pastedFile) {
        showClipboardStatus('Unable to read clipboard image.', 'error');
        return;
      }

      const normalizedFile = normalizeClipboardFile(pastedFile);
      assignFile(normalizedFile, `Clipboard: ${normalizedFile.name}`);
      showClipboardStatus('Image added from clipboard.');
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
      if (clipboardTimeout.current !== undefined) {
        window.clearTimeout(clipboardTimeout.current);
      }
    };
  }, []);

  const handlePasteButton = async () => {
    if (!navigator.clipboard || typeof navigator.clipboard.read !== 'function') {
      showClipboardStatus('Clipboard access is not supported in this browser.', 'error');
      return;
    }

    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((mime) => mime.startsWith('image/'));
        if (!type) continue;
        const blob = await item.getType(type);
        const normalizedFile = normalizeClipboardFile(new File([blob], `clipboard-${Date.now()}.${type.split('/')[1] || 'png'}`, { type }));
        assignFile(normalizedFile, `Clipboard: ${normalizedFile.name}`);
        showClipboardStatus('Image added from clipboard.');
        return;
      }
      showClipboardStatus('Clipboard does not contain an image.', 'error');
    } catch (err) {
      console.error(err);
      onUploadError('Unable to read from clipboard. Allow permissions and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/60 rounded-xl p-6 shadow-lg space-y-4 border border-slate-800">
      <div>
        <label htmlFor="file-upload" className="block text-sm font-semibold uppercase tracking-wide text-slate-400">
          Raster logo
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-brand-500"
          disabled={isLoading}
        />
        <div className="mt-3">
          <button
            type="button"
            onClick={handlePasteButton}
            disabled={isLoading}
            className="rounded-md border border-slate-700 px-3 py-1 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Paste from clipboard
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {selectionLabel} · Tip: press <kbd className="rounded bg-slate-800 px-1 text-[10px]">Ctrl/Cmd + V</kbd> anywhere to paste an image from the clipboard.
        </p>
        {clipboardStatus && (
          <p
            className={`text-xs mt-1 ${
              clipboardStatus.tone === 'error' ? 'text-red-300' : 'text-brand-500'
            }`}
            aria-live="polite"
          >
            {clipboardStatus.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 font-semibold text-slate-950 transition hover:bg-brand-500"
      >
        {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" aria-hidden="true" />}
        Convert to SVG
      </button>

      <p className="text-xs text-slate-500">
        PNG or JPEG up to a few megabytes works best. Images are traced using Potrace and never stored permanently.
      </p>
    </form>
  );
}
