'use client';

import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { MAX_FILE_SIZE_BYTES } from '@/constants/upload';
import { buildFileId, formatBytes } from '@/utils/files';
import { SelectedFilesPanel } from '@/app/components/SelectedFilesPanel';
import { UploadFilesPanel } from '@/app/components/UploadFilesPanel';

export function FileTransferAside() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [limitError, setLimitError] = useState('');

  const addFiles = (incomingFiles: FileList | null) => {
    const nextFiles = Array.from(incomingFiles ?? []);
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

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => buildFileId(file) !== id));
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = '';
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <aside className="grid gap-4 grid-rows:1fr_2fr" id="file-transfer">
      <UploadFilesPanel
        fileInputRef={fileInputRef}
        isDragging={isDragging}
        limitError={limitError}
        maxFileSizeLabel={formatBytes(MAX_FILE_SIZE_BYTES)}
        onDropZoneDragLeave={onDragLeave}
        onDropZoneDragOver={onDragOver}
        onDropZoneDrop={onDrop}
        onFileInputChange={onInputChange}
        onOpenFilePicker={openFilePicker}
      />
      <SelectedFilesPanel files={files} onRemoveFile={removeFile} />
    </aside>
  );
}
