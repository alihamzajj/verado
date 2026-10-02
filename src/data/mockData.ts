import { Project, User, ActivityItem, CodeFile } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'shoecheck',
    name: 'ShoeCheck AI',
    tagline: 'Instant Sneaker Legit-Check & Condition Analyzer',
    shortDescription: 'AI-driven computer vision app that verifies authentic sneakers, scans stitching flaws, and assesses resale condition in seconds.',
    fullDescription: 'ShoeCheck AI leverages deep convolutional neural networks trained on over 2.5 million verified footwear samples. By capturing 6 high-angle macro photos, sneaker collectors and resellers can instantly detect counterfeit batch variations, stitching anomalies, box label barcode discrepancies, and UV watermark irregularities. Designed for seamless on-the-go inspections at sneaker conventions and resale shops.',
    logo: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      'Multi-Angle Macro Neural Scanner (99.4% accuracy)',
      'Box Label & RFID/NFC Tag Authenticator',
      'Real-Time Resale Market Value Estimator (StockX & GOAT Sync)',
      'Digital Certificate of Authenticity (Cryptographically Signed PDF)',
      'Condition Grade Calculator (Deadstock, V-NDS, Worn)',
      'Offline Neural Inference Mode for Sneaker Cons'
    ],
    technologies: ['Flutter', 'Dart', 'TensorFlow Lite', 'PyTorch', 'CoreML', 'FastAPI', 'Google Cloud Vision'],
    platforms: 'Android + iOS',
    category: 'AI & Computer Vision',
    featured: true,
    published: true,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.apexstudio.shoecheck',
    appStoreUrl: 'https://apps.apple.com/app/shoecheck-ai-authenticator/id168892100',
    websiteUrl: 'https://shoecheck.app',
    githubUrl: 'https://github.com/apex-studio/shoecheck-core',
    rating: 4.9,
    reviewsCount: 14200,
    downloads: '850K+',
    version: '3.2.1',
    size: '48.2 MB',
    minAndroid: 'Android 9.0 (Pie)',
    minIos: 'iOS 15.0 or later',
    lastUpdated: 'Sep 24, 2026',
    accentColor: '#f97316',
    badge: 'Trending #1',
  },
  {
    id: 'foodai',
    name: 'FoodAI Nutritionist',
    tagline: 'Snap your plate, decode macro nutrients instantly',
    shortDescription: 'Computer vision camera that recognizes ingredients, portions, and computes macros, glycemic load, and allergen warnings automatically.',
    fullDescription: 'Say goodbye to tedious manual food logging. Point your camera at any meal—from homemade dishes to restaurant buffets—and FoodAI identifies individual ingredients, estimates portion volume using depth sensing, and generates precision macronutrient breakdowns in real time. Features personalized dietary advice tailored for diabetics, keto enthusiasts, and athletes.',
    logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      '3D Volumetric Portion Size Estimation using LiDAR & Camera',
      'Recognition for 12,000+ Global Cuisines and Complex Recipes',
      'Barcode & Menu Scanning with Instant Allergen Alerts',
      'Micronutrient & Vitamin Synthesis Dashboard',
      'Apple Health, Google Fit & Whoop Two-Way Synchronization',
      'Smart Grocery List Generator based on Calorie Goals'
    ],
    technologies: ['React Native', 'TypeScript', 'YOLOv10', 'ONNX Runtime', 'FastAPI', 'Node.js', 'PostgreSQL'],
    platforms: 'Android + iOS',
    category: 'AI & Computer Vision',
    featured: true,
    published: true,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.apexstudio.foodai',
    appStoreUrl: 'https://apps.apple.com/app/foodai-nutrition-scanner/id159938211',
    websiteUrl: 'https://foodai.health',
    githubUrl: 'https://github.com/apex-studio/foodai-mobile',
    rating: 4.8,
    reviewsCount: 38400,
    downloads: '1.4M+',
    version: '2.8.0',
    size: '54.6 MB',
    minAndroid: 'Android 10.0',
    minIos: 'iOS 16.0 or later',
    lastUpdated: 'Sep 20, 2026',
    accentColor: '#10b981',
    badge: 'Editors Choice',
  },
  {
    id: 'pulsefit-tracker',
    name: 'PulseFit Pro',
    tagline: 'Adaptive HIIT & Bio-Sensor Fitness Coach',
    shortDescription: 'Smart workout companion with audio coaching, wearable heart rate zone tracking, and automated rep counting via device gyroscope.',
    fullDescription: 'PulseFit Pro elevates personal fitness by transforming your phone into an intelligent personal trainer. Connect with Apple Watch, Wear OS, or Bluetooth chest straps to receive real-time audio guidance when your heart rate dips out of your target anaerobic zone. Built-in accelerometer algorithms automatically log barbell, dumbbell, and calisthenics reps without manual input.',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      'Real-time Biometric HR Zone Training (Zones 1 through 5)',
      'Automated Gyroscope Rep & Set Counting for 200+ Exercises',
      'AI Adaptive Rest Timers calibrated to your cardiovascular recovery',
      'Custom Voice Coaching with customizable sound cues',
      'Apple Watch & Wear OS standalone companion apps',
      'Detailed Muscle Fatigue Heatmaps & Strain Recovery Score'
    ],
    technologies: ['Swift', 'SwiftUI', 'Kotlin Multiplatform', 'CoreBluetooth', 'HealthKit', 'WatchKit'],
    platforms: 'Android + iOS',
    category: 'Health & Fitness',
    featured: true,
    published: true,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.apexstudio.pulsefit',
    appStoreUrl: 'https://apps.apple.com/app/pulsefit-pro-hiit-trainer/id143098711',
    websiteUrl: 'https://pulsefit.pro',
    githubUrl: 'https://github.com/apex-studio/pulsefit-tracker',
    rating: 4.9,
    reviewsCount: 22100,
    downloads: '920K+',
    version: '4.1.2',
    size: '62.1 MB',
    minAndroid: 'Android 10.0',
    minIos: 'iOS 15.4 or later',
    lastUpdated: 'Sep 18, 2026',
    accentColor: '#ec4899',
    badge: 'Popular',
  },
  {
    id: 'spendwise',
    name: 'SpendWise Manager',
    tagline: 'Zero-Effort Automated Expense & Net Worth Ledger',
    shortDescription: 'Bank-grade encrypted personal finance app that categorizes transactions, predicts bills, and calculates your true liquid runway.',
    fullDescription: 'Take complete command of your financial future. SpendWise automatically connects to over 14,000 banks across North America and Europe via open banking APIs. Our privacy-first engine categorizes transactions on-device, predicts upcoming subscription renewals, alerts you to hidden price increases, and models long-term financial independence milestones.',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      'Open Banking Sync with Plaid & MX API (SOC-2 Type II Certified)',
      'Smart Subscription Audit & 1-Tap Cancellation Reminders',
      'Cash Runway & Burn-Rate Projections',
      'Custom Multi-Currency & Crypto Portfolio Tracking',
      'Receipt Scanning OCR with Auto Tax-Deduction Tagging',
      'Biometric Vault with AES-256 Client-Side Enclave Encryption'
    ],
    technologies: ['Flutter', 'Dart', 'Rust FFI', 'SQLite', 'Plaid API', 'Go (Golang)'],
    platforms: 'Android + iOS',
    category: 'Finance & Crypto',
    featured: false,
    published: true,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.apexstudio.spendwise',
    appStoreUrl: 'https://apps.apple.com/app/spendwise-money-manager/id152912440',
    websiteUrl: 'https://spendwise.finance',
    githubUrl: 'https://github.com/apex-studio/spendwise-mobile',
    rating: 4.7,
    reviewsCount: 16900,
    downloads: '610K+',
    version: '3.0.4',
    size: '39.8 MB',
    minAndroid: 'Android 8.0',
    minIos: 'iOS 14.0 or later',
    lastUpdated: 'Sep 12, 2026',
    accentColor: '#3b82f6',
  },
  {
    id: 'brainwave-ai',
    name: 'BrainWave AI Study',
    tagline: 'Transform lectures & textbooks into interactive mastery',
    shortDescription: 'AI study companion that converts PDFs, YouTube lectures, and messy handwritten notes into spaced-repetition flashcards and quizzes.',
    fullDescription: 'Study half the time, retain twice as much. BrainWave AI ingests academic textbooks, research papers, and 2-hour lecture audio recordings, extracting key concepts, synthesizing interactive mind maps, and deploying SuperMemo-2 spaced repetition flashcards. Features an interactive AI Tutor ready to clarify difficult formulas with step-by-step Socratic guidance.',
    logo: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      'Instant PDF, EPUB & Handwritten Note Summarization',
      'Lecture Audio Transcription & Automated Diagram Extraction',
      'Spaced Repetition Algorithm (SM-2 / Anki Cross-Compatible)',
      'Socratic AI Homework & Exam Simulator with Instant Feedback',
      'Multiplayer Study Rooms with Real-Time Quiz Battles',
      'Offline Audio Reader with Natural Human Voice Clones'
    ],
    technologies: ['React Native', 'TypeScript', 'LangChain', 'Whisper AI', 'Supabase', 'Vector DB'],
    platforms: 'Android + iOS',
    category: 'Productivity & Tools',
    featured: true,
    published: true,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.apexstudio.brainwave',
    appStoreUrl: 'https://apps.apple.com/app/brainwave-ai-study-flashcards/id164998120',
    websiteUrl: 'https://brainwave.study',
    githubUrl: 'https://github.com/apex-studio/brainwave-app',
    rating: 4.9,
    reviewsCount: 41200,
    downloads: '1.8M+',
    version: '2.5.0',
    size: '51.3 MB',
    minAndroid: 'Android 10.0',
    minIos: 'iOS 15.0 or later',
    lastUpdated: 'Sep 27, 2026',
    accentColor: '#8b5cf6',
    badge: 'Campus Top Pick',
  },
  {
    id: 'horizon-rover',
    name: 'Horizon Rover',
    tagline: 'AR Mountain Trail Navigation & Offline Survival Topo',
    shortDescription: 'High-precision 3D topographic GPS navigator with Augmented Reality peak identification, offline satellite caches, and emergency breadcrumbs.',
    fullDescription: 'Never lose your bearings in the backcountry. Horizon Rover provides ultra-detailed 1:24,000 scale USGS topographic maps that cache completely offline. Raise your phone camera to look through our AR PeakFinder lens to identify mountain summits, ridgelines, and water springs up to 40 miles away. Includes satellite beacon simulation and solar daylight countdowns.',
    logo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      'Offline Vector Topo & High-Res Satellite Imagery (Zero Signal required)',
      'AR PeakFinder: Identify 100,000+ Mountain Summits & Passes',
      'Elevation Profile & Real-Time Incline Gradient HUD',
      'Safety Breadcrumb Trail with Auto Return-To-Camp Compass',
      'Live Weather Radar & Alpine Storm Inversion Warnings',
      'GPX / KML Route Import & Export with Garmin Integration'
    ],
    technologies: ['Swift', 'Metal', 'ARKit', 'MapLibre GL', 'CoreLocation', 'C++'],
    platforms: 'iOS',
    category: 'Travel & Navigation',
    featured: false,
    published: true,
    playStoreUrl: '',
    appStoreUrl: 'https://apps.apple.com/app/horizon-rover-ar-trails/id149928177',
    websiteUrl: 'https://horizonrover.trail',
    githubUrl: 'https://github.com/apex-studio/horizon-rover',
    rating: 4.8,
    reviewsCount: 9800,
    downloads: '380K+',
    version: '3.6.0',
    size: '78.4 MB',
    minAndroid: '',
    minIos: 'iOS 16.0 or later (LiDAR recommended)',
    lastUpdated: 'Sep 05, 2026',
    accentColor: '#0ea5e9',
    badge: 'Award Winner',
  },
  {
    id: 'zenith-flow',
    name: 'Zenith Flow',
    tagline: 'Neuro-calibrated Deep Work & Minimalist Habit Engine',
    shortDescription: 'Distraction-blocking habit tracker built around binaural beat frequencies, circadian flow states, and micro-journaling.',
    fullDescription: 'Crafted for creators and engineers seeking peak cognitive momentum. Zenith Flow pairs scientifically validated binaural focus audio with an elegant time-blocking dashboard. Set non-negotiable daily rituals, monitor streak resilience without guilt penalties, and review automated weekly productivity retrospectives.',
    logo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      'Spatial 3D Binaural Focus Sounds (Alpha, Beta, Theta waves)',
      'Circadian Rhythm Energy Level Scheduling',
      'Strict App Blocker & Screen Time Limiter via Screen Time API',
      'Interactive Home Screen Widgets with Glancable Progress Rings',
      'Streak Resilience Protection (2 rest days per cycle)',
      'End-to-End Encrypted Cloud Sync via iCloud & Google Drive'
    ],
    technologies: ['Flutter', 'Dart', 'AudioPlayers', 'Provider', 'Hive Database'],
    platforms: 'Android',
    category: 'Productivity & Tools',
    featured: false,
    published: false,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.apexstudio.zenithflow',
    appStoreUrl: '',
    websiteUrl: 'https://zenithflow.space',
    githubUrl: 'https://github.com/apex-studio/zenith-flow',
    rating: 4.6,
    reviewsCount: 4200,
    downloads: '150K+',
    version: '1.2.0-beta',
    size: '34.2 MB',
    minAndroid: 'Android 9.0',
    minIos: '',
    lastUpdated: 'Sep 26, 2026',
    accentColor: '#06b6d4',
    badge: 'In Beta',
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@apexstudio.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Owner',
    status: 'Active',
    codeAccess: 'Full Access',
    permissions: {
      viewProjects: true,
      addProjects: true,
      editProjects: true,
      codeEditor: true,
      createBranch: true,
      previewChanges: true,
      mergeToProduction: true,
      deployProduction: true,
    },
    lastActive: 'Just now',
  },
  {
    id: 'u-2',
    name: 'Marcus Vance',
    email: 'marcus.v@apexstudio.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Developer',
    status: 'Active',
    codeAccess: 'Full Access',
    permissions: {
      viewProjects: true,
      addProjects: true,
      editProjects: true,
      codeEditor: true,
      createBranch: true,
      previewChanges: true,
      mergeToProduction: false,
      deployProduction: false,
    },
    lastActive: '12 minutes ago',
  },
  {
    id: 'u-3',
    name: 'Elena Rostova',
    email: 'elena.r@apexstudio.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Developer',
    status: 'Active',
    codeAccess: 'Full Access',
    permissions: {
      viewProjects: true,
      addProjects: false,
      editProjects: true,
      codeEditor: true,
      createBranch: true,
      previewChanges: true,
      mergeToProduction: false,
      deployProduction: false,
    },
    lastActive: '2 hours ago',
  },
  {
    id: 'u-4',
    name: 'David Kim',
    email: 'david.k@apexstudio.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Content Manager',
    status: 'Active',
    codeAccess: 'Locked',
    permissions: {
      viewProjects: true,
      addProjects: true,
      editProjects: true,
      codeEditor: false,
      createBranch: false,
      previewChanges: true,
      mergeToProduction: false,
      deployProduction: false,
    },
    lastActive: '1 day ago',
  },
  {
    id: 'u-5',
    name: 'Chloe Chen',
    email: 'chloe.chen@apexstudio.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    role: 'Editor',
    status: 'Active',
    codeAccess: 'Read Only',
    permissions: {
      viewProjects: true,
      addProjects: false,
      editProjects: true,
      codeEditor: false,
      createBranch: false,
      previewChanges: true,
      mergeToProduction: false,
      deployProduction: false,
    },
    lastActive: '3 days ago',
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    user: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    action: 'Deployed Production Release v3.2.1',
    target: 'ShoeCheck AI (Android & iOS)',
    timestamp: '28m ago',
    type: 'deploy',
  },
  {
    id: 'act-2',
    user: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    action: 'Pushed commit to branch feature/homepage-update',
    target: 'components/Navbar.tsx',
    timestamp: '1h ago',
    type: 'code',
  },
  {
    id: 'act-3',
    user: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    action: 'Updated screenshots and description',
    target: 'BrainWave AI Study',
    timestamp: '4h ago',
    type: 'project',
  },
  {
    id: 'act-4',
    user: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    action: 'Modified permissions for Marcus Vance',
    target: 'Developer Role Access Policy',
    timestamp: '1d ago',
    type: 'user',
  },
  {
    id: 'act-5',
    user: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    action: 'Generated preview artifact',
    target: 'components/ProjectCard.tsx',
    timestamp: '2d ago',
    type: 'code',
  },
];

export const MOCK_CODE_FILES: CodeFile[] = [
  {
    name: 'page.tsx',
    path: 'app/page.tsx',
    language: 'typescript',
    content: `import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedApps } from '@/components/FeaturedApps';
import { TechStack } from '@/components/TechStack';
import { ShowcaseStats } from '@/components/ShowcaseStats';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Dynamic Ambient Background Light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-sky-500/20 to-purple-600/10 blur-[130px] rounded-full" />
      </div>

      <HeroSection 
        title="Engineering Next-Generation Mobile Experiences"
        subtitle="We build category-defining Android & iOS apps powered by on-device AI, computer vision, and reactive architectures."
        ctaText="Explore Our Apps"
      />

      <ShowcaseStats 
        totalDownloads="5.8M+"
        activeUsers="1.2M"
        averageRating={4.86}
        appCount={7}
      />

      <FeaturedApps limit={3} />
      <TechStack />
    </main>
  );
}`
  },
  {
    name: 'Navbar.tsx',
    path: 'components/Navbar.tsx',
    language: 'typescript',
    content: `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, ShieldCheck, Sun, Moon, ArrowRight } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Apex<span className="text-sky-400">Studio</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            to="/admin/login" 
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            Admin Portal
          </Link>
        </div>
      </div>
    </header>
  );
};`
  },
  {
    name: 'ProjectCard.tsx',
    path: 'components/ProjectCard.tsx',
    language: 'typescript',
    content: `import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download, ArrowUpRight, Apple, Play } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10">
      <div>
        <div className="flex items-start justify-between mb-4">
          <img 
            src={project.logo} 
            alt={project.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 shadow-md group-hover:scale-105 transition-transform" 
          />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            {project.rating.toFixed(1)}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-xs text-sky-400 font-medium mb-3">
          {project.tagline}
        </p>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {project.shortDescription}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
              {tech}
            </span>
          ))}
        </div>

        <Link
          to={\`/projects/\${project.id}\`}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-sky-500 hover:text-white text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
        >
          View Project Details
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};`
  },
  {
    name: 'Footer.tsx',
    path: 'components/Footer.tsx',
    language: 'typescript',
    content: `import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base">ApexStudio</span>
          </div>
          <p className="text-xs leading-relaxed">
            Crafting premium mobile experiences across Android and iOS with bleeding-edge AI models.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Portfolio</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/projects/shoecheck" className="hover:text-white">ShoeCheck AI</Link></li>
            <li><Link to="/projects/foodai" className="hover:text-white">FoodAI Nutritionist</Link></li>
            <li><Link to="/projects/pulsefit-tracker" className="hover:text-white">PulseFit Pro</Link></li>
            <li><Link to="/projects" className="text-sky-400 hover:underline">View All Apps →</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-white">Our Engineering Culture</Link></li>
            <li><Link to="/contact" className="hover:text-white">App Support & Partnerships</Link></li>
            <li><Link to="/admin/login" className="hover:text-white">Developer Studio Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Legal & Security</h4>
          <p className="text-xs leading-relaxed text-slate-500">
            © 2026 Apex Mobile Studios Inc. All rights reserved. Prototypes presented for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};`
  },
  {
    name: 'about/page.tsx',
    path: 'app/about/page.tsx',
    language: 'typescript',
    content: `export default function AboutPage() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-white mb-6">About ApexStudio</h1>
      <p className="text-lg text-slate-300 leading-relaxed mb-8">
        We are an independent mobile engineering laboratory committed to crafting delightful, high-utility native and cross-platform apps. 
      </p>
    </section>
  );
}`
  },
  {
    name: 'projects/page.tsx',
    path: 'app/projects/page.tsx',
    language: 'typescript',
    content: `export default function ProjectsCatalog() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-4">Mobile App Showcase</h1>
      <p className="text-slate-400">Discover our suite of iOS and Android applications.</p>
    </div>
  );
}`
  },
  {
    name: 'mock-data.ts',
    path: 'lib/mock-data.ts',
    language: 'typescript',
    content: `// Client-side cache and telemetry mock configurations
export const STUDIO_CONFIG = {
  version: '2026.4.1',
  environment: 'staging-mock',
  cloudRegion: 'us-east-1',
  ciPipeline: 'ApexMobile-Workflow-v3',
};`
  }
];
