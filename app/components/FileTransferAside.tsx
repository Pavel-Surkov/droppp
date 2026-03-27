'use client';

import { MAX_FILE_SIZE_BYTES, MAX_FILES_COUNT } from '@/constants/upload';
import type { AppMessages } from '@/i18n/messages';
import { formatBytes } from '@/utils/files';
import { SelectedFilesPanel } from '@/app/components/SelectedFilesPanel';
import { UploadFilesPanel } from '@/app/components/UploadFilesPanel';
import { UploadPinModal } from '@/app/components/UploadPinModal';
import { UploadSuccessModal } from '@/app/components/UploadSuccessModal';
import { useFileSelection } from '@/app/hooks/use-file-selection';
import { useUploadFlow } from '@/app/hooks/use-upload-flow';

type FileTransferAsideProps = {
  messages: AppMessages;
};

export function FileTransferAside({ messages }: FileTransferAsideProps) {
  const {
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
  } = useFileSelection({
    messages: {
      tooLarge: messages.errors.tooLarge,
      tooMany: messages.errors.tooMany,
    },
  });

  const {
    isPinModalOpen,
    pinValue,
    isUploading,
    isSuccessModalOpen,
    shareLink,
    sharePin,
    storageTtlHours,
    setStorageTtlHours,
    openPinModal,
    refreshPin,
    closePinModal,
    closeSuccessModal,
    continueUpload,
  } = useUploadFlow({
    files,
    uploadFailedMessage: messages.errors.uploadFailed,
    clearSelectedFiles: clearFiles,
    clearError: clearLimitError,
    setError: setLimitError,
  });

  return (
    <>
      <aside
        className="grid min-w-0 gap-4 grid-rows-[1fr_2fr] md:min-h-136"
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
          onUploadFiles={openPinModal}
        />
      </aside>

      <UploadPinModal
        messages={messages.pinModal}
        isOpen={isPinModalOpen}
        isSubmitting={isUploading}
        onContinue={continueUpload}
        onClose={closePinModal}
        pinValue={pinValue}
        selectedTtlHours={storageTtlHours}
        onTtlChange={setStorageTtlHours}
        onRefreshPin={refreshPin}
      />
      <UploadSuccessModal
        messages={messages.successModal}
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        shareLink={shareLink}
        sharePin={sharePin}
      />
    </>
  );
}
