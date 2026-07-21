/**
 * Soft single-layer hex field — one nest, lightly visible behind the hero.
 */
export default function HeroHexBackground() {
  return (
    <div
      className="hero-hex-bg pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-white" />

      <svg
        className="hero-hex-mesh absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="heroHexTile"
            width="110"
            height="95"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M55 4 L103 32 L103 68 L55 96 L7 68 L7 32 Z"
              fill="none"
              stroke="#64748b"
              strokeOpacity="0.14"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M110 51.5 L158 79.5 L158 115.5 L110 143.5 L62 115.5 L62 79.5 Z"
              fill="none"
              stroke="#64748b"
              strokeOpacity="0.11"
              strokeWidth="1"
              strokeLinejoin="round"
              transform="translate(-55 -47.5)"
            />
          </pattern>

          <radialGradient id="heroHexReveal" cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="60%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.85" />
          </radialGradient>

          <linearGradient id="heroHexTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="18%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="heroHexBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="78%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#heroHexTile)" />
        <rect width="100%" height="100%" fill="url(#heroHexReveal)" />
        <rect width="100%" height="100%" fill="url(#heroHexTop)" />
        <rect width="100%" height="100%" fill="url(#heroHexBottom)" />
      </svg>
    </div>
  );
}
