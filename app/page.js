export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10 md:px-10">
      <section className="grid w-full gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_18px_48px_rgba(38,65,48,0.12)] md:p-9">
          <p className="mb-5 inline-flex rounded-full bg-[#d9ebe0] px-3 py-1 text-xs font-bold tracking-wide text-[var(--muted)]">
            No USB needed
          </p>
          <h1
            className="text-4xl leading-tight font-bold md:text-6xl"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Send your file,
            <br />
            carry just a tiny
            <br />
            link.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Perfect for class presentations: upload from home, open from any
            university computer. Set file lifetime from 1 hour to 24 hours and
            optionally protect access with a 4-digit PIN.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              Start upload
            </button>
            <button className="rounded-2xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-bold text-[var(--ink)]">
              Open link
            </button>
          </div>
        </article>

        <aside className="grid gap-4">
          <div className="rounded-[1.6rem] border border-[var(--line)] bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
              Example
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[var(--accent)]">/d2f6</p>
          </div>
          <div className="rounded-[1.6rem] border border-[var(--line)] bg-[#edf5ec] p-5 text-sm text-[var(--muted)]">
            <p className="font-bold text-[var(--ink)]">How it works</p>
            <p className="mt-2">1h by default, auto cleanup enabled.</p>
            <p>Increase TTL up to 24h when needed.</p>
            <p>PIN code is optional and exactly 4 digits.</p>
          </div>
        </aside>
      </section>
    </main>
  )
}
