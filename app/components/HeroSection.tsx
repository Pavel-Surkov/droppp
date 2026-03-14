export function HeroSection() {
  return (
    <article className="rounded-4xl border-2 border-(--line) bg-(--card) p-6 shadow-[0_18px_48px_rgba(0,0,0,0.2)] md:p-9">
      <p className="mb-5 inline-flex rounded-full bg-(--soft) px-3 py-1 text-xs font-bold tracking-wide text-(--muted)">
        No USB needed
      </p>
      <h1
        className="text-4xl leading-10 md:leading-16 font-bold md:text-6xl"
        style={{ fontFamily: 'Fraunces, serif' }}
      >
        Send your file,
        <br />
        carry just a tiny
        <br />
        link
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-(--muted) md:text-base">
        Perfect for class presentations: upload from home, open from any
        university computer. Set file lifetime from 1 hour to 24 hours and
        optionally protect access with a 4-digit PIN.
      </p>
    </article>
  );
}
