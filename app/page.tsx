import { FileTransferAside } from '@/app/components/FileTransferAside';
import { HeroSection } from '@/app/components/HeroSection';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';
import { getLocale, getMessages } from '@/i18n/messages';

type HomePageProps = {
  searchParams?: Promise<{ lang?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const locale = getLocale(params?.lang);
  const messages = getMessages(locale);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center overflow-x-clip px-5 py-16 md:px-10 md:py-20">
      <div className="absolute top-4 right-5 md:top-6 md:right-10">
        <LanguageSwitcher locale={locale} />
      </div>
      <section className="grid min-w-0 w-full gap-4 md:gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <HeroSection locale={locale} messages={messages.hero} />
        <FileTransferAside messages={messages} />
      </section>
    </main>
  );
}
