import { buildFileId, formatBytes } from '@/utils/files';

type SelectedFilesPanelProps = {
  files: File[];
  onRemoveFile: (id: string) => void;
};

export function SelectedFilesPanel({
  files,
  onRemoveFile,
}: SelectedFilesPanelProps) {
  return (
    <div className="rounded-[1.6rem] border border-(--line) bg-[#edf5ec] p-5 text-sm text-(--muted)">
      <p className="font-bold text-(--ink)">Selected files</p>
      {!files.length ? (
        <p className="mt-2">No files selected yet.</p>
      ) : (
        <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
          {files.map((file) => {
            const id = buildFileId(file);

            return (
              <li
                className="flex items-center justify-between rounded-xl border border-(--line) bg-white px-3 py-2"
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
                  aria-label={`Remove ${file.name}`}
                  className="cursor-pointer rounded-md p-1 text-(--muted) hover:bg-[#f6dfd8] hover:text-(--accent)"
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
    </div>
  );
}
