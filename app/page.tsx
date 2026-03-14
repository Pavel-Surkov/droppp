import { FileTransferAside } from "@/app/components/FileTransferAside"
import { HeroSection } from "@/app/components/HeroSection"

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 pt-10 pb-16 md:px-10 md:py-10">
      <section className="grid w-full gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <HeroSection />
        <FileTransferAside />
      </section>
    </main>
  )
}
