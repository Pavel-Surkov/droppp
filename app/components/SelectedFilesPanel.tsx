import { buildFileId, formatBytes } from '@/utils/files';
import type { AppMessages } from '@/i18n/messages';

type SelectedFilesPanelProps = {
  messages: AppMessages['selectedPanel'];
  files: File[];
  onRemoveFile: (id: string) => void;
  onUploadFiles: () => void;
};

export function SelectedFilesPanel({
  messages,
  files,
  onRemoveFile,
  onUploadFiles,
}: SelectedFilesPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-[1.6rem] bg-white p-5 text-sm text-(--muted)">
      <p className="font-bold text-(--ink)">{messages.title}</p>
      {!files.length ? (
        <p className="mt-2 mb-auto">{messages.empty}</p>
      ) : (
        <ul className="mt-3 mb-auto max-h-56 space-y-2 overflow-y-auto pr-1">
          {files.map((file) => {
            const id = buildFileId(file);

            return (
              <li
                className="flex items-center justify-between rounded-xl border border-(--line) px-3 py-2"
                key={id}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-(--accent-2)"
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
                    <p className="truncate font-bold text-(--ink)">
                      {file.name}
                    </p>
                    <p className="text-xs">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <button
                  aria-label={`${messages.removeFileAria}: ${file.name}`}
                  className="cursor-pointer rounded-md p-1 text-(--muted) hover:bg-(--highlight) hover:text-(--accent)"
                  onClick={() => onRemoveFile(id)}
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
      {files.length > 0 ? (
        <button
          className="mt-4 w-full cursor-pointer rounded-xl bg-(--accent) px-4 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          onClick={onUploadFiles}
          type="button"
        >
          {messages.uploadButton}
        </button>
      ) : null}
    </div>
  );
}
