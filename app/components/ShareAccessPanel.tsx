'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AppMessages, Locale } from '@/i18n/messages';
import { formatBytes } from '@/utils/files';
import { PinInput } from '@/app/components/PinInput';

type SharedFile = {
  index: number;
  name: string;
  mimeType: string;
  size: number;
};

type SharePayload = {
  code: string;
  createdAt: string;
  expiresAt: string;
  files: SharedFile[];
};

type ShareStatus = 'loading' | 'ready' | 'not_found' | 'expired' | 'error';

type ShareAccessPanelProps = {
  code: string;
  locale: Locale;
  messages: AppMessages['receiver'];
};

function formatDate(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function ShareAccessPanel({ code, locale, messages }: ShareAccessPanelProps) {
  const [status, setStatus] = useState<ShareStatus>('loading');
  const [share, setShare] = useState<SharePayload | null>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [pinValue, setPinValue] = useState('');
  const [token, setToken] = useState('');
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadShare = async () => {
      setStatus('loading');
      setErrorMessage('');

      try {
        const response = await fetch(`/api/shares/${code}`, { cache: 'no-store' });
        const payload = (await response.json()) as SharePayload | { message?: string };

        if (!response.ok) {
          if (response.status === 404) {
            if (!cancelled) setStatus('not_found');
            return;
          }
          if (response.status === 410) {
            if (!cancelled) setStatus('expired');
            return;
          }
          throw new Error('Failed to load share');
        }

        if (!cancelled) {
          setShare(payload as SharePayload);
          setSelectedIndexes((payload as SharePayload).files.map((file) => file.index));
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    void loadShare();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const selectedFiles = useMemo(() => {
    if (!share) return [];
    const selected = new Set(selectedIndexes);
    return share.files.filter((file) => selected.has(file.index));
  }, [selectedIndexes, share]);

  const toggleSelected = (index: number) => {
    setSelectedIndexes((prev) => {
      if (prev.includes(index)) return prev.filter((item) => item !== index);
      return [...prev, index];
    });
  };

  const onVerifyPin = async () => {
    if (!share) return;
    if (selectedIndexes.length === 0) {
      setErrorMessage(messages.selectAtLeastOne);
      return;
    }
    if (!/^\d{4}$/.test(pinValue)) return;

    setIsCheckingPin(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/shares/${share.code}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pin: pinValue }),
      });
      const payload = (await response.json()) as { token?: string; message?: string };

      if (!response.ok || !payload.token) {
        throw new Error(payload.message ?? messages.pinInvalid);
      }

      setToken(payload.token);
      setPinValue('');
    } catch {
      setErrorMessage(messages.pinInvalid);
    } finally {
      setIsCheckingPin(false);
    }
  };

  const downloadSelected = () => {
    if (!share || !token || selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      const link = document.createElement('a');
      link.href = `/api/shares/${share.code}/files/${file.index}?token=${encodeURIComponent(token)}`;
      link.download = file.name;
      document.body.append(link);
      link.click();
      link.remove();
    }
  };

  if (status === 'loading') {
    return (
      <section className="rounded-[1.6rem] border-2 border-(--line) bg-white p-6 text-(--ink)">
        {messages.loading}
      </section>
    );
  }

  if (status === 'not_found' || status === 'expired' || status === 'error' || !share) {
    const title =
      status === 'expired' ? messages.expiredTitle : messages.notFoundTitle;
    const description =
      status === 'expired' ? messages.expiredDescription : messages.notFoundDescription;

    return (
      <section className="rounded-[1.6rem] border-2 border-(--line) bg-white p-6 text-(--ink)">
        <h1 className="font-['Fraunces'] text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-(--muted)">{description}</p>
        <a
          className="mt-5 inline-flex cursor-pointer rounded-xl bg-(--accent) px-4 py-2 font-bold text-white"
          href={`/?lang=${locale}`}
        >
          {messages.backHome}
        </a>
      </section>
    );
  }

  return (
    <section className="rounded-[1.6rem] border-2 border-(--line) bg-white p-6">
      <h1 className="font-['Fraunces'] text-3xl font-bold text-(--ink)">
        {messages.title}
      </h1>
      <p className="mt-2 text-(--muted)">{messages.description}</p>

      <div className="mt-4 grid gap-2 text-sm text-(--muted)">
        <p>
          <span className="font-bold text-(--ink)">{messages.codeLabel}:</span>{' '}
          {share.code}
        </p>
        <p>
          <span className="font-bold text-(--ink)">{messages.expiresLabel}:</span>{' '}
          {formatDate(share.expiresAt, locale)}
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-(--line) bg-(--card) p-4">
        <p className="font-bold text-(--ink)">{messages.filesTitle}</p>
        <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
          {share.files.map((file) => (
            <li
              className="flex items-center justify-between rounded-lg border border-(--line) bg-white px-3 py-2"
              key={file.index}
            >
              <label className="flex min-w-0 cursor-pointer items-center gap-3">
                <input
                  checked={selectedIndexes.includes(file.index)}
                  className="h-4 w-4 cursor-pointer accent-(--accent)"
                  onChange={() => toggleSelected(file.index)}
                  type="checkbox"
                />
                <span className="min-w-0">
                  <span className="block truncate font-bold text-(--ink)">
                    {file.name}
                  </span>
                  <span className="text-xs text-(--muted)">
                    {formatBytes(file.size)}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {!token ? (
        <form
          className="mt-5 rounded-xl border border-(--line) bg-(--card) p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void onVerifyPin();
          }}
        >
          <p className="font-bold text-(--ink)">{messages.pinTitle}</p>
          <p className="mt-1 text-sm text-(--muted)">{messages.pinDescription}</p>
          <PinInput onChange={setPinValue} value={pinValue} />

          {errorMessage ? (
            <p className="mt-3 text-sm text-(--accent)">{errorMessage}</p>
          ) : null}

          <button
            className="mt-4 w-full cursor-pointer rounded-xl bg-(--accent) px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!/^\d{4}$/.test(pinValue) || isCheckingPin}
            type="submit"
          >
            {isCheckingPin ? messages.checkingButton : messages.continueButton}
          </button>
        </form>
      ) : (
        <div className="mt-5 rounded-xl border border-(--line) bg-(--card) p-4">
          <p className="font-bold text-(--ink)">{messages.readyTitle}</p>
          <p className="mt-1 text-sm text-(--muted)">{messages.readyDescription}</p>
          <button
            className="mt-4 w-full cursor-pointer rounded-xl bg-(--accent) px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={selectedFiles.length === 0}
            onClick={downloadSelected}
            type="button"
          >
            {messages.downloadSelected}
          </button>
        </div>
      )}
    </section>
  );
}
