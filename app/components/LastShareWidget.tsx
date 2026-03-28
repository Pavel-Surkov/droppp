'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AppMessages, Locale } from '@/i18n/messages';
import {
  clearLastShareCookie,
  readLastShareCookie,
  type LastShareCookieData,
} from '@/utils/last-share-cookie';

type LastShareWidgetProps = {
  locale: Locale;
  messages: AppMessages['lastShare'];
};

function formatDate(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function LastShareWidget({ locale, messages }: LastShareWidgetProps) {
  const [share, setShare] = useState<LastShareCookieData | null>(null);
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let expiryTimeout: number | undefined;

    const hydrate = async () => {
      const saved = readLastShareCookie();
      if (!saved) return;

      const expiresAtMs = new Date(saved.expiresAt).getTime();
      if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
        clearLastShareCookie();
        return;
      }

      try {
        const response = await fetch(`/api/shares/${saved.code}`, {
          cache: 'no-store',
        });

        if (response.status === 404 || response.status === 410) {
          clearLastShareCookie();
          if (!cancelled) setShare(null);
          return;
        }

        if (!response.ok) return;
      } catch {
        return;
      }

      if (cancelled) return;
      setShare(saved);
      setIsDesktopOpen(true);

      const ttlMs = expiresAtMs - Date.now();
      if (ttlMs <= 0) {
        clearLastShareCookie();
        setShare(null);
        return;
      }

      expiryTimeout = window.setTimeout(() => {
        clearLastShareCookie();
        setShare(null);
      }, ttlMs);
    };

    void hydrate();

    return () => {
      cancelled = true;
      if (expiryTimeout) window.clearTimeout(expiryTimeout);
    };
  }, []);

  const maskedPin = useMemo(() => {
    if (!share) return '';
    return '•'.repeat(share.pin.length);
  }, [share]);

  const onCopyLink = async () => {
    if (!share) return;

    try {
      await navigator.clipboard.writeText(share.link);
      setInfoMessage(messages.copied);
    } catch {
      setInfoMessage(messages.copyFailed);
    }
  };

  if (!share) return null;

  return (
    <>
      {!isDesktopOpen ? (
        <button
          aria-label={messages.title}
          className="hidden md:fixed md:right-4 md:bottom-4 md:z-40 md:flex md:h-13 md:w-13 md:cursor-pointer md:items-center md:justify-center md:rounded-full md:border-2 md:border-(--line) md:bg-(--accent) md:text-white md:shadow-[0_14px_30px_rgba(0,0,0,0.25)]"
          onClick={() => setIsDesktopOpen(true)}
          type="button"
        >
          <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      ) : null}

      <section
        className={`mt-4 w-full rounded-2xl border-2 border-(--line) bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] md:mt-0 md:fixed md:right-4 md:bottom-4 md:z-40 md:w-[min(22rem,calc(100vw-2rem))] ${
          isDesktopOpen ? 'md:block' : 'md:hidden'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-(--ink)">{messages.title}</p>
            <p className="mt-2 text-xs text-(--muted)">
              {messages.expiresLabel}: {formatDate(share.expiresAt, locale)}
            </p>
          </div>
          <button
            aria-label="Hide widget"
            className="hidden cursor-pointer rounded-md p-1 text-(--muted) transition hover:bg-(--highlight) hover:text-(--accent) md:block"
            onClick={() => setIsDesktopOpen(false)}
            type="button"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-(--line) bg-white p-2 text-xs font-semibold text-(--ink)">
          <p className="truncate">{share.link}</p>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-(--line) bg-white px-3 py-2">
          <span className="font-mono text-sm font-bold tracking-[0.18em] text-(--ink)">
            {isPinVisible ? share.pin : maskedPin}
          </span>
          <button
            aria-label={isPinVisible ? messages.hidePin : messages.showPin}
            className="cursor-pointer rounded-md p-1 text-(--muted) transition hover:bg-(--highlight) hover:text-(--accent)"
            onClick={() => setIsPinVisible((prev) => !prev)}
            type="button"
          >
            {isPinVisible ? (
              <svg aria-hidden="true" className="block h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M3 3l18 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg aria-hidden="true" className="block h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            className="w-full cursor-pointer rounded-xl border border-(--line) bg-white px-3 py-2 text-sm font-bold text-(--ink) transition hover:bg-(--highlight)"
            onClick={onCopyLink}
            type="button"
          >
            {messages.copyButton}
          </button>
          <a
            className="inline-flex cursor-pointer items-center rounded-xl bg-(--accent) px-3 py-2 text-sm font-bold text-white"
            href={share.link}
            rel="noreferrer"
            target="_blank"
          >
            {messages.openLink}
          </a>
        </div>

        {infoMessage ? (
          <p className="mt-2 text-xs font-semibold text-(--muted)">{infoMessage}</p>
        ) : null}
      </section>
    </>
  );
}
