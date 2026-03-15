export type Locale = 'ru' | 'en';

export type AppMessages = {
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
  };
  uploadPanel: {
    title: string;
    dropHintPrefix: string;
    chooseFiles: string;
    dropHintSuffix: string;
    maxSizeLabel: string;
    maxFilesLabel: string;
  };
  selectedPanel: {
    title: string;
    empty: string;
    uploadButton: string;
    removeFileAria: string;
  };
  pinModal: {
    title: string;
    description: string;
    reminder: string;
    closeAria: string;
    continueButton: string;
    uploadingButton: string;
  };
  successModal: {
    title: string;
    description: string;
    closeAria: string;
    copyButton: string;
    shareButton: string;
    copied: string;
    copyFailed: string;
    shareNotSupported: string;
    shareOpened: string;
    shareCancelled: string;
    shareTitle: string;
    shareText: string;
  };
  errors: {
    tooLarge: string;
    tooMany: string;
    uploadFailed: string;
  };
  receiver: {
    title: string;
    description: string;
    codeLabel: string;
    expiresLabel: string;
    loading: string;
    notFoundTitle: string;
    notFoundDescription: string;
    expiredTitle: string;
    expiredDescription: string;
    filesTitle: string;
    selectAtLeastOne: string;
    pinTitle: string;
    pinDescription: string;
    pinInvalid: string;
    continueButton: string;
    checkingButton: string;
    readyTitle: string;
    readyDescription: string;
    downloadSelected: string;
    backHome: string;
  };
};

const dictionaries: Record<Locale, AppMessages> = {
  ru: {
    hero: {
      badge: 'Без USB',
      titleLine1: 'Отправь файл,',
      titleLine2: 'сохрани только',
      titleLine3: 'короткую ссылку',
      description:
        'Идеально для презентаций: загрузи дома, открой на любом университетском компьютере. Время хранения по умолчанию 1 час (до 24 часов), доступ по ссылке и 4-значному PIN.',
    },
    uploadPanel: {
      title: 'Загрузка файлов',
      dropHintPrefix: 'Перетащи файлы сюда или',
      chooseFiles: 'выбери файлы',
      dropHintSuffix: '.',
      maxSizeLabel: 'Макс. размер',
      maxFilesLabel: 'Макс. файлов',
    },
    selectedPanel: {
      title: 'Выбранные файлы',
      empty: 'Файлы пока не выбраны.',
      uploadButton: 'Загрузить',
      removeFileAria: 'Удалить файл',
    },
    pinModal: {
      title: 'Введите PIN',
      description:
        'Получателю нужно будет ввести этот PIN для доступа к файлам.',
      reminder:
        'Сохраните PIN в надежном месте, чтобы не потерять доступ к файлам.',
      closeAria: 'Закрыть окно PIN',
      continueButton: 'Продолжить',
      uploadingButton: 'Загрузка...',
    },
    successModal: {
      title: 'Загрузка завершена',
      description:
        'Файлы успешно загружены. Передайте эту ссылку получателю для доступа.',
      closeAria: 'Закрыть окно успешной загрузки',
      copyButton: 'Скопировать ссылку',
      shareButton: 'Поделиться',
      copied: 'Ссылка скопирована.',
      copyFailed: 'Не удалось скопировать автоматически. Скопируйте вручную.',
      shareNotSupported: 'Функция Share не поддерживается на этом устройстве.',
      shareOpened: 'Окно Share открыто.',
      shareCancelled: 'Поделиться не удалось или действие отменено.',
      shareTitle: 'Ссылка на файлы',
      shareText: 'Откройте эту ссылку, чтобы получить доступ к файлам.',
    },
    errors: {
      tooLarge: '{count} файл(ов) пропущено: максимум {size} на файл.',
      tooMany: '{count} файл(ов) пропущено: максимум {max} файлов.',
      uploadFailed: 'Ошибка загрузки.',
    },
    receiver: {
      title: 'Получение файлов',
      description:
        'Выберите файлы, введите PIN и скачайте материалы на это устройство.',
      codeLabel: 'Код ссылки',
      expiresLabel: 'Ссылка действует до',
      loading: 'Загружаем информацию о файлах...',
      notFoundTitle: 'Ссылка не найдена',
      notFoundDescription:
        'Проверьте ссылку и попробуйте снова. Возможно, она уже удалена.',
      expiredTitle: 'Срок ссылки истек',
      expiredDescription:
        'Файлы удалены из хранилища после окончания времени хранения.',
      filesTitle: 'Файлы для скачивания',
      selectAtLeastOne: 'Выберите хотя бы один файл.',
      pinTitle: 'Введите PIN',
      pinDescription: 'Используйте 4-значный PIN, который сообщил отправитель.',
      pinInvalid: 'Неверный PIN или ссылка больше недействительна.',
      continueButton: 'Продолжить',
      checkingButton: 'Проверка...',
      readyTitle: 'Доступ открыт',
      readyDescription: 'Теперь можно скачать выбранные файлы.',
      downloadSelected: 'Скачать выбранные',
      backHome: 'На главную',
    },
  },
  en: {
    hero: {
      badge: 'No USB needed',
      titleLine1: 'Send your file,',
      titleLine2: 'carry just a tiny',
      titleLine3: 'link',
      description:
        'Perfect for class presentations: upload from home, open from any university computer. Default storage time is 1 hour (up to 24 hours), access is protected by short link + 4-digit PIN.',
    },
    uploadPanel: {
      title: 'Upload files',
      dropHintPrefix: 'Drag and drop files here, or',
      chooseFiles: 'choose files',
      dropHintSuffix: '.',
      maxSizeLabel: 'Max size',
      maxFilesLabel: 'Max files',
    },
    selectedPanel: {
      title: 'Selected files',
      empty: 'No files selected yet.',
      uploadButton: 'Upload',
      removeFileAria: 'Remove file',
    },
    pinModal: {
      title: 'Enter a PIN',
      description: 'The recipient will need to enter this PIN to access the files.',
      reminder:
        'Save this PIN somewhere safe. You will need it to share file access.',
      closeAria: 'Close PIN modal',
      continueButton: 'Continue',
      uploadingButton: 'Uploading...',
    },
    successModal: {
      title: 'Upload complete',
      description:
        'Your files were uploaded successfully. Share this link with the recipient to access the files.',
      closeAria: 'Close upload success modal',
      copyButton: 'Copy link',
      shareButton: 'Share',
      copied: 'Link copied.',
      copyFailed: 'Could not copy automatically. Please copy manually.',
      shareNotSupported: 'Share is not supported on this device.',
      shareOpened: 'Share dialog opened.',
      shareCancelled: 'Share action was cancelled.',
      shareTitle: 'File access link',
      shareText: 'Use this link to access the uploaded files.',
    },
    errors: {
      tooLarge: '{count} file(s) skipped: max size is {size} per file.',
      tooMany: '{count} file(s) skipped: max {max} files allowed.',
      uploadFailed: 'Upload failed.',
    },
    receiver: {
      title: 'Get files',
      description: 'Choose files, enter PIN, and download them on this device.',
      codeLabel: 'Share code',
      expiresLabel: 'Available until',
      loading: 'Loading shared files...',
      notFoundTitle: 'Link not found',
      notFoundDescription:
        'Check the link and try again. It may already be deleted.',
      expiredTitle: 'Link expired',
      expiredDescription:
        'Files were removed from storage after expiration time.',
      filesTitle: 'Files to download',
      selectAtLeastOne: 'Select at least one file.',
      pinTitle: 'Enter PIN',
      pinDescription: 'Use the 4-digit PIN provided by the sender.',
      pinInvalid: 'Invalid PIN or the link is no longer available.',
      continueButton: 'Continue',
      checkingButton: 'Checking...',
      readyTitle: 'Access granted',
      readyDescription: 'You can now download selected files.',
      downloadSelected: 'Download selected',
      backHome: 'Back to home',
    },
  },
};

export function getLocale(lang?: string): Locale {
  if (lang === 'en') return 'en';
  return 'ru';
}

export function getMessages(locale: Locale): AppMessages {
  return dictionaries[locale];
}
