export interface Campaign {
  id: string;
  number: string;
  title: string;
  client: string;
  category: 'Product films' | 'Social content' | 'UGC campaigns' | 'Property stories';
  year: string;
  format: string;
  aspectRatio: string;
  metrics: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  specs: {
    camera: string;
    lens: string;
    colorGrade: string;
    deliverables: string;
  };
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'valkyrie-aura',
    number: '01',
    title: 'Aura Valkyrie: Nightfall Flight',
    client: 'Aura Automotive',
    category: 'Product films',
    year: '2026',
    format: '2.39:1 Anamorphic Cinema',
    aspectRatio: 'CinemaScope',
    metrics: '14.8M Organic Views • 98.2% Completion Rate',
    description: 'A nocturnal symphony of carbon fiber and violet light, tracking the electric hypercar through rain-soaked mountain switchbacks.',
    thumbnail: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&auto=format&fit=crop&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-through-a-dark-tunnel-at-night-42867-large.mp4',
    specs: {
      camera: 'Arri Alexa Mini LF',
      lens: 'Cooke Anamorphic /i Full Frame Plus',
      colorGrade: 'Kodak 5219 Vision3 Emulation',
      deliverables: '1x 90s Hero Film, 3x 15s Cutdowns, Stills Archive'
    }
  },
  {
    id: 'chronos-horology',
    number: '02',
    title: 'Nocturne Chrono: Mechanical Soul',
    client: 'Vault Geneva',
    category: 'Product films',
    year: '2026',
    format: '8K Ultra-Macro Optical',
    aspectRatio: '16:9 Master',
    metrics: 'Global Boutique Rollout • 4.2x Pre-order Target',
    description: 'High-speed macro cinematography revealing the microscopic heartbeat of a hand-finished tourbillon escapement.',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    specs: {
      camera: 'Phantom Flex4K (1000 FPS)',
      lens: 'Laowa 24mm T14 2X PeriProbe',
      colorGrade: 'Custom Midnight Violet Split-Tone',
      deliverables: 'Hero Brand Film, OOH Digital Billboards (Tokyo & Zurich)'
    }
  },
  {
    id: 'maison-parfum',
    number: '03',
    title: 'L’Élixir Du Soir: Sensory Velvet',
    client: 'Maison Violette Paris',
    category: 'UGC campaigns',
    year: '2026',
    format: '9:16 Directed Social Series',
    aspectRatio: 'Vertical 9:16',
    metrics: '32M Social Reach • #1 Trending Fragrance on TikTok',
    description: 'Bridging raw creator authenticity with studio-grade lighting and visceral sound design, capturing intimate olfactory moments.',
    thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&auto=format&fit=crop&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    specs: {
      camera: 'Sony FX3 + Cine Primes',
      lens: 'Zeiss Supreme Prime 35mm T1.5',
      colorGrade: 'Warm Film Stock Print emulation',
      deliverables: '12x Creator-Directed Capsules, Meta & TikTok Ads'
    }
  },
  {
    id: 'sanctum-alpine',
    number: '04',
    title: 'The Monolith Residence: High Alpine Living',
    client: 'Kaufmann Architectural Group',
    category: 'Property stories',
    year: '2025',
    format: 'Large Format Natural Light Cinema',
    aspectRatio: '2.0:1 Univisium',
    metrics: '$24.5M Estate Acquired in 18 Days Post-Premiere',
    description: 'An architectural chronicle charting daylight transitions across raw bush-hammered concrete, black timber, and Swiss mountain peaks.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-mountain-pass-surrounded-by-fog-42868-large.mp4',
    specs: {
      camera: 'RED V-Raptor 8K VV',
      lens: 'Atlas Orion Anamorphic Primes',
      colorGrade: 'Desaturated Charcoal & Cool Ambient Highlights',
      deliverables: '8-minute Documentary Film, 4K Web Interactive Asset'
    }
  },
  {
    id: 'kinetic-shibuya',
    number: '05',
    title: 'Aero Tokyo: Midnight Frequency',
    client: 'Aero Athletics',
    category: 'Social content',
    year: '2026',
    format: 'Hybrid 16mm Film + High-Speed Digital',
    aspectRatio: '4:5 / 9:16 Social Master',
    metrics: '21M Impressions • 410K Shares Across Instagram',
    description: 'Pulsing urban tempo through rain-slicked Tokyo streets, capturing the raw physical cadence of marathon runners under neon signage.',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-through-a-dark-tunnel-at-night-42867-large.mp4',
    specs: {
      camera: 'Arriflex 416 (16mm Kodak 500T) + FX6',
      lens: 'Super Speed Zeiss 16mm',
      colorGrade: 'High-contrast Halation & Deep Shadows',
      deliverables: 'Viral Capsule Series, Athlete Profile Vignettes'
    }
  },
  {
    id: 'hyperion-audio',
    number: '06',
    title: 'Zero Resonance: Kinetic Acoustic Field',
    client: 'Hyperion Acoustics',
    category: 'Product films',
    year: '2026',
    format: 'Precision CGI + Live Optical Compositing',
    aspectRatio: '2.39:1 CinemaScope',
    metrics: 'Award of Excellence: London International Film Craft',
    description: 'Visualizing invisible sound pressure waves cutting through silence with obsidian liquid simulations and violet laser arrays.',
    thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1600&auto=format&fit=crop&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-mountain-pass-surrounded-by-fog-42868-large.mp4',
    specs: {
      camera: 'Arri Alexa 35',
      lens: 'Leitz Hugo 50mm T1.0',
      colorGrade: 'Deep Monochrome Charcoal with Violet Highlights',
      deliverables: 'Global Keynote Launch Film, Retail Display Loops'
    }
  }
];

export interface StudioService {
  number: string;
  title: string;
  oneLineDesc: string;
  deliverablesTag: string;
  detail: string;
}

export const SERVICES: StudioService[] = [
  {
    number: '01',
    title: 'UGC campaigns',
    oneLineDesc: 'Creator-driven authenticity elevated with cinematic color science, deliberate narrative pacing, and verified conversion metrics.',
    deliverablesTag: 'TikTok • Meta Ads • Organic Viral',
    detail: 'We scout, direct, and post-produce high-velocity creator assets that bypass the uncanny valley of corporate ads while preserving prestige brand aesthetic.'
  },
  {
    number: '02',
    title: 'Product films',
    oneLineDesc: 'Widescreen macro lighting, tactile sound design, and industrial aesthetics crafted to immortalize flagship hardware and luxury objects.',
    deliverablesTag: 'Cinema 4K • Keynotes • OOH Billboards',
    detail: 'From motorized motion-control rigs to optical micro-lenses, we reveal precision textures, reflection geometry, and tactile material qualities.'
  },
  {
    number: '03',
    title: 'Social content',
    oneLineDesc: 'Platform-native vertical masterpieces engineered for algorithmic dominance, rapid retention, and unmistakable brand reverence.',
    deliverablesTag: '9:16 Vertical • 4:5 Feed • Multi-Cut Series',
    detail: 'Designed specifically for the first 1.2-second retention window, delivering immediate visual momentum and cultural resonance.'
  },
  {
    number: '04',
    title: 'Property stories',
    oneLineDesc: 'Immersive architectural chronicles exploring space, material texture, and changing natural light for world-class real estate.',
    deliverablesTag: 'Architectural Doc • High-Res Stills • Web Cinema',
    detail: 'We film estates as living sculptures—documenting diurnal light cycles, material materiality, and emotional lifestyle narrative.'
  }
];

export interface ProcessStep {
  number: string;
  title: string;
  shortDesc: string;
  focus: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Blueprint & Creative Direction',
    shortDesc: 'Narrative treatment decks, lens package curation, optical moodboards, and shot-by-shot technical pacing before touching a camera.',
    focus: 'Treatment • Location Scouting • Shot Lists'
  },
  {
    number: '02',
    title: 'Principal Production',
    shortDesc: 'On-set execution with large-format cinema camera rigs, anamorphic optics, calibrated lighting grids, and directed talent.',
    focus: 'Arri/RED Packages • Precision Lighting • Sound Rec'
  },
  {
    number: '03',
    title: 'High-End Post & Color Grade',
    shortDesc: 'Fine-cut offline editing, bespoke sound composition, tactile foley, 35mm grain integration, and master DaVinci color grading.',
    focus: 'DaVinci Resolve • Custom Audio • Motion Design'
  },
  {
    number: '04',
    title: 'Multi-Channel Delivery',
    shortDesc: 'Pristine 16:9 cinema masters, 9:16 vertical cuts, ProRes HQ archival masters, and complete global broadcast usage rights.',
    focus: 'ProRes 4444 • Social Cutdowns • Global Rights'
  }
];

export const STUDIO_METRICS = [
  { value: '180M+', label: 'Global Video Impressions' },
  { value: '4.8x', label: 'Average Client ROAS Uplift' },
  { value: '14', label: 'International Film & Design Honors' },
  { value: '99.4%', label: 'On-Time Master Delivery' },
];
