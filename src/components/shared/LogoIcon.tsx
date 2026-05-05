interface LogoIconProps {
  size?: number
  className?: string
}

export function LogoIcon({ size = 32, className = '' }: LogoIconProps) {
  const id = `lg-${size}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-page`} x1="20" y1="10" x2="180" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>

      {/* ── LEFT PAGE ── */}
      <path
        d="M100 110 L96 10 L22 18 L28 108 Z"
        fill={`url(#${id}-page)`}
        stroke="#38bdf8"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Page ruled lines (left) */}
      <line x1="30" y1="38" x2="95" y2="30" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.45" />
      <line x1="30" y1="55" x2="95" y2="47" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.45" />
      <line x1="30" y1="72" x2="95" y2="64" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.45" />
      <line x1="30" y1="89" x2="95" y2="81" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.45" />

      {/* ── RIGHT PAGE ── */}
      <path
        d="M100 110 L104 10 L178 18 L172 108 Z"
        fill={`url(#${id}-page)`}
        stroke="#38bdf8"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Page ruled lines (right) */}
      <line x1="170" y1="38" x2="105" y2="30" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.45" />
      <line x1="170" y1="55" x2="105" y2="47" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.45" />
      <line x1="170" y1="72" x2="105" y2="64" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.45" />
      <line x1="170" y1="89" x2="105" y2="81" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.45" />

      {/* ── CIRCUIT TRACES — LEFT ── */}
      {/* Route A: goes left then up → outer node */}
      <polyline
        points="52,108 30,108 30,86 14,86"
        stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="14" cy="86" r="5.5" stroke="#38bdf8" strokeWidth="2.8" />
      {/* Corner via A */}
      <circle cx="30" cy="108" r="4" stroke="#38bdf8" strokeWidth="2.5" fill="#bae6fd" />

      {/* Route B: goes left then down → lower node */}
      <polyline
        points="40,110 40,130 18,130 18,148"
        stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="18" cy="148" r="5.5" stroke="#38bdf8" strokeWidth="2.8" />
      {/* Corner via B */}
      <circle cx="40" cy="130" r="4" stroke="#38bdf8" strokeWidth="2.5" fill="#bae6fd" />

      {/* Route C: short diagonal down-left → bottom-left node */}
      <polyline
        points="58,110 58,142 38,142 38,160"
        stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="38" cy="160" r="4.5" stroke="#38bdf8" strokeWidth="2.2" />

      {/* ── CIRCUIT TRACES — RIGHT (mirror) ── */}
      {/* Route A */}
      <polyline
        points="148,108 170,108 170,86 186,86"
        stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="186" cy="86" r="5.5" stroke="#38bdf8" strokeWidth="2.8" />
      <circle cx="170" cy="108" r="4" stroke="#38bdf8" strokeWidth="2.5" fill="#bae6fd" />

      {/* Route B */}
      <polyline
        points="160,110 160,130 182,130 182,148"
        stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="182" cy="148" r="5.5" stroke="#38bdf8" strokeWidth="2.8" />
      <circle cx="160" cy="130" r="4" stroke="#38bdf8" strokeWidth="2.5" fill="#bae6fd" />

      {/* Route C */}
      <polyline
        points="142,110 142,142 162,142 162,160"
        stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="162" cy="160" r="4.5" stroke="#38bdf8" strokeWidth="2.2" />

      {/* ── SPINE CENTER node ── */}
      <line x1="100" y1="110" x2="100" y2="130" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="100" cy="134" r="5" stroke="#38bdf8" strokeWidth="2.8" />
    </svg>
  )
}
