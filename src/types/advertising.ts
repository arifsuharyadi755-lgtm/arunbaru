export type AdPlacementType = 
  | 'leaderboard_top'      // Banner Billboard Utama (Atas)
  | 'sidebar_rectangle'    // Banner Kotak Bilah Sisi (300x250)
  | 'native_advertorial'   // Berita Bersponsor (Artikel Redaksi)
  | 'push_notification';   // Siaran Notifikasi Kilat ke Ponsel Pembaca

export interface AdPackage {
  id: AdPlacementType;
  title: string;
  badge: string;
  dimensions: string;
  pricePerDay: number;
  estImpressionsPerDay: string;
  estClicksPerDay: string;
  description: string;
  benefits: string[];
}

export interface AdSubmission {
  id: string;
  brandName: string;
  contactName: string;
  email: string;
  phoneWhatsapp: string;
  targetCategory: string;
  packageType: AdPlacementType;
  durationDays: number;
  startDate: string;
  headline: string;
  description: string;
  targetUrl: string;
  bannerImageUrl?: string;
  totalCost: number;
  status: 'review' | 'approved' | 'active';
  createdAt: string;
}

export const AD_PACKAGES: AdPackage[] = [
  {
    id: 'leaderboard_top',
    title: 'Billboard Leaderboard Utama',
    badge: 'Paling Populer',
    dimensions: '970 x 90 / Responsif Desktop & Mobile',
    pricePerDay: 750000,
    estImpressionsPerDay: '85.000+ Tayangan',
    estClicksPerDay: '1.200 - 2.500 Klik',
    description: 'Penempatan paling strategis di bagian atas portal, langsung terlihat pertama kali saat pembaca membuka Arun News.',
    benefits: [
      'Posisi puncak di atas breaking news ticker',
      'Tampil di semua kanal kategori utama',
      'Format gambar dinamis atau HTML5 interaktif',
      'Laporan analitik impresi & CTR real-time'
    ]
  },
  {
    id: 'sidebar_rectangle',
    title: 'Medium Rectangle Sidebar',
    badge: 'Efektif & Hemat',
    dimensions: '300 x 250 / 336 x 280 Kotak',
    pricePerDay: 450000,
    estImpressionsPerDay: '55.000+ Tayangan',
    estClicksPerDay: '750 - 1.400 Klik',
    description: 'Menempel di bilah sisi kanan di samping berita terpopuler dan jadwal sholat dengan tingkat retensi pandangan tinggi.',
    benefits: [
      'Tetap terlihat saat pembaca menelusuri artikel populer',
      'Dukungan animasi grafis & call-to-action menarik',
      'Targeting audiens berdasarkan kategori bacaan',
      'Rasio konversi klik (CTR) tinggi'
    ]
  },
  {
    id: 'native_advertorial',
    title: 'Artikel Berita Bersponsor (Advertorial)',
    badge: 'Dampak Kredibilitas Tinggi',
    dimensions: 'Artikel Jurnalistik Penuh + Galeri Foto',
    pricePerDay: 1200000,
    estImpressionsPerDay: '120.000+ Pembaca Organik',
    estClicksPerDay: '3.000+ Pembaca Tuntas',
    description: 'Artikel ulasan mendalam bergaya jurnalistik profesional yang ditulis redaktur kami untuk mengedukasi dan membangun kepercayaan brand.',
    benefits: [
      'Masuk ke feed kanal berita utama & Google News',
      'Dilengkapi wawancara, kutipan, dan backlink resmi',
      'Dapat dibagikan ke WhatsApp dan media sosial',
      'Artikel permanen terindeks mesin pencari'
    ]
  },
  {
    id: 'push_notification',
    title: 'Push Notification Blast Promosi',
    badge: 'Konversi Seketika',
    dimensions: 'Notifikasi Langsung ke Perangkat Pembaca',
    pricePerDay: 600000,
    estImpressionsPerDay: '40.000+ Penerima Notifikasi',
    estClicksPerDay: '1.800+ Kunjungan Langsung',
    description: 'Kirimkan pesan promo kilat langsung ke layar handphone dan browser puluhan ribu pelanggan aktif notifikasi kami.',
    benefits: [
      'Terkirim instan dalam hitungan detik',
      'Tingkat keterbukaan (open rate) mencapai 18%',
      'Tautan langsung mengarah ke situs/toko online Anda',
      'Audio bel signature notifikasi berita'
    ]
  }
];
