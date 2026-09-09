export function Problem() {
  return (
    <section
      data-section
      data-hour="paper"
      className="border-b"
      style={{ background: 'var(--bg)', color: 'var(--ink)', borderColor: 'var(--line)' }}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <h2
            data-reveal
            className="text-[clamp(1.9rem,5.6vw,3.1rem)] leading-[1.06] tracking-[-0.015em] lg:col-span-5"
          >
            Most people book Dubrovnik four times.
          </h2>

          <div className="lg:col-span-6 lg:col-start-7">
            <p data-reveal data-reveal-delay="80" className="measure text-[1.0625rem] leading-[1.72] text-[var(--dim)]">
              A transfer company. A city guide. A boat. A snorkelling trip. Four confirmations,
              four strangers, four people who have no idea what you did yesterday or what you
              actually enjoyed.
            </p>
            <p data-reveal data-reveal-delay="140" className="measure mt-5 text-[1.0625rem] leading-[1.72]">
              I do all four. Not because it is clever marketing — because I live ten minutes from the
              airport and keep the boat there. So the day fits together instead of being stitched
              from four bookings.
            </p>

            {/* Restored at the client's call over the comparison-list version:
                he found the four-up stat grid more compelling to look at, and
                every figure below is literally true, not an invented metric. */}
            <dl
              data-reveal
              data-reveal-delay="200"
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t pt-8 sm:grid-cols-4"
              style={{ borderColor: 'var(--rule)' }}
            >
              {[
                ['4', 'services, one person'],
                ['1', 'number, any hour'],
                ['0', 'agencies in between'],
                ['EN · HR', 'spoken on board'],
              ].map(([big, small]) => (
                <div key={small}>
                  <dt className="font-display text-[2rem] leading-none tabular-nums" style={{ color: 'var(--accent)' }}>
                    {big}
                  </dt>
                  <dd className="mt-2 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-[var(--dim)]">
                    {small.toUpperCase()}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
