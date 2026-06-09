export default function ChessGraffiti() {
  return (
    <div className="w-full py-12 flex justify-center">
      <svg
        viewBox="0 0 800 200"
        className="w-full max-w-3xl"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
      >
        {/* Background graffiti effect */}
        <defs>
          <filter id="roughen">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#ff4444", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#cc0000", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#990000", stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Outline effect (graffiti style) */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-7xl font-black"
          fill="none"
          stroke="#000"
          strokeWidth="4"
          fontFamily="Arial, sans-serif"
          letterSpacing="-2"
          style={{ filter: "url(#roughen)", opacity: 0.3 }}
        >
          Café
        </text>

        {/* Main text with gradient */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-7xl font-black"
          fill="url(#grad1)"
          stroke="#222"
          strokeWidth="2"
          fontFamily="Arial, sans-serif"
          letterSpacing="-2"
        >
          Café
        </text>

        {/* Second line - Chess Master */}
        <text
          x="50%"
          y="120"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-4xl font-bold"
          fill="#ffffff"
          stroke="#cc0000"
          strokeWidth="1"
          fontFamily="Arial, sans-serif"
          letterSpacing="2"
        >
          Chess Master
        </text>

        {/* Decorative elements */}
        <circle cx="80" cy="80" r="8" fill="#ffaa00" opacity="0.8" />
        <circle cx="720" cy="100" r="6" fill="#ffaa00" opacity="0.8" />
        <circle cx="100" cy="140" r="5" fill="#00ff00" opacity="0.6" />
        <circle cx="700" cy="130" r="5" fill="#00ff00" opacity="0.6" />

        {/* Spray paint lines */}
        <line x1="40" y1="160" x2="120" y2="165" stroke="#ff4444" strokeWidth="3" opacity="0.7" />
        <line x1="680" y1="155" x2="760" y2="160" stroke="#ff4444" strokeWidth="3" opacity="0.7" />
      </svg>
    </div>
  );
}
