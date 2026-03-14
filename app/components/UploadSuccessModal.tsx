import { useState } from 'react';
import type { AppMessages } from '@/i18n/messages';

type UploadSuccessModalProps = {
  messages: AppMessages['successModal'];
  isOpen: boolean;
  shareLink: string;
  onClose: () => void;
};

export function UploadSuccessModal({
  messages,
  isOpen,
  shareLink,
  onClose,
}: UploadSuccessModalProps) {
  const [infoMessage, setInfoMessage] = useState('');

  if (!isOpen) return null;

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setInfoMessage(messages.copied);
    } catch {
      setInfoMessage(messages.copyFailed);
    }
  };

  const onShareLink = async () => {
    if (!('share' in navigator)) {
      setInfoMessage(messages.shareNotSupported);
      return;
    }

    try {
      await navigator.share({
        title: messages.shareTitle,
        text: messages.shareText,
        url: shareLink,
      });
      setInfoMessage(messages.shareOpened);
    } catch {
      setInfoMessage(messages.shareCancelled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-shadow-grey-950)/60 px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-(--line) bg-(--card) p-6 shadow-[0_14px_40px_rgba(0,0,0,0.32)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-(--ink)">
              {messages.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-(--muted)">
              {messages.description}
            </p>
          </div>
          <button
            aria-label={messages.closeAria}
            className="cursor-pointer rounded-md p-1 text-(--muted) hover:bg-(--highlight) hover:text-(--accent)"
            onClick={onClose}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
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
        </div>

        <div className="mt-4 rounded-xl border border-(--line) bg-white p-3 text-sm font-semibold text-(--ink)">
          {shareLink}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="cursor-pointer rounded-xl border border-(--line) bg-white px-4 py-2.5 text-sm font-bold text-(--ink)"
            onClick={onCopyLink}
            type="button"
          >
            {messages.copyButton}
          </button>
          <button
            className="cursor-pointer rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-bold text-white"
            onClick={onShareLink}
            type="button"
          >
            {messages.shareButton}
          </button>
        </div>

        {infoMessage ? (
          <p className="mt-3 text-xs font-semibold text-(--muted)">{infoMessage}</p>
        ) : null}
      </div>
    </div>
  );
}
