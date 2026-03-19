import type { AppMessages, Locale } from '@/i18n/messages';

type HeroSectionProps = {
  messages: AppMessages['hero'];
  locale: Locale;
};

export function HeroSection({ messages, locale }: HeroSectionProps) {
  return (
    <article className="flex h-full flex-col rounded-4xl border-2 border-(--line) bg-(--card) p-6 md:p-9 md:shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
      <h1
        className="font-['Nunito'] text-4xl leading-10 font-extrabold md:text-6xl md:leading-16"
      >
        {messages.title}
      </h1>
      <p className="mt-5 max-w-xl whitespace-pre-line text-sm leading-relaxed text-(--muted) md:text-base">
        {messages.description}
      </p>
      <a
        className="mt-auto pt-5 inline-flex text-sm font-bold text-(--accent) underline-offset-2 hover:underline"
        href={`/legal?lang=${locale}`}
      >
        {messages.legalLink}
      </a>
    </article>
  );
}
