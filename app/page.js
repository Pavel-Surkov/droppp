'use client';

import { useRef, useState } from 'react';

const MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024;

function buildFileId(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export default function HomePage() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [limitError, setLimitError] = useState('');

  const addFiles = (incomingFiles) => {
    const nextFiles = Array.from(incomingFiles || []);
    if (!nextFiles.length) return;
    const oversized = nextFiles.filter(
      (file) => file.size > MAX_FILE_SIZE_BYTES
    );
    const accepted = nextFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE_BYTES
    );

    if (oversized.length) {
      setLimitError(
        `${oversized.length} file(s) skipped: max size is ${formatBytes(MAX_FILE_SIZE_BYTES)} per file.`
      );
    } else {
      setLimitError('');
    }

    setFiles((prev) => {
      const merged = [...prev];
      const ids = new Set(prev.map((file) => buildFileId(file)));

      for (const file of accepted) {
        const id = buildFileId(file);
        if (!ids.has(id)) {
          merged.push(file);
          ids.add(id);
        }
      }

      return merged;
    });
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => buildFileId(file) !== id));
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onInputChange = (event) => {
    addFiles(event.target.files);
    event.target.value = '';
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10 md:px-10">
      <section className="grid w-full gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_18px_48px_rgba(38,65,48,0.12)] md:p-9">
          <p className="mb-5 inline-flex rounded-full bg-[#d9ebe0] px-3 py-1 text-xs font-bold tracking-wide text-[var(--muted)]">
            No USB needed
          </p>
          <h1
            className="text-4xl leading-tight font-bold md:text-6xl"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Send your file,
            <br />
            carry just a tiny
            <br />
            link.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Perfect for class presentations: upload from home, open from any
            university computer. Set file lifetime from 1 hour to 24 hours and
            optionally protect access with a 4-digit PIN.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="cursor-pointer rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              onClick={openFilePicker}
              type="button"
            >
              Start upload
            </button>
            <button className="cursor-pointer rounded-2xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-bold text-[var(--ink)]">
              Open link
            </button>
          </div>
        </article>

        <aside className="grid gap-4 [grid-template-rows:1fr_2fr]">
          <div
            className={`rounded-[1.6rem] border border-dashed bg-white p-5 transition-colors ${
              isDragging
                ? 'border-[var(--accent)] bg-[#fff2ed]'
                : 'border-[var(--line)]'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              className="hidden"
              multiple
              onChange={onInputChange}
              ref={fileInputRef}
              type="file"
            />
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
              Upload files
            </p>
            <p className="mt-2 text-sm text-(--muted)">
              Drag and drop files here, or{' '}
              <button
                className="cursor-pointer font-bold text-(--accent) underline"
                onClick={openFilePicker}
                type="button"
              >
                choose files
              </button>
              .
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Max size: {formatBytes(MAX_FILE_SIZE_BYTES)} per file.
            </p>
            {limitError ? (
              <p className="mt-2 text-xs font-bold text-[var(--accent)]">
                {limitError}
              </p>
            ) : null}
          </div>

          <div className="rounded-[1.6rem] border border-[var(--line)] bg-[#edf5ec] p-5 text-sm text-[var(--muted)]">
            <p className="font-bold text-[var(--ink)]">Selected files</p>
            {!files.length ? (
              <p className="mt-2">No files selected yet.</p>
            ) : (
              <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                {files.map((file) => {
                  const id = buildFileId(file);

                  return (
                    <li
                      className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white px-3 py-2"
                      key={id}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0 text-[var(--accent-2)]"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8 3h6l4 4v14H8z"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                          />
                          <path
                            d="M14 3v4h4"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                          />
                        </svg>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-[var(--ink)]">
                            {file.name}
                          </p>
                          <p className="text-xs">{formatBytes(file.size)}</p>
                        </div>
                      </div>
                      <button
                        aria-label={`Remove ${file.name}`}
                        className="cursor-pointer rounded-md p-1 text-[var(--muted)] hover:bg-[#f6dfd8] hover:text-[var(--accent)]"
                        onClick={() => removeFile(id)}
                        type="button"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M6 6l12 12M18 6L6 18"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
