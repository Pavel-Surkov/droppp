const features = [
  "Short memorable links",
  "Auto-delete after 1 hour by default",
  "Optional 4-digit PIN protection",
]

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12 md:px-10">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <section className="space-y-5">
          <p className="inline-block rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Next.js + Tailwind v4
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Drop files.
            <br />
            Share by short link.
          </h1>
          <p className="max-w-xl text-base text-[var(--muted)] md:text-lg">
            Starter page for a fast one-time file sharing service between devices.
            Max storage window: 24 hours.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
              Upload file
            </button>
            <button className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">
              Open shared link
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_10px_40px_rgba(49,30,12,0.08)] md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
            Core flow
          </p>
          <ol className="space-y-4 text-sm text-[var(--ink)] md:text-base">
            <li>1. Upload a file and pick expiry time.</li>
            <li>2. Get short link like `dropp.site/a8k2`.</li>
            <li>3. Enter optional PIN and download on another device.</li>
          </ol>
          <ul className="mt-6 space-y-2 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
            {features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
