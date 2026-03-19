'use client';

import { useState } from 'react';
import {
  DEFAULT_STORAGE_TTL_HOURS,
  type StorageTtlHours,
} from '@/constants/upload';

type UseUploadFlowParams = {
  files: File[];
  uploadFailedMessage: string;
  clearSelectedFiles: () => void;
  clearError: () => void;
  setError: (message: string) => void;
};

export function useUploadFlow({
  files,
  uploadFailedMessage,
  clearSelectedFiles,
  clearError,
  setError,
}: UseUploadFlowParams) {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [storageTtlHours, setStorageTtlHours] = useState<StorageTtlHours>(
    DEFAULT_STORAGE_TTL_HOURS,
  );

  const openPinModal = () => {
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    if (isUploading) return;
    setIsPinModalOpen(false);
    setPinValue('');
    setStorageTtlHours(DEFAULT_STORAGE_TTL_HOURS);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setShareLink('');
  };

  const continueUpload = async () => {
    if (!/^\d{4}$/.test(pinValue) || files.length === 0) return;

    setIsUploading(true);
    clearError();

    try {
      const formData = new FormData();
      formData.append('pin', pinValue);
      formData.append('ttlHours', String(storageTtlHours));
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
        throw new Error(payload.message ?? uploadFailedMessage);
      }

      const shortLink = payload.shortLink ?? (payload.code ? `/s/${payload.code}` : '');
      const fullShareLink = shortLink
        ? `${window.location.origin}${shortLink}`
        : window.location.href;

      clearSelectedFiles();
      setIsPinModalOpen(false);
      setPinValue('');
      setStorageTtlHours(DEFAULT_STORAGE_TTL_HOURS);
      setShareLink(fullShareLink);
      setIsSuccessModalOpen(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : uploadFailedMessage;
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isPinModalOpen,
    pinValue,
    isUploading,
    isSuccessModalOpen,
    shareLink,
    storageTtlHours,
    setPinValue,
    setStorageTtlHours,
    openPinModal,
    closePinModal,
    closeSuccessModal,
    continueUpload,
  };
}
