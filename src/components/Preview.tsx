import { useEffect, useMemo, useRef, useState } from 'react';

type PreviewProps = {
  svgMarkup: string;
};

export function Preview({ svgMarkup }: PreviewProps) {
  const hasSvg = svgMarkup.trim().length > 0;
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<number | undefined>(undefined);

  const download = () => {
    if (!hasSvg) return;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'trace.svg';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const previewContent = useMemo(() => ({ __html: svgMarkup }), [svgMarkup]);

  const copyToClipboard = async () => {
    if (!hasSvg) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(svgMarkup);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = svgMarkup;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      if (copyTimeout.current !== undefined) {
        window.clearTimeout(copyTimeout.current);
      }
      copyTimeout.current = window.setTimeout(() => setCopied(false), 2000);
      setCopied(true);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeout.current !== undefined) {
        window.clearTimeout(copyTimeout.current);
      }
    };
  }, []);

  return (
    <div className="bg-slate-900/60 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Preview</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyToClipboard}
            disabled={!hasSvg}
            className="rounded-md bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? 'Copied' : 'Copy SVG'}
          </button>
          <button
            type="button"
            onClick={download}
            disabled={!hasSvg}
            className="rounded-md bg-brand-600 px-3 py-1 text-sm font-semibold text-slate-950 transition hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Download SVG
          </button>
        </div>
      </div>

      <div className="min-h-[300px] rounded-lg border border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-auto">
        {hasSvg ? (
          <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={previewContent} />
        ) : (
          <p className="text-sm text-slate-500 text-center max-w-xs">
            Converted SVG will appear here. Upload your raster logo to start.
          </p>
        )}
      </div>
    </div>
  );
}
