// Category-specific placeholder generator returning standalone SVG data URLs

export function getCategoryPlaceholderSvg(category: string, itemName = ''): string {
  const catLower = (category || '').toLowerCase();
  const nameLower = (itemName || '').toLowerCase();

  // Watch detection (even if category is Accessories or Other)
  if (nameLower.includes('watch') || nameLower.includes('fastrack') || nameLower.includes('titan') || nameLower.includes('rolex') || nameLower.includes('casio')) {
    return generateWatchSvg();
  }

  // Phone detection
  if (nameLower.includes('phone') || nameLower.includes('mobile') || nameLower.includes('iphone') || nameLower.includes('samsung') || nameLower.includes('pixel') || nameLower.includes('oneplus')) {
    return generatePhoneSvg();
  }

  // Wallet detection
  if (nameLower.includes('wallet') || nameLower.includes('purse') || nameLower.includes('billfold')) {
    return generateWalletSvg();
  }

  // Keys detection
  if (nameLower.includes('key') || nameLower.includes('fob') || nameLower.includes('keychain')) {
    return generateKeysSvg();
  }

  // Bag detection
  if (nameLower.includes('bag') || nameLower.includes('backpack') || nameLower.includes('pouch') || nameLower.includes('sack')) {
    return generateBagSvg();
  }

  // ID / Document detection
  if (nameLower.includes('id') || nameLower.includes('card') || nameLower.includes('license') || nameLower.includes('document') || nameLower.includes('certificate')) {
    return generateIdCardSvg();
  }

  // Books detection
  if (nameLower.includes('book') || nameLower.includes('notebook') || nameLower.includes('diary') || nameLower.includes('register')) {
    return generateBookSvg();
  }

  switch (catLower) {
    case 'accessories':
      return generateWatchSvg();
    case 'wallet':
      return generateWalletSvg();
    case 'electronics':
      return generatePhoneSvg();
    case 'keys':
      return generateKeysSvg();
    case 'bags':
      return generateBagSvg();
    case 'documents':
      return generateIdCardSvg();
    case 'books':
      return generateBookSvg();
    case 'clothing':
      return generateClothingSvg();
    case 'jewelry':
      return generateJewelrySvg();
    default:
      return generateGenericSvg(category || 'Item');
  }
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateWatchSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Watch Strap Top -->
    <rect x="175" y="40" width="50" height="70" rx="4" fill="#334155"/>
    <line x1="175" y1="65" x2="225" y2="65" stroke="#475569" stroke-width="2"/>
    <line x1="175" y1="85" x2="225" y2="85" stroke="#475569" stroke-width="2"/>
    <!-- Watch Strap Bottom -->
    <rect x="175" y="190" width="50" height="70" rx="4" fill="#334155"/>
    <line x1="175" y1="215" x2="225" y2="215" stroke="#475569" stroke-width="2"/>
    <line x1="175" y1="235" x2="225" y2="235" stroke="#475569" stroke-width="2"/>
    <!-- Watch Case -->
    <circle cx="200" cy="150" r="55" fill="#1e293b" stroke="url(#gold)" stroke-width="6"/>
    <!-- Inner Dial -->
    <circle cx="200" cy="150" r="46" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <!-- Hour Markers -->
    <circle cx="200" cy="112" r="3" fill="#fbbf24"/>
    <circle cx="238" cy="150" r="3" fill="#fbbf24"/>
    <circle cx="200" cy="188" r="3" fill="#fbbf24"/>
    <circle cx="162" cy="150" r="3" fill="#fbbf24"/>
    <!-- Hands -->
    <line x1="200" y1="150" x2="200" y2="125" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    <line x1="200" y1="150" x2="220" y2="150" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <circle cx="200" cy="150" r="4" fill="#ffffff"/>
    <!-- Text -->
    <text x="200" y="280" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">ACCESSORIES · WRIST WATCH</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generateWalletSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2d1b0f"/>
        <stop offset="100%" stop-color="#18110b"/>
      </linearGradient>
      <linearGradient id="leather" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#854d0e"/>
        <stop offset="100%" stop-color="#713f12"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Wallet Body -->
    <rect x="120" y="90" width="160" height="120" rx="12" fill="url(#leather)" stroke="#a16207" stroke-width="3"/>
    <!-- Stitching -->
    <rect x="126" y="96" width="148" height="108" rx="8" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="4 3"/>
    <!-- Fold flap -->
    <path d="M 230 130 L 280 130 L 280 170 L 230 170 C 220 170 220 130 230 130 Z" fill="#5c330a" stroke="#a16207" stroke-width="2"/>
    <!-- Clasp button -->
    <circle cx="235" cy="150" r="6" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
    <text x="200" y="250" fill="#a16207" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">WALLET · LEATHER GOODS</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generatePhoneSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="50%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#9333ea"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Phone Body -->
    <rect x="155" y="60" width="90" height="170" rx="14" fill="#334155" stroke="#64748b" stroke-width="3"/>
    <!-- Screen -->
    <rect x="162" y="72" width="76" height="146" rx="8" fill="url(#screen)"/>
    <!-- Camera Notch -->
    <circle cx="200" cy="80" r="3" fill="#0f172a"/>
    <!-- Home Bar -->
    <rect x="185" y="210" width="30" height="3" rx="1.5" fill="#ffffff" opacity="0.8"/>
    <text x="200" y="265" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">ELECTRONICS · SMARTPHONE</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generateKeysSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#27272a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Key ring -->
    <circle cx="160" cy="140" r="35" fill="none" stroke="#a1a1aa" stroke-width="8"/>
    <!-- Key 1 -->
    <circle cx="200" cy="140" r="22" fill="none" stroke="#fbbf24" stroke-width="7"/>
    <rect x="220" y="137" width="60" height="7" fill="#fbbf24"/>
    <rect x="260" y="144" width="6" height="10" fill="#fbbf24"/>
    <rect x="272" y="144" width="6" height="14" fill="#fbbf24"/>
    <!-- Key 2 (fob) -->
    <rect x="120" y="150" width="40" height="60" rx="8" fill="#3f3f46" stroke="#71717a" stroke-width="2"/>
    <circle cx="140" cy="170" r="5" fill="#ef4444"/>
    <text x="200" y="255" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">KEYS · FOBS · LOCKS</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generateBagSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c4a6e"/>
        <stop offset="100%" stop-color="#082f49"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Top handle -->
    <path d="M 175 90 C 175 70 225 70 225 90" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    <!-- Backpack body -->
    <path d="M 150 110 C 150 90 250 90 250 110 L 260 210 C 260 225 245 230 200 230 C 155 230 140 225 140 210 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>
    <!-- Front pocket -->
    <rect x="160" y="155" width="80" height="55" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
    <line x1="165" y1="165" x2="235" y2="165" stroke="#bae6fd" stroke-width="2"/>
    <text x="200" y="265" fill="#7dd3fc" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">BAGS · BACKPACKS · LUGGAGE</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generateIdCardSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#134e4a"/>
        <stop offset="100%" stop-color="#042f2e"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Lanyard hole -->
    <rect x="190" y="65" width="20" height="6" rx="3" fill="#14b8a6"/>
    <!-- ID Card -->
    <rect x="130" y="80" width="140" height="140" rx="10" fill="#ffffff" stroke="#14b8a6" stroke-width="3"/>
    <!-- Header band -->
    <rect x="130" y="80" width="140" height="32" rx="10" fill="#0d9488"/>
    <text x="200" y="100" fill="#ffffff" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" text-anchor="middle">PRAGATI ENG COLLEGE</text>
    <!-- Photo placeholder -->
    <rect x="145" y="125" width="40" height="45" rx="4" fill="#ccfbf1" stroke="#5eead4" stroke-width="1.5"/>
    <circle cx="165" cy="140" r="10" fill="#0d9488"/>
    <path d="M 152 165 C 152 155 178 155 178 165" fill="#0d9488"/>
    <!-- Lines -->
    <line x1="195" y1="135" x2="255" y2="135" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="195" y1="148" x2="245" y2="148" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <line x1="195" y1="161" x2="235" y2="161" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <!-- Barcode -->
    <line x1="145" y1="195" x2="255" y2="195" stroke="#0f172a" stroke-width="12" stroke-dasharray="3 2 1 3 2 1 4 2"/>
    <text x="200" y="260" fill="#5eead4" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">DOCUMENTS · ID CARD</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generateBookSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#311042"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Book open -->
    <path d="M 140 110 C 170 100 195 110 200 115 C 205 110 230 100 260 110 L 260 190 C 230 180 205 190 200 195 C 195 190 170 180 140 190 Z" fill="#f8fafc" stroke="#a855f7" stroke-width="3"/>
    <line x1="200" y1="115" x2="200" y2="195" stroke="#9333ea" stroke-width="2"/>
    <!-- Page text lines -->
    <line x1="155" y1="130" x2="185" y2="125" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="155" y1="145" x2="185" y2="140" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="155" y1="160" x2="185" y2="155" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="215" y1="125" x2="245" y2="130" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="215" y1="140" x2="245" y2="145" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="215" y1="155" x2="245" y2="160" stroke="#cbd5e1" stroke-width="2"/>
    <text x="200" y="255" fill="#c084fc" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">BOOKS · TEXTBOOKS · NOTES</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generateClothingSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14532d"/>
        <stop offset="100%" stop-color="#052e16"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- T-shirt shape -->
    <path d="M 160 85 L 180 95 C 190 100 210 100 220 95 L 240 85 L 270 120 L 245 135 L 240 120 L 240 215 L 160 215 L 160 120 L 155 135 L 130 120 Z" fill="#15803d" stroke="#4ade80" stroke-width="3"/>
    <text x="200" y="255" fill="#86efac" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">CLOTHING · APPAREL · WEAR</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generateJewelrySvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4c0519"/>
        <stop offset="100%" stop-color="#2a040e"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Diamond ring -->
    <circle cx="200" cy="165" r="40" fill="none" stroke="#f59e0b" stroke-width="8"/>
    <!-- Diamond gem -->
    <polygon points="200,95 225,120 200,145 175,120" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/>
    <line x1="175" y1="120" x2="225" y2="120" stroke="#ffffff" stroke-width="1.5"/>
    <text x="200" y="255" fill="#f43f5e" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">JEWELRY · VALUABLES</text>
  </svg>`;
  return svgToDataUrl(svg);
}

function generateGenericSvg(label: string): string {
  const cleanLabel = (label || 'ITEM').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <!-- Box icon -->
    <path d="M 200 90 L 260 120 L 260 190 L 200 220 L 140 190 L 140 120 Z" fill="#334155" stroke="#94a3b8" stroke-width="3"/>
    <path d="M 200 90 L 200 220" stroke="#94a3b8" stroke-width="2"/>
    <path d="M 200 150 L 140 120" stroke="#94a3b8" stroke-width="2"/>
    <path d="M 200 150 L 260 120" stroke="#94a3b8" stroke-width="2"/>
    <text x="200" y="260" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1">${cleanLabel}</text>
  </svg>`;
  return svgToDataUrl(svg);
}
