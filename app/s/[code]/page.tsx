import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';
import { ShareAccessPanel } from '@/app/components/ShareAccessPanel';
import { getLocale, getMessages } from '@/i18n/messages';

type SharePageProps = {
  params: Promise<{ code: string }>;
  searchParams?: Promise<{ lang?: string }>;
};

export default async function SharePage({
  params,
  searchParams,
}: SharePageProps) {
  const routeParams = await params;
  const queryParams = searchParams ? await searchParams : undefined;
  const locale = getLocale(queryParams?.lang);
  const messages = getMessages(locale);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-16 md:px-10 md:py-20">
      <div className="absolute top-4 right-5 md:top-6 md:right-10">
        <LanguageSwitcher locale={locale} />
      </div>
      <div className="w-full">
        <ShareAccessPanel
          code={routeParams.code}
          locale={locale}
          messages={messages.receiver}
        />
      </div>
    </main>
  );
}
