/**
 * Two services arrived with no photographs at all, so they get drawn instead of
 * faked with stock imagery. Both are stylised sketches, not maps - the labels
 * carry the information, the line carries the same "one continuous day" motif
 * as the day bar.
 */
type Props = { route: 'airport' | 'oldtown'; className?: string };

const Label = ({ x, y, children, anchor = 'middle' }: {
  x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end';
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    className="fill-[var(--ink)] font-mono"
    fontSize="11"
    letterSpacing="1.6"
  >
    {children}
  </text>
);

export function RouteLine({ route, className = '' }: Props) {
  const common = {
    fill: 'none',
    stroke: 'var(--accent)',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (route === 'airport') {
    return (
      <svg
        viewBox="0 0 400 210"
        className={className}
        role="img"
        aria-label="Sketch of the coast road from Dubrovnik airport at Čilipi through Cavtat and Mlini to Dubrovnik Old Town."
      >
        {/* coastline */}
        <path
          d="M8 168 C 70 150, 96 176, 150 154 S 236 126, 282 132 S 356 104, 394 82"
          fill="none"
          stroke="var(--line)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* the drive */}
        <path d="M40 150 C 96 128, 128 156, 178 132 S 262 106, 306 108 S 358 84, 380 66" {...common} />
        {[
          [40, 150, 'ČILIPI'],
          [178, 132, 'CAVTAT'],
          [306, 108, 'MLINI'],
          [380, 66, 'DUBROVNIK'],
        ].map(([x, y]) => (
          <circle key={`${x}`} cx={x as number} cy={y as number} r="4.5" fill="var(--accent)" />
        ))}
        <Label x={40} y={177} anchor="start">ČILIPI · DBV</Label>
        <Label x={178} y={159}>CAVTAT</Label>
        <Label x={306} y={135}>MLINI</Label>
        <Label x={392} y={45} anchor="end">DUBROVNIK</Label>
        <text x={100} y={112} className="fill-[var(--dim)] font-mono" fontSize="10" letterSpacing="1.4">
          10 MIN
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 400 250"
      className={className}
      role="img"
      aria-label="Sketch of the Dubrovnik city walls with Stradun running between the Pile and Ploče gates."
    >
      {/* the walls */}
      <path
        d="M46 158 L 74 92 L 128 44 L 196 58 L 268 68 L 330 92 L 356 132 L 344 190 L 268 206 L 168 210 L 88 200 Z"
        fill="none"
        stroke="var(--line)"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      {/* Stradun */}
      <path d="M68 152 L 296 128" {...common} />
      {/* the lanes climbing off it */}
      {[100, 132, 164, 196, 228, 260].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${149 - i * 2.5} l ${8 - i} -${26 + (i % 2) * 8}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.55"
          strokeLinecap="round"
        />
      ))}
      <circle cx="68" cy="152" r="4.5" fill="var(--accent)" />
      <circle cx="296" cy="128" r="4.5" fill="var(--accent)" />
      <circle cx="128" cy="44" r="3.5" fill="var(--dim)" />
      <Label x={62} y={180} anchor="start">PILE</Label>
      <Label x={302} y={112} anchor="end">LUŽA · PLOČE</Label>
      <Label x={128} y={32}>MINČETA</Label>
      <text x={180} y={168} className="fill-[var(--dim)] font-mono" fontSize="10" letterSpacing="1.4">
        STRADUN
      </text>
    </svg>
  );
}
