/**
 * Clean white hex field — soft honeycomb that fades into white at the edges.
 * Sparse, light strokes; center peek only. No busy cube lines.
 */
export default function HeroHexBackground() {
  return (
    <div
      className="hero-hex-bg pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_38%,#f6f7f9_0%,#ffffff_58%,#ffffff_100%)]" />

      <svg
        className="hero-hex-mesh absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Flat-top honeycomb tile (row height = 1.5 * vertical side) */}
          <pattern
            id="heroHexTile"
            width="120"
            height="104"
            patternUnits="userSpaceOnUse"
          >
            {/* Row 1 */}
            <path
              d="M60 4 L112 34 L112 74 L60 104 L8 74 L8 34 Z"
              fill="none"
              stroke="#94a3b8"
              strokeOpacity="0.22"
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
            <path
              d="M60 4 L112 34"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.85"
              strokeWidth="0.5"
            />
            {/* Row 2 — offset half cell */}
            <path
              d="M120 56 L172 86 L172 126 L120 156 L68 126 L68 86 Z"
              fill="none"
              stroke="#94a3b8"
              strokeOpacity="0.14"
              strokeWidth="0.7"
              strokeLinejoin="round"
              transform="translate(-60 -52)"
            />
          </pattern>

          <pattern
            id="heroHexTileLg"
            width="200"
            height="173"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(30 10)"
          >
            <path
              d="M100 6 L182 53 L182 126 L100 173 L18 126 L18 53 Z"
              fill="none"
              stroke="#94a3b8"
              strokeOpacity="0.1"
              strokeWidth="0.85"
              strokeLinejoin="round"
            />
          </pattern>

          {/* Fade mesh out toward edges — keeps content area clean */}
          <radialGradient id="heroHexReveal" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="40%" stopColor="white" stopOpacity="0" />
            <stop offset="75%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>

          <linearGradient id="heroHexTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="14%" stopColor="white" stopOpacity="0.75" />
            <stop offset="32%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="heroHexBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="58%" stopColor="white" stopOpacity="0" />
            <stop offset="85%" stopColor="white" stopOpacity="0.7" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="heroHexSides" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="10%" stopColor="white" stopOpacity="0" />
            <stop offset="90%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#heroHexTileLg)" />
        <rect width="100%" height="100%" fill="url(#heroHexTile)" />
        <rect width="100%" height="100%" fill="url(#heroHexReveal)" />
        <rect width="100%" height="100%" fill="url(#heroHexTop)" />
        <rect width="100%" height="100%" fill="url(#heroHexBottom)" />
        <rect width="100%" height="100%" fill="url(#heroHexSides)" />
      </svg>
    </div>
  );
}
