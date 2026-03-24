export type Locale = 'ru' | 'en';

export type AppMessages = {
  hero: {
    title: string;
    description: string;
    legalLink: string;
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
    ttlLabel: string;
    ttlHint: string;
    ttlOneHour: string;
    ttlSixHours: string;
    ttlTwelveHours: string;
    ttlTwentyFourHours: string;
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
    filesCountLabel: string;
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
    downloadZip: string;
    backHome: string;
  };
  legal: {
    title: string;
    description: string;
    userResponsibility: string;
    ownerDisclaimer: string;
    securityNotice: string;
    backHome: string;
  };
};

const dictionaries: Record<Locale, AppMessages> = {
  ru: {
    hero: {
      title: 'Droppp',
      description:
        'Сервис помогает быстро передавать файлы между устройствами по короткой ссылке и PIN-коду без регистрации.\nУдобно, когда нужно открыть документы на чужом компьютере.\nФайлы хранятся ограниченное время и автоматически удаляются после истечения заданного срока.',
      legalLink: 'Правила и условия',
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
      ttlLabel: 'Время хранения',
      ttlHint: 'Файлы удалятся автоматически после выбранного срока.',
      ttlOneHour: '1 ч',
      ttlSixHours: '6 ч',
      ttlTwelveHours: '12 ч',
      ttlTwentyFourHours: '24 ч',
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
        'Введите PIN, чтобы открыть список файлов и скачать их на это устройство.',
      codeLabel: 'Код ссылки',
      expiresLabel: 'Ссылка действует до',
      filesCountLabel: 'Файлов в отправке',
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
      pinInvalid: 'Неверный PIN.',
      continueButton: 'Продолжить',
      checkingButton: 'Проверка...',
      readyTitle: 'Доступ открыт',
      readyDescription:
        'Выберите нужные файлы и скачайте их по отдельности или ZIP-архивом.',
      downloadSelected: 'Скачать выбранные',
      downloadZip: 'Скачать ZIP',
      backHome: 'На главную',
    },
    legal: {
      title: 'Правила использования',
      description:
        'Сервис предназначен для временного обмена файлами по ссылке и PIN-коду.',
      userResponsibility:
        'Пользователь самостоятельно несет ответственность за содержание и законность загружаемых файлов.',
      ownerDisclaimer:
        'Владелец сервиса не несет ответственности за последствия использования сервиса, включая возможную утечку или кражу файлов третьими лицами.',
      securityNotice:
        'Не загружайте данные, которые не готовы передавать через публичный интернет.',
      backHome: 'На главную',
    },
  },
  en: {
    hero: {
      title: 'Droppp',
      description:
        'This service lets you quickly transfer files between devices using a short link and PIN, without sign-up.\nIt is useful when you need to open documents on another computer.\nFiles are stored for a limited time and then deleted automatically.',
      legalLink: 'Rules and legal',
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
      description:
        'The recipient will need to enter this PIN to access the files.',
      reminder:
        'Save this PIN somewhere safe. You will need it to share file access.',
      ttlLabel: 'Storage time',
      ttlHint: 'Files are deleted automatically after the selected time.',
      ttlOneHour: '1h',
      ttlSixHours: '6h',
      ttlTwelveHours: '12h',
      ttlTwentyFourHours: '24h',
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
      description:
        'Enter PIN to unlock the file list and download files on this device.',
      codeLabel: 'Share code',
      expiresLabel: 'Available until',
      filesCountLabel: 'Files in share',
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
      readyDescription:
        'Choose files and download them individually or as ZIP archive.',
      downloadSelected: 'Download selected',
      downloadZip: 'Download ZIP',
      backHome: 'Back to home',
    },
    legal: {
      title: 'Terms of Use',
      description:
        'The service is intended for temporary file sharing via link and PIN.',
      userResponsibility:
        'Users are fully responsible for the legality and content of uploaded files.',
      ownerDisclaimer:
        'The service owner is not liable for consequences of service usage, including possible data leaks or file theft by third parties.',
      securityNotice:
        'Do not upload data you are not ready to transfer over the public internet.',
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
