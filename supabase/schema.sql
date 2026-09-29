-- ==============================================================================
-- VERADO STUDIO // SUPABASE POSTGRESQL SCHEMA & INITIAL DATA SEED
-- Run this script inside your Supabase project SQL Editor
-- ==============================================================================

-- 1. CREATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  short_description TEXT,
  full_description TEXT,
  logo TEXT,
  cover_image TEXT,
  screenshots TEXT[] DEFAULT '{}',
  demo_video_url TEXT,
  features TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  platforms TEXT DEFAULT 'Android + iOS',
  category TEXT DEFAULT 'AI & Computer Vision',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  play_store_url TEXT,
  app_store_url TEXT,
  website_url TEXT,
  github_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 4.80,
  reviews_count INTEGER DEFAULT 1200,
  downloads TEXT DEFAULT '100k+',
  version TEXT DEFAULT '1.0.0',
  size TEXT DEFAULT '45 MB',
  min_android TEXT DEFAULT 'Android 10+',
  min_ios TEXT DEFAULT 'iOS 16+',
  last_updated TEXT DEFAULT 'Recently',
  accent_color TEXT DEFAULT '#38bdf8',
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE INQUIRIES & CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  category TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE STUDIO & OWNER SETTINGS TABLE (Client Self-Service Credentials)
CREATE TABLE IF NOT EXISTS public.studio_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  owner_email TEXT DEFAULT 'owner@verado.io',
  owner_password TEXT DEFAULT 'verado2026!',
  studio_name TEXT DEFAULT 'Verado Studios Inc.',
  support_email TEXT DEFAULT 'engineering@verado.io',
  api_key TEXT DEFAULT 'verado_sec_live_9948201a88',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.studio_settings (id, owner_email, owner_password, studio_name, support_email)
VALUES ('default', 'owner@verado.io', 'verado2026!', 'Verado Studios Inc.', 'engineering@verado.io')
ON CONFLICT (id) DO NOTHING;

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR PUBLIC ACCESS
-- Anyone can view published projects
CREATE POLICY "Public read access for published projects" 
ON public.projects FOR SELECT 
USING (true);

-- Anyone can insert into projects / admin can update (or adjust with Supabase Auth)
CREATE POLICY "Allow public insert and update for prototype admin" 
ON public.projects FOR ALL 
USING (true)
WITH CHECK (true);

-- Anyone can submit contact messages
CREATE POLICY "Allow public insert for inquiries" 
ON public.inquiries FOR INSERT 
WITH CHECK (true);

-- Allow read and update for studio settings
CREATE POLICY "Allow read and update for studio settings" 
ON public.studio_settings FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. CREATE STORAGE BUCKET FOR APP SCREENSHOTS & LOGOS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public read policy
CREATE POLICY "Public Access to project-assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-assets');

-- Storage upload policy
CREATE POLICY "Allow uploads to project-assets" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project-assets');

-- ==============================================================================
-- 6. SEED INITIAL SHOWCASE APPLICATIONS
-- ==============================================================================

INSERT INTO public.projects (
  id, name, tagline, short_description, full_description, logo, cover_image, 
  screenshots, demo_video_url, features, technologies, platforms, category, 
  featured, published, play_store_url, app_store_url, rating, reviews_count, 
  downloads, version, size, min_android, min_ios, last_updated, accent_color, badge
) VALUES 
(
  'shoecheck',
  'ShoeCheck AI',
  'Instant Sneaker Legit-Check & Condition Analyzer',
  'AI-driven computer vision app that verifies authentic sneakers, scans stitching flaws, and assesses resale condition in seconds.',
  'ShoeCheck AI leverages deep convolutional neural networks trained on over 2.5 million verified footwear samples. By capturing 6 high-angle macro photos, sneaker collectors and resellers can instantly detect counterfeit batch variations, stitching anomalies, box label barcode discrepancies, and UV watermark irregularities.',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80'
  ],
  'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
  ARRAY[
    'Multi-Angle Macro Neural Scanner (99.4% accuracy)',
    'Box Label & RFID/NFC Tag Authenticator',
    'Real-Time Resale Market Value Estimator (StockX & GOAT Sync)',
    'Digital NFT Certificate of Authenticity Ledger'
  ],
  ARRAY['Swift', 'Kotlin', 'CoreML', 'TensorFlow Lite', 'ARKit', 'FastAPI'],
  'Android + iOS',
  'AI & Computer Vision',
  true,
  true,
  'https://play.google.com',
  'https://apps.apple.com',
  4.92,
  38200,
  '1.8M+',
  '3.2.1',
  '48 MB',
  'Android 10.0+',
  'iOS 16.0+',
  'Yesterday',
  '#f97316',
  'Featured App'
),
(
  'foodai',
  'FoodAI Nutritionist',
  'Snap your plate, decode macro nutrients instantly',
  'Real-time culinary object segmentation and volumetric calorie estimation using iPhone LiDAR and neural vision.',
  'FoodAI eliminates manual food journaling. Utilizing mobile depth sensors and on-device multi-spectral image classification, users simply hover their camera over any plate to receive gram-accurate breakdowns of macronutrients, glycemic index projections, and allergen warnings within 120 milliseconds.',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505253758473-96b3015f21c9?w=600&auto=format&fit=crop&q=80'
  ],
  'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
  ARRAY[
    '3D Volumetric Portion Size Estimation using LiDAR & Camera',
    'Recognition for 12,000+ Global Cuisines and Complex Recipes',
    'Barcode & Menu Scanning with Instant Macro Decoding',
    'Apple Health & Google Fit Bi-directional Synchronization'
  ],
  ARRAY['Flutter', 'Dart', 'Python', 'YOLOv10', 'CoreML', 'Metal'],
  'Android + iOS',
  'Health & Fitness',
  true,
  true,
  'https://play.google.com',
  'https://apps.apple.com',
  4.88,
  24600,
  '920K+',
  '2.4.0',
  '62 MB',
  'Android 11.0+',
  'iOS 16.2+',
  '3 days ago',
  '#10b981',
  'Editors Choice'
),
(
  'pulsefit',
  'PulseFit Pro',
  'Adaptive HIIT & Bio-Sensor Fitness Coach',
  'Smart workout companion with audio coaching, wearable heart rate zone tracking, and automated rep counting via device gyroscope.',
  'PulseFit Pro elevates personal fitness by transforming your phone into an intelligent personal trainer. Connect with Apple Watch, Wear OS, or Bluetooth chest straps to receive real-time audio guidance when your heart rate dips out of targeted anaerobic zones.',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80'
  ],
  'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
  ARRAY[
    'Real-time Biometric HR Zone Training (Zones 1 through 5)',
    'Automated Gyroscope Rep & Set Counting for 200+ Exercises',
    'AI Adaptive Rest Timers calibrated to recovery heart rate',
    'Offline GPS Route Mapping & Elevation Telemetry'
  ],
  ARRAY['Swift', 'SwiftUI', 'WatchKit', 'HealthKit', 'CoreMotion'],
  'iOS',
  'Health & Fitness',
  true,
  true,
  'https://play.google.com',
  'https://apps.apple.com',
  4.95,
  19800,
  '640K+',
  '4.1.2',
  '38 MB',
  'N/A',
  'iOS 16.0+',
  '1 week ago',
  '#06b6d4',
  'Best of 2026'
)
ON CONFLICT (id) DO NOTHING;
