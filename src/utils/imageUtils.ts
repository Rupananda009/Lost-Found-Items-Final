// Helper to generate clean, high-fidelity standalone SVG data URLs for categories and items
// Ensures an item NEVER receives a mismatched fallback image (e.g. Watch NEVER gets a Wallet image)

export function getCategoryPlaceholderSvg(category: string, itemName = ''): string {
  const catLower = (category || '').toLowerCase();
  const nameLower = (itemName || '').toLowerCase();

  // Watch / Timepiece detection
  if (
    nameLower.includes('watch') ||
    nameLower.includes('fastrack') ||
    nameLower.includes('titan') ||
    nameLower.includes('rolex') ||
    nameLower.includes('casio') ||
    nameLower.includes('smartwatch') ||
    nameLower.includes('fossil') ||
    nameLower.includes('timepiece')
  ) {
    return generateWatchSvg();
  }

  // Phone / Smartphone detection
  if (
    nameLower.includes('phone') ||
    nameLower.includes('mobile') ||
    nameLower.includes('iphone') ||
    nameLower.includes('samsung') ||
    nameLower.includes('pixel') ||
    nameLower.includes('oneplus') ||
    nameLower.includes('redmi') ||
    nameLower.includes('realme') ||
    nameLower.includes('smartphone')
  ) {
    return generatePhoneSvg();
  }

  // Wallet / Purse detection
  if (nameLower.includes('wallet') || nameLower.includes('purse') || nameLower.includes('billfold') || nameLower.includes('money clip')) {
    return generateWalletSvg();
  }

  // Keys detection
  if (nameLower.includes('key') || nameLower.includes('fob') || nameLower.includes('keychain')) {
    return generateKeysSvg();
  }

  // Bag / Backpack detection
  if (nameLower.includes('bag') || nameLower.includes('backpack') || nameLower.includes('pouch') || nameLower.includes('sack') || nameLower.includes('luggage')) {
    return generateBagSvg();
  }

  // ID Card / Student Card / Documents detection
  if (
    nameLower.includes('id') ||
    nameLower.includes('card') ||
    nameLower.includes('license') ||
    nameLower.includes('document') ||
    nameLower.includes('certificate') ||
    nameLower.includes('hall ticket') ||
    nameLower.includes('pass')
  ) {
    return generateIdCardSvg();
  }

  // Books / Notes detection
  if (nameLower.includes('book') || nameLower.includes('notebook') || nameLower.includes('diary') || nameLower.includes('register') || nameLower.includes('textbook')) {
    return generateBookSvg();
  }

  // Headphones / Earbuds / Audio detection
  if (nameLower.includes('airpod') || nameLower.includes('earphone') || nameLower.includes('headphone') || nameLower.includes('earbud') || nameLower.includes('buds')) {
    return generateAudioSvg();
  }

  // Category switch
  switch (catLower) {
    case 'accessories':
      return nameLower.includes('belt') || nameLower.includes('cap') ? generateGenericSvg('Accessories') : generateWatchSvg();
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
      return generateGenericSvg(category || 'Personal Item');
  }
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateWatchSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_watch" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="gold_watch" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_watch)"/>
    <!-- Watch Strap Top -->
    <rect x="175" y="35" width="50" height="75" rx="5" fill="#334155"/>
    <line x1="175" y1="60" x2="225" y2="60" stroke="#475569" stroke-width="2"/>
    <line x1="175" y1="80" x2="225" y2="80" stroke="#475569" stroke-width="2"/>
    <!-- Watch Strap Bottom -->
    <rect x="175" y="190" width="50" height="75" rx="5" fill="#334155"/>
    <line x1="175" y1="215" x2="225" y2="215" stroke="#475569" stroke-width="2"/>
    <line x1="175" y1="235" x2="225" y2="235" stroke="#475569" stroke-width="2"/>
    <!-- Watch Case -->
    <circle cx="200" cy="150" r="56" fill="#1e293b" stroke="url(#gold_watch)" stroke-width="6"/>
    <!-- Inner Dial -->
    <circle cx="200" cy="150" r="47" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <!-- Hour Markers -->
    <circle cx="200" cy="112" r="3.5" fill="#fbbf24"/>
    <circle cx="238" cy="150" r="3.5" fill="#fbbf24"/>
    <circle cx="200" cy="188" r="3.5" fill="#fbbf24"/>
    <circle cx="162" cy="150" r="3.5" fill="#fbbf24"/>
    <!-- Hands -->
    <line x1="200" y1="150" x2="200" y2="124" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="200" y1="150" x2="222" y2="150" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="200" cy="150" r="4.5" fill="#ffffff"/>
    <text x="200" y="280" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">WRIST WATCH · ACCESSORIES</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateWalletSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_wallet" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#261a10"/>
        <stop offset="100%" stop-color="#140d07"/>
      </linearGradient>
      <linearGradient id="leather_wallet" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#92400e"/>
        <stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_wallet)"/>
    <!-- Wallet Body -->
    <rect x="120" y="90" width="160" height="120" rx="12" fill="url(#leather_wallet)" stroke="#b45309" stroke-width="3"/>
    <!-- Stitching -->
    <rect x="126" y="96" width="148" height="108" rx="8" fill="none" stroke="#fcd34d" stroke-width="1.5" stroke-dasharray="4 3"/>
    <!-- Fold flap -->
    <path d="M 230 130 L 280 130 L 280 170 L 230 170 C 220 170 220 130 230 130 Z" fill="#451a03" stroke="#b45309" stroke-width="2"/>
    <circle cx="235" cy="150" r="6" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
    <text x="200" y="255" fill="#f59e0b" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">WALLET · LEATHER GOODS</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generatePhoneSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_phone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <linearGradient id="screen_phone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2563eb"/>
        <stop offset="50%" stop-color="#4f46e5"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_phone)"/>
    <!-- Phone Body -->
    <rect x="155" y="55" width="90" height="175" rx="14" fill="#334155" stroke="#64748b" stroke-width="3"/>
    <!-- Screen -->
    <rect x="162" y="67" width="76" height="151" rx="8" fill="url(#screen_phone)"/>
    <circle cx="200" cy="75" r="3" fill="#0f172a"/>
    <rect x="185" y="210" width="30" height="3" rx="1.5" fill="#ffffff" opacity="0.8"/>
    <text x="200" y="265" fill="#93c5fd" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">SMARTPHONE · ELECTRONICS</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateKeysSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_keys" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#27272a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_keys)"/>
    <circle cx="160" cy="140" r="35" fill="none" stroke="#a1a1aa" stroke-width="8"/>
    <circle cx="200" cy="140" r="22" fill="none" stroke="#fbbf24" stroke-width="7"/>
    <rect x="220" y="137" width="60" height="7" fill="#fbbf24"/>
    <rect x="260" y="144" width="6" height="10" fill="#fbbf24"/>
    <rect x="272" y="144" width="6" height="14" fill="#fbbf24"/>
    <rect x="120" y="150" width="40" height="60" rx="8" fill="#3f3f46" stroke="#71717a" stroke-width="2"/>
    <circle cx="140" cy="170" r="5" fill="#ef4444"/>
    <text x="200" y="255" fill="#a1a1aa" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">KEYS & KEYCHAINS</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateBagSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_bag" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c4a6e"/>
        <stop offset="100%" stop-color="#082f49"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_bag)"/>
    <path d="M 175 90 C 175 70 225 70 225 90" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    <path d="M 150 110 C 150 90 250 90 250 110 L 260 210 C 260 225 245 230 200 230 C 155 230 140 225 140 210 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>
    <rect x="160" y="155" width="80" height="55" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
    <line x1="165" y1="165" x2="235" y2="165" stroke="#bae6fd" stroke-width="2"/>
    <text x="200" y="265" fill="#7dd3fc" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">BAGS · BACKPACK · LUGGAGE</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateIdCardSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_id" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#134e4a"/>
        <stop offset="100%" stop-color="#042f2e"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_id)"/>
    <rect x="190" y="60" width="20" height="6" rx="3" fill="#14b8a6"/>
    <rect x="130" y="75" width="140" height="145" rx="10" fill="#ffffff" stroke="#14b8a6" stroke-width="3"/>
    <rect x="130" y="75" width="140" height="34" rx="10" fill="#0d9488"/>
    <text x="200" y="96" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">PRAGATI ENG COLLEGE</text>
    <rect x="145" y="122" width="40" height="45" rx="4" fill="#ccfbf1" stroke="#5eead4" stroke-width="1.5"/>
    <circle cx="165" cy="138" r="9" fill="#0d9488"/>
    <path d="M 152 162 C 152 153 178 153 178 162" fill="#0d9488"/>
    <line x1="195" y1="133" x2="255" y2="133" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="195" y1="146" x2="245" y2="146" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <line x1="195" y1="159" x2="235" y2="159" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <line x1="145" y1="195" x2="255" y2="195" stroke="#0f172a" stroke-width="10" stroke-dasharray="3 2 1 3 2 1 4 2"/>
    <text x="200" y="260" fill="#5eead4" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">COLLEGE ID CARD · DOCUMENTS</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateBookSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_book" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#311042"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_book)"/>
    <path d="M 140 110 C 170 100 195 110 200 115 C 205 110 230 100 260 110 L 260 190 C 230 180 205 190 200 195 C 195 190 170 180 140 190 Z" fill="#f8fafc" stroke="#a855f7" stroke-width="3"/>
    <line x1="200" y1="115" x2="200" y2="195" stroke="#9333ea" stroke-width="2"/>
    <line x1="155" y1="130" x2="185" y2="125" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="155" y1="145" x2="185" y2="140" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="155" y1="160" x2="185" y2="155" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="215" y1="125" x2="245" y2="130" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="215" y1="140" x2="245" y2="145" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="215" y1="155" x2="245" y2="160" stroke="#cbd5e1" stroke-width="2"/>
    <text x="200" y="255" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">BOOKS & NOTEBOOKS</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateClothingSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_cloth" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14532d"/>
        <stop offset="100%" stop-color="#052e16"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_cloth)"/>
    <path d="M 160 85 L 180 95 C 190 100 210 100 220 95 L 240 85 L 270 120 L 245 135 L 240 120 L 240 215 L 160 215 L 160 120 L 155 135 L 130 120 Z" fill="#15803d" stroke="#4ade80" stroke-width="3"/>
    <text x="200" y="255" fill="#86efac" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">CLOTHING & APPAREL</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateJewelrySvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_jewel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4c0519"/>
        <stop offset="100%" stop-color="#2a040e"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_jewel)"/>
    <circle cx="200" cy="165" r="40" fill="none" stroke="#f59e0b" stroke-width="8"/>
    <polygon points="200,95 225,120 200,145 175,120" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/>
    <line x1="175" y1="120" x2="225" y2="120" stroke="#ffffff" stroke-width="1.5"/>
    <text x="200" y="255" fill="#f43f5e" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">JEWELRY & VALUABLES</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateAudioSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_audio" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#27272a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_audio)"/>
    <!-- Headband -->
    <path d="M 140 150 A 60 60 0 0 1 260 150" fill="none" stroke="#60a5fa" stroke-width="8" stroke-linecap="round"/>
    <!-- Ear cups -->
    <rect x="130" y="140" width="22" height="42" rx="10" fill="#2563eb" stroke="#93c5fd" stroke-width="2"/>
    <rect x="248" y="140" width="22" height="42" rx="10" fill="#2563eb" stroke="#93c5fd" stroke-width="2"/>
    <text x="200" y="255" fill="#93c5fd" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">HEADPHONES · EARBUDS</text>
  </svg>`;
  return svgToDataUrl(svg);
}

export function generateGenericSvg(label: string): string {
  const cleanLabel = (label || 'ITEM').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bg_generic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg_generic)"/>
    <path d="M 200 90 L 260 120 L 260 190 L 200 220 L 140 190 L 140 120 Z" fill="#334155" stroke="#94a3b8" stroke-width="3"/>
    <path d="M 200 90 L 200 220" stroke="#94a3b8" stroke-width="2"/>
    <path d="M 200 150 L 140 120" stroke="#94a3b8" stroke-width="2"/>
    <path d="M 200 150 L 260 120" stroke="#94a3b8" stroke-width="2"/>
    <text x="200" y="260" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">${cleanLabel}</text>
  </svg>`;
  return svgToDataUrl(svg);
}

/**
 * Returns the proper display image for an item:
 * - If a custom image was uploaded (data:image or valid URL that doesn't mismatch), use it.
 * - If missing or empty or an old generic wallet fallback on a non-wallet item, return the accurate category/name SVG!
 */
export function getItemDisplayImage(item: { item_name?: string; category?: string; image_url?: string }): string {
  const itemName = item.item_name || '';
  const category = item.category || 'Other';
  const url = (item.image_url || '').trim();

  // If URL exists and is NOT the legacy mismatched wallet photo on non-wallet items
  if (url) {
    const isWalletPhoto = url.includes('item_leather_wallet');
    const isWatch = itemName.toLowerCase().includes('watch') || category.toLowerCase() === 'accessories';
    const isPhone = itemName.toLowerCase().includes('phone') || itemName.toLowerCase().includes('mobile');
    
    // If the legacy wallet photo was mistakenly assigned to a watch or phone or bag, replace it with correct SVG!
    if (isWalletPhoto && (isWatch || isPhone || category.toLowerCase() === 'bags' || category.toLowerCase() === 'books')) {
      return getCategoryPlaceholderSvg(category, itemName);
    }
    
    // If it's a generic hero image, replace with specific SVG
    if (url.includes('hero_lost_and_found')) {
      return getCategoryPlaceholderSvg(category, itemName);
    }

    return url;
  }

  // Fallback to accurate category SVG
  return getCategoryPlaceholderSvg(category, itemName);
}
