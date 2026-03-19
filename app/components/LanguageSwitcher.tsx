import type { Locale } from '@/i18n/messages';

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-3xl bg-white p-1 text-sm font-bold text-(--muted)">
      <a
        className={`rounded-2xl px-3 py-1.5 transition ${
          locale === 'ru'
            ? 'bg-(--accent) text-white'
            : 'hover:bg-(--highlight) text-(--ink)'
        }`}
        href="?lang=ru"
      >
        RU
      </a>
      <a
        className={`rounded-2xl px-3 py-1.5 transition ${
          locale === 'en'
            ? 'bg-(--accent) text-white'
            : 'hover:bg-(--highlight) text-(--ink)'
        }`}
        href="?lang=en"
      >
        EN
      </a>
    </div>
  );
}
