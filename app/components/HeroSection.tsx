import type { AppMessages } from '@/i18n/messages';

type HeroSectionProps = {
  messages: AppMessages['hero'];
};

export function HeroSection({ messages }: HeroSectionProps) {
  return (
    <article className="rounded-4xl border-2 border-(--line) bg-(--card) p-6 md:p-9 md:shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
      <p className="mb-5 inline-flex rounded-full bg-(--soft) px-3 py-1 text-xs font-bold tracking-wide text-(--muted)">
        {messages.badge}
      </p>
      <h1
        className="text-4xl leading-10 md:leading-16 font-bold md:text-6xl"
        style={{ fontFamily: 'Fraunces, serif' }}
      >
        {messages.titleLine1}
        <br />
        {messages.titleLine2}
        <br />
        {messages.titleLine3}
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-(--muted) md:text-base">
        {messages.description}
      </p>
    </article>
  );
}
