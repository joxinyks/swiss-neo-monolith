/**
 * Swiss Neo-Monolith — the global footer (SNM-CANON-05).
 *
 * Every multi-section page renders this, unchanged. The TELEMETRY column is the
 * signature: it is what makes a page read as an instrument panel rather than a
 * brochure. Feed it real values — a stale REV or a hand-typed date defeats it.
 */

interface Telemetry {
  rev: string;          // "04"
  updatedISO: string;   // "2026-08-09"
  status: 'OPERATIONAL' | 'IN PROGRESS' | 'ARCHIVED';
  sla?: string;         // "<24H"
}

interface FooterGlobalProps {
  telemetry: Telemetry;
  nav: { label: string; href: string }[];
  channels: { label: string; href: string }[];
}

const COL = 'flex flex-col gap-3';
const HEAD =
  'font-mono text-micro font-bold uppercase tracking-[0.08em] text-muted';
const LINK =
  'font-mono text-xs text-text no-underline transition-colors duration-fast ease-mech ' +
  'hover:text-accent focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-focus';

export function FooterGlobal({ telemetry, nav, channels }: FooterGlobalProps) {
  const { rev, updatedISO, status, sla = '<24H' } = telemetry;

  return (
    <footer className="border-t-2 border-border-strong bg-bg">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-8 px-5 py-8
                      sm:grid-cols-2 lg:grid-cols-4">
        {/* 01 — IDENTITY */}
        <section className={COL}>
          <h2 className={HEAD}>01 // Identity</h2>
          <p className="flex items-center gap-2 text-lg font-bold">
            <span aria-hidden className="h-[1em] w-[2px] bg-accent" />
            Okan Öztürk
          </p>
          <p className="text-sm text-muted">
            Frontend engineering &amp; interface systems
          </p>
        </section>

        {/* 02 — NAVIGATION */}
        <nav className={COL} aria-label="Alt gezinme">
          <h2 className={HEAD}>02 // Navigation</h2>
          <ul className="flex flex-col gap-2">
            {nav.map((i) => (
              <li key={i.href}>
                <a className={LINK} href={i.href}>{i.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 03 — CHANNELS */}
        <section className={COL}>
          <h2 className={HEAD}>03 // Channels</h2>
          <ul className="flex flex-col gap-2">
            {channels.map((c, n) => (
              <li key={c.href} className="flex items-center gap-3">
                <span aria-hidden className="text-micro font-bold text-accent">
                  {String(n + 1).padStart(2, '0')}
                </span>
                <a className={LINK} href={c.href} target="_blank" rel="noreferrer">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 04 — TELEMETRY */}
        <section className={COL}>
          <h2 className={HEAD}>04 // Telemetry</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-xs
                         tabular-nums">
            <dt className="text-muted">STATUS</dt>
            <dd className="flex items-center gap-2 font-bold">
              <span aria-hidden className="snm-pulse inline-block size-2 bg-accent" />
              {status}
            </dd>

            <dt className="text-muted">REV</dt>
            <dd className="font-bold">{rev}</dd>

            <dt className="text-muted">UPDATED</dt>
            {/* ISO in the machine layer — see 04-voice.md */}
            <dd><time dateTime={updatedISO}>{updatedISO}</time></dd>

            <dt className="text-muted">SLA</dt>
            <dd>{sla}</dd>
          </dl>
        </section>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-content px-5 py-4 font-mono text-micro
                      uppercase tracking-[0.08em] text-muted">
          © {new Date().getFullYear()} Okan Öztürk — Swiss Neo-Monolith
        </p>
      </div>
    </footer>
  );
}
