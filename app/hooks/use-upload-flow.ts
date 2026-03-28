'use client';

import { useState } from 'react';
import {
  DEFAULT_STORAGE_TTL_HOURS,
  type StorageTtlHours,
} from '@/constants/upload';
import { saveLastShareCookie } from '@/utils/last-share-cookie';
import { generatePin } from '@/utils/pin';

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
  const [sharePin, setSharePin] = useState('');
  const [storageTtlHours, setStorageTtlHours] = useState<StorageTtlHours>(
    DEFAULT_STORAGE_TTL_HOURS,
  );

  const extractCodeFromShortLink = (shortLink: string): string | null => {
    const matched = shortLink.match(/\/s\/([^/?#]+)/);
    return matched?.[1] ?? null;
  };

  const openPinModal = () => {
    setPinValue(generatePin());
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
    setSharePin('');
  };

  const refreshPin = () => {
    if (isUploading) return;
    setPinValue(generatePin());
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
        expiresAt?: string;
      };
      if (!response.ok) {
        throw new Error(payload.message ?? uploadFailedMessage);
      }

      const shortLink = payload.shortLink ?? (payload.code ? `/s/${payload.code}` : '');
      const code = payload.code ?? (shortLink ? extractCodeFromShortLink(shortLink) : null);
      const fullShareLink = shortLink
        ? `${window.location.origin}${shortLink}`
        : window.location.href;
      const expiresAt = payload.expiresAt;

      clearSelectedFiles();
      setIsPinModalOpen(false);
      setSharePin(pinValue);
      setPinValue('');
      setStorageTtlHours(DEFAULT_STORAGE_TTL_HOURS);
      setShareLink(fullShareLink);
      setIsSuccessModalOpen(true);

      if (code && expiresAt) {
        saveLastShareCookie({
          code,
          link: fullShareLink,
          pin: pinValue,
          expiresAt,
          createdAt: new Date().toISOString(),
        });
      }
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
    sharePin,
    storageTtlHours,
    setStorageTtlHours,
    openPinModal,
    refreshPin,
    closePinModal,
    closeSuccessModal,
    continueUpload,
  };
}
