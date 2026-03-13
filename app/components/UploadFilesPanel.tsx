import type { ChangeEvent, DragEvent, RefObject } from 'react';

type UploadFilesPanelProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  limitError: string;
  maxFileSizeLabel: string;
  maxFilesCount: number;
  onFileInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenFilePicker: () => void;
  onDropZoneDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDropZoneDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDropZoneDrop: (event: DragEvent<HTMLDivElement>) => void;
};

export function UploadFilesPanel({
  fileInputRef,
  isDragging,
  limitError,
  maxFileSizeLabel,
  maxFilesCount,
  onFileInputChange,
  onOpenFilePicker,
  onDropZoneDragOver,
  onDropZoneDragLeave,
  onDropZoneDrop,
}: UploadFilesPanelProps) {
  return (
    <div
      className={`rounded-[1.6rem] border-2 border-dashed border-(--line) p-5 transition-[background-color] duration-200 ${
        isDragging ? 'bg-(--line)' : 'bg-white'
      }`}
      onDragOver={onDropZoneDragOver}
      onDragLeave={onDropZoneDragLeave}
      onDrop={onDropZoneDrop}
    >
      <input
        className="hidden"
        multiple
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
      />
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)">
        Upload files
      </p>
      <p className="mt-2 text-sm text-(--muted)">
        Drag and drop files here, or{' '}
        <button
          className="cursor-pointer font-bold text-(--accent) underline"
          onClick={onOpenFilePicker}
          type="button"
        >
          choose files
        </button>
        .
      </p>
      <p className="mt-2 text-xs text-(--muted)">
        Max size: {maxFileSizeLabel} per file.
      </p>
      <p className="mt-1 text-xs text-(--muted)">
        Max files: {maxFilesCount}.
      </p>
      {limitError ? (
        <p className="mt-2 text-xs font-bold text-(--accent)">{limitError}</p>
      ) : null}
    </div>
  );
}
