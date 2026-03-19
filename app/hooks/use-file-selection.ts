'use client';

import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { MAX_FILE_SIZE_BYTES, MAX_FILES_COUNT } from '@/constants/upload';
import { buildFileId, formatBytes } from '@/utils/files';
import { formatMessage } from '@/utils/format-message';

type FileSelectionMessages = {
  tooLarge: string;
  tooMany: string;
};

type UseFileSelectionParams = {
  messages: FileSelectionMessages;
};

export function useFileSelection({ messages }: UseFileSelectionParams) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [limitError, setLimitError] = useState('');

  const addFiles = (incomingFiles: FileList | null) => {
    const nextFiles = Array.from(incomingFiles ?? []);
    if (!nextFiles.length) return;

    const oversized = nextFiles.filter((file) => file.size > MAX_FILE_SIZE_BYTES);
    const acceptedBySize = nextFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE_BYTES,
    );
    const existingIds = new Set(files.map((file) => buildFileId(file)));
    const uniqueAccepted = acceptedBySize.filter(
      (file) => !existingIds.has(buildFileId(file)),
    );
    const slotsLeft = Math.max(0, MAX_FILES_COUNT - files.length);
    const accepted = uniqueAccepted.slice(0, slotsLeft);
    const exceededCount = uniqueAccepted.length - accepted.length;

    const errors: string[] = [];
    if (oversized.length > 0) {
      errors.push(
        formatMessage(messages.tooLarge, {
          count: oversized.length,
          size: formatBytes(MAX_FILE_SIZE_BYTES),
        }),
      );
    }
    if (exceededCount > 0) {
      errors.push(
        formatMessage(messages.tooMany, {
          count: exceededCount,
          max: MAX_FILES_COUNT,
        }),
      );
    }
    setLimitError(errors.join(' '));

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

  const clearFiles = () => {
    setFiles([]);
  };

  const clearLimitError = () => {
    setLimitError('');
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

  return {
    fileInputRef,
    files,
    isDragging,
    limitError,
    clearLimitError,
    setLimitError,
    removeFile,
    clearFiles,
    openFilePicker,
    onInputChange,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}
