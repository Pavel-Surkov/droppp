'use client';

import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { MAX_FILE_SIZE_BYTES, MAX_FILES_COUNT } from '@/constants/upload';
import type { AppMessages } from '@/i18n/messages';
import { buildFileId, formatBytes } from '@/utils/files';
import { formatMessage } from '@/utils/format-message';
import { SelectedFilesPanel } from '@/app/components/SelectedFilesPanel';
import { UploadFilesPanel } from '@/app/components/UploadFilesPanel';
import { UploadPinModal } from '@/app/components/UploadPinModal';
import { UploadSuccessModal } from '@/app/components/UploadSuccessModal';

type FileTransferAsideProps = {
  messages: AppMessages;
};

export function FileTransferAside({ messages }: FileTransferAsideProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [limitError, setLimitError] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const addFiles = (incomingFiles: FileList | null) => {
    const nextFiles = Array.from(incomingFiles ?? []);
    if (!nextFiles.length) return;

    const oversized = nextFiles.filter(
      (file) => file.size > MAX_FILE_SIZE_BYTES
    );
    const acceptedBySize = nextFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE_BYTES
    );
    const existingIds = new Set(files.map((file) => buildFileId(file)));
    const uniqueAccepted = acceptedBySize.filter(
      (file) => !existingIds.has(buildFileId(file))
    );
    const slotsLeft = Math.max(0, MAX_FILES_COUNT - files.length);
    const accepted = uniqueAccepted.slice(0, slotsLeft);
    const exceededCount = uniqueAccepted.length - accepted.length;

    const errors: string[] = [];
    if (oversized.length > 0) {
      errors.push(
        formatMessage(messages.errors.tooLarge, {
          count: oversized.length,
          size: formatBytes(MAX_FILE_SIZE_BYTES),
        })
      );
    }
    if (exceededCount > 0) {
      errors.push(
        formatMessage(messages.errors.tooMany, {
          count: exceededCount,
          max: MAX_FILES_COUNT,
        })
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

  const onUploadFiles = () => {
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    if (isUploading) return;
    setIsPinModalOpen(false);
    setPinValue('');
  };

  const onContinueUpload = async () => {
    if (!/^\d{4}$/.test(pinValue) || files.length === 0) return;

    setIsUploading(true);
    setLimitError('');

    try {
      const formData = new FormData();
      formData.append('pin', pinValue);
      for (const file of files) {
        formData.append('files', file);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json()) as {
        message?: string;
        code?: string;
        shortLink?: string;
      };
      if (!response.ok) {
        throw new Error(payload.message ?? messages.errors.uploadFailed);
      }

      const shortLink = payload.shortLink ?? (payload.code ? `/s/${payload.code}` : '');
      const fullShareLink = shortLink
        ? `${window.location.origin}${shortLink}`
        : window.location.href;

      setFiles([]);
      setIsPinModalOpen(false);
      setPinValue('');
      setShareLink(fullShareLink);
      setIsSuccessModalOpen(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : messages.errors.uploadFailed;
      setLimitError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setShareLink('');
  };

  return (
    <>
      <aside
        className="grid gap-4 grid-rows-[1fr_2fr] md:min-h-136"
        id="file-transfer"
      >
        <UploadFilesPanel
          messages={messages.uploadPanel}
          fileInputRef={fileInputRef}
          isDragging={isDragging}
          limitError={limitError}
          maxFileSizeLabel={formatBytes(MAX_FILE_SIZE_BYTES)}
          maxFilesCount={MAX_FILES_COUNT}
          onDropZoneDragLeave={onDragLeave}
          onDropZoneDragOver={onDragOver}
          onDropZoneDrop={onDrop}
          onFileInputChange={onInputChange}
          onOpenFilePicker={openFilePicker}
        />
        <SelectedFilesPanel
          messages={messages.selectedPanel}
          files={files}
          onRemoveFile={removeFile}
          onUploadFiles={onUploadFiles}
        />
      </aside>

      <UploadPinModal
        messages={messages.pinModal}
        isOpen={isPinModalOpen}
        isSubmitting={isUploading}
        onContinue={onContinueUpload}
        onClose={closePinModal}
        onPinChange={setPinValue}
        pinValue={pinValue}
      />
      <UploadSuccessModal
        messages={messages.successModal}
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        shareLink={shareLink}
      />
    </>
  );
}
