import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';
import { getLocale, getMessages } from '@/i18n/messages';

type LegalPageProps = {
  searchParams?: Promise<{ lang?: string }>;
};

export default async function LegalPage({ searchParams }: LegalPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const locale = getLocale(params?.lang);
  const messages = getMessages(locale);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-4xl items-center px-5 py-16 md:px-10 md:py-20">
      <div className="absolute top-4 right-5 md:top-6 md:right-10">
        <LanguageSwitcher locale={locale} />
      </div>

      <article className="w-full rounded-4xl border-2 border-(--line) bg-white p-6 text-(--ink) md:p-9">
        <h1 className="font-['Nunito'] text-3xl font-extrabold md:text-5xl">
          {messages.legal.title}
        </h1>
        <p className="mt-4 text-(--muted)">{messages.legal.description}</p>
        <p className="mt-3 text-(--muted)">{messages.legal.userResponsibility}</p>
        <p className="mt-3 text-(--muted)">{messages.legal.ownerDisclaimer}</p>
        <p className="mt-3 text-(--muted)">{messages.legal.securityNotice}</p>

        <a
          className="mt-6 inline-flex rounded-xl bg-(--accent) px-4 py-2 font-bold text-white"
          href={`/?lang=${locale}`}
        >
          {messages.legal.backHome}
        </a>
      </article>
    </main>
  );
}
