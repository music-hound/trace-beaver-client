import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { UploadForm } from './components/UploadForm';
import { Preview } from './components/Preview';
import './styles.css';

function App() {
  const [svgMarkup, setSvgMarkup] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Drop a raster logo to convert it into resolution-independent SVG.');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const handleUploadStart = () => {
    setIsLoading(true);
    setStatus('idle');
    setMessage('Tracing with Potrace...');
  };

  const handleUploadSuccess = (svg: string) => {
    setSvgMarkup(svg);
    setIsLoading(false);
    setStatus('success');
    setMessage('Done! Preview updated below.');
  };

  const handleUploadError = (errorMessage: string) => {
    setIsLoading(false);
    setStatus('error');
    setMessage(errorMessage);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-500">Trace Beaver</p>
        <h1 className="text-3xl font-semibold text-white">PNG to SVG</h1>
        <p className={`text-sm ${status === 'error' ? 'text-red-300' : 'text-slate-400'}`}>{message}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <UploadForm
          isLoading={isLoading}
          onUploadStart={handleUploadStart}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
        <Preview svgMarkup={svgMarkup} />
      </section>
    </main>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root container missing in index.html');
}

type WindowWithRoot = Window & { __TRACE_BEAVER_ROOT__?: ReactDOM.Root };

const browserWindow = window as WindowWithRoot;
let root = browserWindow.__TRACE_BEAVER_ROOT__;

if (!root) {
  root = ReactDOM.createRoot(rootElement);
  browserWindow.__TRACE_BEAVER_ROOT__ = root;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
