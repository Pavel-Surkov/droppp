import { PinInput } from '@/app/components/PinInput';

type UploadPinModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  pinValue: string;
  onClose: () => void;
  onPinChange: (value: string) => void;
  onContinue: () => Promise<void>;
};

export function UploadPinModal({
  isOpen,
  isSubmitting,
  pinValue,
  onClose,
  onPinChange,
  onContinue,
}: UploadPinModalProps) {
  if (!isOpen) return null;
  const isPinComplete = /^\d{4}$/.test(pinValue);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-shadow-grey-950)/60 px-4">
      <form
        className="w-full max-w-md rounded-2xl border-2 border-(--line) bg-(--card) p-6 shadow-[0_14px_40px_rgba(0,0,0,0.32)]"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!isPinComplete) return;
          await onContinue();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-(--ink)">Enter a PIN</h2>
            <p className="mt-2 text-sm leading-relaxed text-(--muted)">
              The recipient will need to enter this PIN to access the files.
            </p>
          </div>
          <button
            aria-label="Close PIN modal"
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

        <PinInput onChange={onPinChange} value={pinValue} />
        <p className="mt-3 text-center text-xs text-(--muted)">
          Save this PIN somewhere safe. You will need it to share file access.
        </p>
        <button
          className="mt-5 w-full cursor-pointer rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isPinComplete || isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Uploading...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
