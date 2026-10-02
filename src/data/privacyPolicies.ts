export interface PrivacyPolicySection {
  title: string;
  content: string[];
}

export interface AppPrivacyPolicy {
  appId: string;
  appName: string;
  subdomain: string;
  effectiveDate: string;
  lastUpdated: string;
  summary: string;
  dataTypesCollected: {
    category: string;
    items: string[];
    purpose: string;
    storedLocally: boolean;
  }[];
  sections: PrivacyPolicySection[];
}

export const APP_PRIVACY_POLICIES: Record<string, AppPrivacyPolicy> = {
  shoecheck: {
    appId: 'shoecheck',
    appName: 'ShoeCheck AI',
    subdomain: 'shoecheck',
    effectiveDate: 'October 1, 2026',
    lastUpdated: 'October 2026',
    summary: 'ShoeCheck AI is built on local-first on-device computer vision. We never sell your photos, scans, or resale inventory data to third parties.',
    dataTypesCollected: [
      {
        category: 'Camera & Macro Photos',
        items: ['High-angle sneaker macro photos', 'Stitching captures', 'Box label barcodes'],
        purpose: 'Real-time neural authenticity inspection and condition grading',
        storedLocally: true,
      },
      {
        category: 'Device & Hardware Telemetry',
        items: ['Operating system version', 'GPU/Neural Engine capabilities', 'Anonymous crash logs'],
        purpose: 'Optimizing on-device CoreML & TensorFlow Lite inference speed',
        storedLocally: false,
      },
      {
        category: 'Marketplace Sync (Optional)',
        items: ['Watchlist sneakers', 'Estimated portfolio valuation'],
        purpose: 'Providing live StockX & GOAT resale price estimates',
        storedLocally: true,
      },
    ],
    sections: [
      {
        title: '1. Introduction and Data Controller',
        content: [
          'Welcome to ShoeCheck AI, operated by Verado Mobile Studios Inc. ("Verado", "we", "us", or "our"). This Privacy Policy applies to the ShoeCheck AI mobile application available on iOS (Apple App Store) and Android (Google Play Store), accessible directly via shoecheck.verado.dev.',
          'Your privacy is fundamental to how we engineer our software. We strictly adhere to Apple App Store Review Guidelines, Google Play User Data Policies, the European Union General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).',
        ],
      },
      {
        title: '2. Camera Access & Image Processing',
        content: [
          'ShoeCheck AI requests camera permissions solely to enable sneaker verification, stitching quality inspection, and barcode scanning.',
          'On-Device Processing: In accordance with our local-first architecture, initial convolutional neural network inference is executed directly on your device using Apple CoreML and TensorFlow Lite. Macro sneaker photos are processed in temporary memory and are NOT uploaded to cloud servers without your explicit request for cloud multi-expert verification.',
          'No Facial or Biometric Recognition: The camera pipeline strictly looks for footwear silhouettes, stitch densities, and typography. If human faces or identifying background details are accidentally captured, they are automatically blurred on-device prior to any processing.',
        ],
      },
      {
        title: '3. Data Retention & Digital Certificates',
        content: [
          'When you generate a Digital Certificate of Authenticity, a cryptographic hash of the verification result is saved to your local device and synced with your private encrypted profile.',
          'You may export, download, or permanently delete your scan history and generated certificates at any moment directly from the application settings.',
        ],
      },
      {
        title: '4. Third-Party Services and Analytics',
        content: [
          'We do not sell, rent, or monetize your personal information to data brokers or advertisers.',
          'Marketplace Price Data: Market price estimates are fetched via cached public APIs. No user-identifiable data or scan photographs are ever shared with sneaker marketplaces.',
          'Crash Diagnostics: We utilize privacy-compliant diagnostic telemetry (Sentry/Firebase) with IP anonymization enabled to identify and resolve device rendering crashes.',
        ],
      },
      {
        title: '5. Your Legal Rights & Data Deletion',
        content: [
          'Regardless of where you reside, you have the right to request access to any data associated with your profile, request corrections, or trigger instant permanent account deletion.',
          'To request complete data erasure, use the "Delete All Account Data" option inside the app settings or email our Data Protection Officer at privacy@verado.dev.',
        ],
      },
    ],
  },

  foodai: {
    appId: 'foodai',
    appName: 'FoodAI Nutritionist',
    subdomain: 'foodai',
    effectiveDate: 'October 1, 2026',
    lastUpdated: 'October 2026',
    summary: 'FoodAI Nutritionist processes meal photos to calculate macronutrients. We treat all dietary and health telemetry with hospital-grade cryptographic privacy.',
    dataTypesCollected: [
      {
        category: 'Meal Photos & Camera Stream',
        items: ['Food plate snapshots', 'Packaged nutrition label photos', 'LiDAR depth frames'],
        purpose: 'Volumetric portion size estimation and ingredient recognition',
        storedLocally: true,
      },
      {
        category: 'Nutritional & Dietary Targets',
        items: ['Daily calorie goals', 'Macro distributions (protein, carbs, fats)', 'Allergen preferences'],
        purpose: 'Personalized dietary guidance and safe recipe generation',
        storedLocally: true,
      },
      {
        category: 'Health Kit / Google Fit (Optional)',
        items: ['Active energy burned', 'Dietary energy consumed'],
        purpose: 'Two-way synchronization with Apple HealthKit and Google Health Connect',
        storedLocally: true,
      },
    ],
    sections: [
      {
        title: '1. Dedicated Health Privacy Commitment',
        content: [
          'FoodAI Nutritionist is developed by Verado Mobile Studios Inc. We recognize that nutritional and dietary logs are deeply sensitive personal health indicators.',
          'We guarantee that your nutritional logs, body composition goals, allergen restrictions, and meal photos are NEVER shared with health insurance providers, data brokers, or advertising networks under any circumstances.',
        ],
      },
      {
        title: '2. Apple Health & Google Health Connect Integration',
        content: [
          'When you grant permission to sync with Apple HealthKit or Google Health Connect, FoodAI Nutritionist only writes nutritional data (calories, protein, carbohydrates, fats, vitamins) and reads active calorie expenditure to balance your daily budget.',
          'Data acquired through HealthKit or Health Connect APIs is strictly governed by Apple and Google developer terms and is never used for marketing or analytics.',
        ],
      },
      {
        title: '3. Image Recognition & LiDAR Volumetric Analysis',
        content: [
          'When you snap your plate, FoodAI uses computer vision (YOLOv10 and ONNX models) to identify food categories and compute 3D volume.',
          'All food photos are evaluated for ingredient composition and immediately scrubbed of EXIF geolocation metadata before any optional cloud backup.',
        ],
      },
      {
        title: '4. Security and Storage Architecture',
        content: [
          'All synced profile records are transmitted over TLS 1.3 and stored using AES-256 server-side encryption at rest in isolated row-level secured database partitions.',
          'Users can operate FoodAI in "Offline Guest Mode" where all food logs remain exclusively within the device local SQLite database.',
        ],
      },
      {
        title: '5. Contact and Data Management',
        content: [
          'You may request complete export or deletion of your dietary history at any time. For privacy inquiries or deletion requests, contact privacy@verado.dev.',
        ],
      },
    ],
  },

  'pulsefit-tracker': {
    appId: 'pulsefit-tracker',
    appName: 'PulseFit Pro',
    subdomain: 'pulsefit',
    effectiveDate: 'October 1, 2026',
    lastUpdated: 'October 2026',
    summary: 'PulseFit Pro is engineered for bio-sensor HIIT and strength tracking. Heart rate zones and motion sensor rep telemetry remain encrypted and under your total control.',
    dataTypesCollected: [
      {
        category: 'Wearable & Biometric Sensors',
        items: ['Continuous heart rate (BPM)', 'Heart rate variability (HRV)', 'Workout energy burn'],
        purpose: 'Real-time anaerobic target zone coaching and fatigue recovery scoring',
        storedLocally: true,
      },
      {
        category: 'Device Motion & Gyroscope',
        items: ['Accelerometer vectors', 'Gyroscope angular velocity'],
        purpose: 'Automated rep and set counting for resistance exercises',
        storedLocally: true,
      },
      {
        category: 'Workout Routines & Audio Settings',
        items: ['Exercise history', 'Custom workout intervals', 'Audio coach voice preferences'],
        purpose: 'Personalizing fitness progressions and training timers',
        storedLocally: true,
      },
    ],
    sections: [
      {
        title: '1. Bio-Sensor & Wearable Data Policy',
        content: [
          'PulseFit Pro is designed by Verado Mobile Studios Inc. for athletes and fitness enthusiasts.',
          'Biometric readings streamed from Bluetooth Low Energy (BLE) chest straps, Apple Watch, or Wear OS devices are processed in real time on the device to calculate heart rate training zones.',
          'We do not transmit continuous raw sensor time-series data to external third parties.',
        ],
      },
      {
        title: '2. Motion & Rep Counting Sensors',
        content: [
          'Device accelerometer and gyroscope sensor data are accessed solely while an active exercise session is in progress to detect rep movement curves.',
          'Sensor listening ceases immediately when you pause or finish a workout.',
        ],
      },
      {
        title: '3. Data Security & Encryption',
        content: [
          'Your completed workout summaries and strain scores are stored using encrypted local storage. When cloud synchronization is enabled, all transmissions use end-to-end transport layer security.',
          'We adhere strictly to the European Union GDPR standards for special category biometric data and CCPA privacy protections.',
        ],
      },
      {
        title: '4. Account Management & Deletion',
        content: [
          'You have the unqualified right to purge all stored workout logs, biometric records, and account data with a single button in settings. Inquiries can be submitted to privacy@verado.dev.',
        ],
      },
    ],
  },

  'brainwave-ai': {
    appId: 'brainwave-ai',
    appName: 'BrainWave AI Study',
    subdomain: 'brainwave',
    effectiveDate: 'October 1, 2026',
    lastUpdated: 'October 2026',
    summary: 'BrainWave AI Study converts study materials into spaced-repetition mastery. Your academic notes, flashcards, and uploaded study decks remain confidential.',
    dataTypesCollected: [
      {
        category: 'Study Documents & Text',
        items: ['User-uploaded PDFs', 'Handwritten notes snapshots', 'Flashcard decks'],
        purpose: 'Generating interactive summaries, spaced-repetition schedules, and quizzes',
        storedLocally: true,
      },
      {
        category: 'Microphone & Audio (Optional)',
        items: ['Lecture audio recordings (only when recording button is actively tapped)'],
        purpose: 'Automated transcription and topic extraction using on-device Whisper models',
        storedLocally: true,
      },
      {
        category: 'Study Progress & Mastery Telemetry',
        items: ['Spaced repetition recall scores (SM-2)', 'Daily focus streaks'],
        purpose: 'Optimizing review intervals and retention curves',
        storedLocally: true,
      },
    ],
    sections: [
      {
        title: '1. Academic Integrity & Document Privacy',
        content: [
          'BrainWave AI Study is operated by Verado Mobile Studios Inc.',
          'Study documents, course syllabi, textbooks, and personal study notes uploaded to BrainWave AI are strictly used to generate learning aids for your personal account.',
          'We do NOT use your private study decks or proprietary academic materials to train public generative AI foundation models without explicit organizational licensing.',
        ],
      },
      {
        title: '2. Microphone and Audio Permissions',
        content: [
          'BrainWave AI accesses the device microphone strictly when you actively press the "Record Lecture" button.',
          'There is zero background audio monitoring or continuous ambient listening. You can verify microphone active status via iOS and Android system privacy indicator dots.',
        ],
      },
      {
        title: '3. Children’s Privacy (COPPA Compliance)',
        content: [
          'BrainWave AI is dedicated to student safety. We do not knowingly collect personally identifiable information from students under 13 without verified parental or institutional educational consent.',
          'Our platform does not include third-party behavioral advertising or behavioral tracking for minors.',
        ],
      },
      {
        title: '4. Data Export & Deletion Rights',
        content: [
          'You retain full intellectual property ownership of your study notes and flashcard decks. You can export decks in standard Anki/CSV format or delete all records at any time via privacy@verado.dev.',
        ],
      },
    ],
  },

  lenz: {
    appId: 'lenz',
    appName: 'Lenz Object AI',
    subdomain: 'lenz',
    effectiveDate: 'October 1, 2026',
    lastUpdated: 'October 2026',
    summary: 'Lenz Object AI is an on-device computer vision and visual detective tool. Real-time camera streams are processed locally without cloud surveillance.',
    dataTypesCollected: [
      {
        category: 'Live Camera Frames',
        items: ['Video preview stream', 'Macro object bounding boxes'],
        purpose: 'Instant visual identification and classification',
        storedLocally: true,
      },
      {
        category: 'Scan History',
        items: ['Identified items and user tags'],
        purpose: 'Local search history and reference catalog',
        storedLocally: true,
      },
    ],
    sections: [
      {
        title: '1. On-Device Computer Vision Guarantee',
        content: [
          'Lenz Object AI executes deep neural inference locally on your device neural engine (Apple Neural Engine / Qualcomm NPU).',
          'Camera streams never leave your device RAM during standard object detection.',
        ],
      },
      {
        title: '2. User Controls & Deletion',
        content: [
          'All identified object logs are saved solely to your local storage and can be wiped instantly in app preferences.',
          'For questions or privacy requests, reach out to privacy@verado.dev.',
        ],
      },
    ],
  },

  spendwise: {
    appId: 'spendwise',
    appName: 'SpendWise Manager',
    subdomain: 'spendwise',
    effectiveDate: 'October 1, 2026',
    lastUpdated: 'October 2026',
    summary: 'SpendWise Manager uses bank-grade AES-256 enclave encryption. We strictly operate in read-only mode and NEVER sell your financial transactions or net worth data.',
    dataTypesCollected: [
      {
        category: 'Financial Accounts & Ledgers (Read-Only)',
        items: ['Bank account balances', 'Masked transaction histories', 'Upcoming recurring bills'],
        purpose: 'Automated expense categorization and net worth runway modeling',
        storedLocally: true,
      },
      {
        category: 'Receipt OCR Snapshots (Optional)',
        items: ['Scanned purchase receipts', 'Tax-deduction categorization tags'],
        purpose: 'Local optical character recognition for expense reconciliation',
        storedLocally: true,
      },
      {
        category: 'Device Cryptographic Security',
        items: ['Secure Enclave hardware biometric key tokens (FaceID/Fingerprint)'],
        purpose: 'Locally unlocking financial database vault',
        storedLocally: true,
      },
    ],
    sections: [
      {
        title: '1. Bank-Grade Encryption & Read-Only Open Banking',
        content: [
          'SpendWise Manager is engineered by Verado Mobile Studios Inc. with financial-grade security standards.',
          'All open banking integrations via Plaid and MX operate under strict SOC-2 Type II certified protocols in read-only mode. SpendWise never requests, stores, or possesses authority to initiate funds transfers or modify bank balances.',
          'Your bank login credentials are never visible to or stored on Verado servers; authentication occurs directly through tokenized banking gateways.',
        ],
      },
      {
        title: '2. Zero Data Monetization Commitment',
        content: [
          'We believe your financial habits and net worth are strictly private. We NEVER sell, license, or provide your transactional histories, salary data, or credit records to marketers, lenders, or third-party data brokers.',
        ],
      },
      {
        title: '3. On-Device Categorization & Local Enclave',
        content: [
          'Machine learning categorization and burn-rate calculations execute client-side inside the device Secure Enclave with AES-256 local database encryption.',
          'You may operate SpendWise completely offline by manually logging income and expenses without linking external bank accounts.',
        ],
      },
      {
        title: '4. Instant Data Purge and Erasure',
        content: [
          'You have the legal right under GDPR and CCPA to completely wipe all cached financial records and disconnect banking tokens in 1-click inside Settings > Data Vault > Erase All Data.',
          'For legal compliance inquiries, reach out to privacy@verado.dev.',
        ],
      },
    ],
  },
};

/**
 * Fallback policy generator for any other registered project
 */
export function getAppPrivacyPolicy(appId: string, appName?: string): AppPrivacyPolicy {
  const normalizedId = appId.toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  if (APP_PRIVACY_POLICIES[normalizedId]) {
    return APP_PRIVACY_POLICIES[normalizedId];
  }

  // Alias lookup
  if (normalizedId === 'pulsefit' && APP_PRIVACY_POLICIES['pulsefit-tracker']) {
    return APP_PRIVACY_POLICIES['pulsefit-tracker'];
  }
  if (normalizedId === 'brainwave' && APP_PRIVACY_POLICIES['brainwave-ai']) {
    return APP_PRIVACY_POLICIES['brainwave-ai'];
  }

  const name = appName || appId;
  return {
    appId: normalizedId,
    appName: name,
    subdomain: normalizedId,
    effectiveDate: 'October 1, 2026',
    lastUpdated: 'October 2026',
    summary: `${name} is engineered by Verado Mobile Studios with local-first, privacy-preserving architecture.`,
    dataTypesCollected: [
      {
        category: 'Application Usage',
        items: ['Anonymous feature engagement', 'Device OS version'],
        purpose: 'Improving app performance and reliability',
        storedLocally: true,
      },
    ],
    sections: [
      {
        title: '1. Privacy Overview',
        content: [
          `${name} is a mobile application developed by Verado Mobile Studios Inc. We believe user privacy is a fundamental right and design all software with zero unnecessary data collection.`,
        ],
      },
      {
        title: '2. Data Protection and Deletion',
        content: [
          'We do not sell, rent, or monetize your personal data. You can delete your app data or contact our Data Protection Officer at privacy@verado.dev.',
        ],
      },
    ],
  };
}
