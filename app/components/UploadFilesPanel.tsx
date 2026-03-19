import type { ChangeEvent, DragEvent, RefObject } from 'react';
import type { AppMessages } from '@/i18n/messages';

type UploadFilesPanelProps = {
  messages: AppMessages['uploadPanel'];
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
  messages,
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
        isDragging ? 'bg-(--color-vibrant-coral-50)' : 'bg-white'
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
        {messages.title}
      </p>
      <p className="mt-2 text-sm text-(--muted)">
        {messages.dropHintPrefix}{' '}
        <button
          className="cursor-pointer font-bold text-(--accent)"
          onClick={onOpenFilePicker}
          type="button"
        >
          {messages.chooseFiles}
        </button>
        {messages.dropHintSuffix}
      </p>
      <p className="mt-2 text-xs text-(--muted)">
        {messages.maxSizeLabel}: {maxFileSizeLabel}
      </p>
      <p className="mt-1 text-xs text-(--muted)">
        {messages.maxFilesLabel}: {maxFilesCount}
      </p>
      {limitError ? (
        <p className="mt-2 text-xs font-bold text-(--accent)">{limitError}</p>
      ) : null}
    </div>
  );
}
