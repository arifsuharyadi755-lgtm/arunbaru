import { CategoryId, CategoryInfo, NewsArticle } from '../types/news';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'Semua Berita',
    slug: 'semua',
    badge: 'Semua',
    color: '#004a99',
    subcategories: ['Terbaru', 'Terpopuler', 'Fokus', 'Foto', 'Video']
  },
  {
    id: 'politik',
    name: 'Politik',
    slug: 'politik',
    badge: 'Politik',
    color: '#004a99',
    subcategories: ['Semua', 'Pemerintahan', 'DPR & Regulasi', 'Pilpres & Pemilu', 'Partai Politik', 'Kebijakan Publik']
  },
  {
    id: 'olahraga',
    name: 'Olahraga',
    slug: 'olahraga',
    badge: 'Olahraga',
    color: '#e53935',
    subcategories: ['Semua', 'Sepakbola', 'Timnas Indonesia', 'Bulu Tangkis', 'Balap & Motor', 'Atletik']
  },
  {
    id: 'kriminal',
    name: 'Kriminal',
    slug: 'kriminal',
    badge: 'Kriminal',
    color: '#b91c1c',
    subcategories: ['Semua', 'Kepolisian', 'Kejahatan Siber', 'Narkoba', 'Korupsi', 'Pengadilan']
  },
  {
    id: 'ekonomi',
    name: 'Ekonomi',
    slug: 'ekonomi',
    badge: 'Ekonomi',
    color: '#0070ba',
    subcategories: ['Semua', 'Makro & Finansial', 'Bursa & Saham', 'UMKM & Bisnis', 'Pajak & Anggaran', 'Energi']
  },
  {
    id: 'daerah',
    name: 'Daerah',
    slug: 'daerah',
    badge: 'Daerah',
    color: '#0284c7',
    subcategories: ['Semua', 'Aceh & Sumatera', 'Jawa & Jakarta', 'Kalimantan', 'Sulawesi & Bali', 'Papua & Maluku']
  },
  {
    id: 'lain_lain',
    name: 'Lain-lain',
    slug: 'lain-lain',
    badge: 'Lain-lain',
    color: '#6b7280',
    subcategories: ['Semua', 'Gaya Hidup', 'Teknologi & Sains', 'Wisata & Kuliner', 'Kisah Inspiratif', 'Opini Publik']
  },
  {
    id: 'lapor_warga',
    name: 'Lapor Warga',
    slug: 'lapor-warga',
    badge: 'Lapor Warga',
    color: '#ea580c',
    subcategories: ['Semua', 'Fasilitas Umum', 'Keluhan Pelayanan', 'Aspirasi Warga', 'Infrastruktur Rusak', 'Kirim Laporan']
  },
  {
    id: 'legalitas',
    name: 'Legalitas',
    slug: 'legalitas',
    badge: 'Legalitas',
    color: '#4f46e5',
    subcategories: ['Semua', 'Konsultasi Hukum', 'Perizinan Usaha', 'Sengketa & Perdata', 'Agraria & Pertanahan', 'Ketenagakerjaan']
  }
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'Pemerintah Resmikan Koridor Baru Kereta Cepat dan Tol Terintegrasi Antardaerah',
    slug: 'pemerintah-resmikan-koridor-baru-kereta-cepat-antardaerah',
    category: 'politik',
    categoryName: 'Politik',
    subCategory: 'Pemerintahan',
    summary: 'Presiden mengumumkan peresmian koridor transportasi massal modern terintegrasi yang menghubungkan pusat ekonomi Pulau Jawa dan kawasan strategis nasional.',
    content: [
      'JAKARTA - Pemerintah secara resmi mengumumkan pengoperasian penuh koridor transportasi terpadu yang memadukan jaringan kereta berkecepatan tinggi dengan simpul logistik nasional.',
      'Dalam keterangan pers di Istana Negara, Presiden menegaskan bahwa proyek infrastruktur strategis ini bertujuan memangkas waktu tempuh antarkota hingga 60 persen serta menekan emisi karbon secara signifikan.',
      '"Transformasi transportasi massal ini bukan sekadar pembangunan fisik rel dan jalan, melainkan lompatan konektivitas ekonomi yang menghubungkan UMKM, pusat industri, dan jutaan masyarakat," ujar Kepala Negara dalam sambutannya.',
      'Menteri Perhubungan menambahkan bahwa seluruh rangkaian kereta telah melewati uji kelaikan standar internasional dengan sistem keselamatan otomatis tingkat tertinggi.',
      'Masyarakat dapat mulai menikmati layanan komersial dengan tarif terjangkau mulai pekan depan, didukung integrasi tiket digital yang terhubung langsung dengan aplikasi perbankan nasional.'
    ],
    imageUrl: '/src/assets/images/indonesia_breaking_news_1791220903229.jpg',
    imageCaption: 'Konferensi pers pengumuman koridor transportasi nasional di Jakarta. (Foto: Dokumentasi Biro Pers)',
    author: 'Andi Saputra',
    publishedAt: '5 menit lalu',
    timestamp: Date.now() - 5 * 60 * 1000,
    readTime: '3 menit',
    viewsCount: 48920,
    commentCount: 142,
    isBreaking: true,
    isEditorPick: true,
    tags: ['Politik', 'Infrastruktur', 'Transportasi', 'Istana Negara', 'Pemerintahan']
  },
  {
    id: 'art-2',
    title: 'IHSG Melonjak Sentuh Level Tertinggi Baru Didorong Arus Modal Masuk Asing',
    slug: 'ihsg-melonjak-sentuh-rekor-tertinggi-baru',
    category: 'ekonomi',
    categoryName: 'Ekonomi',
    subCategory: 'Bursa & Saham',
    summary: 'Indeks Harga Saham Gabungan (IHSG) Bursa Efek Indonesia menguat tajam 1,8% seiring penguatan fundamental ekonomi domestik dan rilis kinerja keuangan emiten perbankan.',
    content: [
      'JAKARTA - Laju Indeks Harga Saham Gabungan (IHSG) di Bursa Efek Indonesia (BEI) dibuka menguat kencang pada perdagangan awal pekan, menembus rekor psikologis tertinggi dalam sejarah bursa domestik.',
      'Data perdagangan mencatat nilai transaksi harian melampaui Rp 16,5 triliun dengan aliran dana investor asing (net foreign buy) mencapai Rp 2,1 triliun di seluruh pasar.',
      'Analis pasar modal menyebut sentimen positif didorong oleh stabilnya inflasi inti Bank Indonesia di kisaran target 2,5% serta surplus neraca perdagangan RI yang bertahan selama puluhan bulan berturut-turut.',
      'Sektor perbankan berkapitalisasi besar (big caps) dan sektor energi terbarukan menjadi lokomotif penggerak reli IHSG hari ini.',
      '"Kepercayaan pelaku pasar global terhadap ketahanan fiskal Indonesia semakin solid, didukung kebijakan moneter yang prudent dan terukur," tutur kepala riset sekuritas ternama di kawasan SCBD.'
    ],
    imageUrl: '/src/assets/images/jakarta_stock_exchange_1791220920565.jpg',
    imageCaption: 'Layar pergerakan harga saham di lantai Bursa Efek Indonesia (BEI), Jakarta. (Foto: Tim Ekonomi Arun News)',
    author: 'Rahmat Hidayat',
    publishedAt: '18 menit lalu',
    timestamp: Date.now() - 18 * 60 * 1000,
    readTime: '4 menit',
    viewsCount: 31200,
    commentCount: 88,
    isBreaking: true,
    isEditorPick: false,
    tags: ['Ekonomi', 'IHSG', 'Bursa Saham', 'Pasar Modal', 'Investasi']
  },
  {
    id: 'art-3',
    title: 'Timnas Indonesia Tampil Gemilang di Kualifikasi Piala Dunia di Hadapan 75 Ribu Suporter GBK',
    slug: 'timnas-indonesia-tampil-gemilang-kualifikasi-piala-dunia-gbk',
    category: 'olahraga',
    categoryName: 'Olahraga',
    subCategory: 'Timnas Indonesia',
    summary: 'Skuad Garuda meraih kemenangan krusial 2-0 lewat pressing agresif dan permainan kolektif yang memukau di Stadion Utama Gelora Bung Karno.',
    content: [
      'JAKARTA - Gelora Bung Karno membara dalam lautan merah-putih saat Tim Nasional Indonesia mengamankan tiga poin krusial pada lanjutan babak kualifikasi putaran ketiga Piala Dunia.',
      'Menghadapi lawan tangguh dari Asia Barat, anak asuh pelatih kepala bermain disiplin dengan transisi bertahan-menyerang yang sangat rapi sepanjang 90 menit pertandingan.',
      'Gol pembuka tercipta pada menit ke-24 lewat sundulan tajam memanfaatkan umpan sepak pojok presisi, disambut gemuruh lebih dari 75.000 pendukung fanatik.',
      'Memasuki babak kedua, serangan balik kilat dari sisi sayap berhasil mengunci kemenangan menjadi 2-0 di masa injury time.',
      'Hasil kemenangan ini mendongkrak posisi Indonesia ke peringkat kedua klasemen sementara grup, memperlebar peluang bersejarah melangkah ke panggung utama dunia.'
    ],
    imageUrl: '/src/assets/images/timnas_football_match_1791220933263.jpg',
    imageCaption: 'Aksi penggawa Garuda saat merayakan gol penentu kemenangan di GBK Senayan. (Foto: Liputan Olahraga Arun News)',
    author: 'Bagas Pratama',
    publishedAt: '35 menit lalu',
    timestamp: Date.now() - 35 * 60 * 1000,
    readTime: '3 menit',
    viewsCount: 95400,
    commentCount: 412,
    isBreaking: false,
    isEditorPick: true,
    tags: ['Olahraga', 'Timnas Indonesia', 'Piala Dunia', 'Sepakbola', 'Garuda']
  },
  {
    id: 'art-4',
    title: 'Polda Metro Jaya Bongkar Jaringan Sindikat Penipuan Siber Transnasional Rp 35 Miliar',
    slug: 'polda-metro-jaya-bongkar-sindikat-penipuan-siber',
    category: 'kriminal',
    categoryName: 'Kriminal',
    subCategory: 'Kejahatan Siber',
    summary: 'Subdit Siber Ditreskrimsus berhasil menangkap 12 tersangka dengan barang bukti puluhan laptop, server pemalsu identitas, dan rekening penampungan.',
    content: [
      'JAKARTA - Aparat kepolisian berhasil melumpuhkan sindikat kejahatan siber internasional yang menyasar nasabah perbankan dan pelaku usaha di sejumlah kota besar.',
      'Modus operandi pelaku melibatkan penyebaran tautan phishing perbankan serta rekayasa sosial manipulatif yang menjebak data otentikasi korban.',
      'Direktur Reserse Kriminal Khusus menyampaikan bahwa koordinasi lintas negara dengan Interpol dan PPATK sukses membekukan aset senilai Rp 35 miliar sebelum dilarikan ke luar negeri.',
      '"Kami mengimbau masyarakat untuk tidak pernah membagikan kode OTP atau mengklik dokumen aplikasi mencurigakan yang dikirim pihak tak dikenal," tegas juru bicara kepolisian.'
    ],
    imageUrl: '/src/assets/images/indonesia_breaking_news_1791220903229.jpg',
    imageCaption: 'Gelar perkara barang bukti dan rilis kasus kejahatan siber di Mapolda Metro Jaya. (Foto: Rubrik Kriminal Arun News)',
    author: 'Bayu Wicaksono',
    publishedAt: '45 menit lalu',
    timestamp: Date.now() - 45 * 60 * 1000,
    readTime: '4 menit',
    viewsCount: 41500,
    commentCount: 94,
    isBreaking: true,
    isEditorPick: true,
    tags: ['Kriminal', 'Kepolisian', 'Kejahatan Siber', 'Hukum', 'Polda Metro']
  },
  {
    id: 'art-5',
    title: 'Pemerintah Provinsi Percepat Revitalisasi Jalur Logistik Pantura dan Kawasan Industri Daerah',
    slug: 'pemprov-percepat-revitalisasi-jalur-logistik-pantura',
    category: 'daerah',
    categoryName: 'Daerah',
    subCategory: 'Jawa & Jakarta',
    summary: 'Perbaikan jalur penghubung antarprovinsi ditargetkan rampung sebelum musim liburan guna memastikan kelancaran rantai pasok sembako antardaerah.',
    content: [
      'SEMARANG - Pemerintah Daerah bersama Kementerian PUPR menggenjot penyelesaian proyek perbaikan jembatan dan peninggian badan jalan tanggul di sepanjang jalur pesisir utara.',
      'Gubernur menegaskan bahwa pembenahan infrastruktur antardaerah ini krusial untuk menekan biaya logistik produk pertanian dan perikanan masyarakat lokal.',
      'Sebanyak 4 titik rawan genangan banjir rob telah dilengkapi sistem pompa air otomatis berkapasitas 2.000 liter per detik.'
    ],
    imageUrl: '/src/assets/images/indonesia_breaking_news_1791220903229.jpg',
    imageCaption: 'Pekerjaan pengaspalan dan perbaikan infrastruktur jalan antardaerah. (Foto: Biro Daerah Arun News)',
    author: 'Tri Handoko',
    publishedAt: '1 jam lalu',
    timestamp: Date.now() - 60 * 60 * 1000,
    readTime: '3 menit',
    viewsCount: 23600,
    commentCount: 48,
    tags: ['Daerah', 'Pantura', 'Infrastruktur', 'Jawa Tengah', 'Logistik']
  },
  {
    id: 'art-6',
    title: 'Panduan Lengkap Legalitas Usaha OSS RBA dan Sertifikasi Halal Gratis bagi Pelaku UMKM',
    slug: 'panduan-lengkap-legalitas-usaha-oss-rba-umkm',
    category: 'legalitas',
    categoryName: 'Legalitas',
    subCategory: 'Perizinan Usaha',
    summary: 'Kementerian Hukum dan HAM bersama Badan Penyelenggara Jaminan Produk Halal mempermudah pengurusan Nomor Induk Berusaha (NIB) berbasis risiko tanpa biaya.',
    content: [
      'JAKARTA - Legalitas badan usaha kini semakin mudah diakses oleh pengusaha mikro dan kecil melalui integrasi sistem Online Single Submission (OSS).',
      'Pakar hukum bisnis menjelaskan bahwa kepemilikan NIB dan sertifikat halal bukan hanya kepatuhan hukum, tetapi syarat wajib untuk mengakses program bantuan modal perbankan dan lelang pemerintah.',
      'Artikel ini memaparkan langkah demi langkah pendaftaran legalitas PT Perorangan, pendaftaran hak kekayaan intelektual (HAKI merek), serta perlindungan hukum ketenagakerjaan.'
    ],
    imageUrl: '/src/assets/images/jakarta_stock_exchange_1791220920565.jpg',
    imageCaption: 'Sosialisasi pengurusan legalitas dan perizinan usaha digital bagi pelaku UMKM. (Foto: Rubrik Legalitas Arun News)',
    author: 'Adv. Hendra Setyawan, S.H., M.H.',
    publishedAt: '2 jam lalu',
    timestamp: Date.now() - 120 * 60 * 1000,
    readTime: '5 menit',
    viewsCount: 35400,
    commentCount: 76,
    tags: ['Legalitas', 'Hukum', 'NIB', 'OSS', 'UMKM', 'Perizinan']
  },
  {
    id: 'art-7',
    title: 'Lapor Warga: Jembatan Gantung Penghubung Dua Desa Rusak Berat, Warga Minta Tanggap Darurat',
    slug: 'lapor-warga-jembatan-gantung-rusak-berat',
    category: 'lapor_warga',
    categoryName: 'Lapor Warga',
    subCategory: 'Fasilitas Umum',
    summary: 'Akses vital penyeberangan anak sekolah dan pengangkut hasil tani di Desa Sukamaju terancam putus akibat tiang pondasi tergerus arus sungai deras.',
    content: [
      'BOGOR - Melalui kanal Lapor Warga Arun News, warga Desa Sukamaju dan Desa Mekarsari mengadukan kondisi jembatan gantung yang alas kayunya lapuk dan tali seling bajanya renggang.',
      'Setiap hari, lebih dari 300 siswa sekolah dasar harus menyeberang dengan penuh kehati-hatian karena tidak ada jalan alternatif kecuali memutar sejauh 14 kilometer.',
      'Warga berharap Dinas Pekerjaan Umum dan BPBD segera meninjau ke lokasi untuk memasang jembatan darurat sebelum musim hujan lebat mencapai puncaknya.',
      'Redaksi Arun News telah meneruskan laporan ini kepada instansi terkait untuk tindak lanjut resmi.'
    ],
    imageUrl: '/src/assets/images/indonesia_breaking_news_1791220903229.jpg',
    imageCaption: 'Kondisi jembatan gantung yang dilaporkan warga memerlukan perbaikan mendesak. (Foto: Kiriman Warga / Kanal Lapor Warga)',
    author: 'Redaksi Lapor Warga',
    publishedAt: '2 jam lalu',
    timestamp: Date.now() - 140 * 60 * 1000,
    readTime: '3 menit',
    viewsCount: 52100,
    commentCount: 165,
    isBreaking: false,
    isEditorPick: true,
    tags: ['Lapor Warga', 'Aspirasi', 'Jembatan Rusak', 'Fasilitas Umum', 'Suara Rakyat']
  },
  {
    id: 'art-8',
    title: 'Inovasi Panel Surya Murah Ramah Lingkungan untuk Rumah Tangga Karya Anak Bangsa',
    slug: 'inovasi-panel-surya-murah-ramah-lingkungan',
    category: 'lain_lain',
    categoryName: 'Lain-lain',
    subCategory: 'Teknologi & Sains',
    summary: 'Teknologi sel fotovoltaik berbasis bahan semikonduktor lokal mampu memangkas tagihan listrik hingga 45% dengan instalasi mandiri yang praktis.',
    content: [
      'BANDUNG - Mahasiswa dan tim riset teknik elektro memperkenalkan panel surya mikro yang dirancang khusus untuk atap rumah berdaya 900–2.200 VA.',
      'Efisiensi konversi daya mencapai 21% bahkan dalam kondisi cuaca mendung, didukung aplikasi pemantauan produksi daya lewat smartphone.',
      'Produk inovasi ini direncanakan memasuki tahap uji sertifikasi keselamatan listrik nasional pada akhir kuartal ini.'
    ],
    imageUrl: '/src/assets/images/indonesia_tech_summit_1791220945719.jpg',
    imageCaption: 'Prototipe panel surya pintar hemat biaya yang dipamerkan di Bandung. (Foto: Rubrik Sains Arun News)',
    author: 'Clara Bella',
    publishedAt: '3 jam lalu',
    timestamp: Date.now() - 180 * 60 * 1000,
    readTime: '3 menit',
    viewsCount: 19800,
    commentCount: 38,
    tags: ['Lain-lain', 'Teknologi', 'Energi Surya', 'Inovasi', 'Gaya Hidup']
  }
];

export const POPULAR_ARTICLES = [
  {
    rank: 1,
    id: 'art-3',
    title: 'Timnas Indonesia Tampil Gemilang di Kualifikasi Piala Dunia di Hadapan 75 Ribu Suporter GBK',
    category: 'Olahraga',
    categoryColor: '#e53935',
    views: '95.4K dibaca'
  },
  {
    rank: 2,
    id: 'art-7',
    title: 'Lapor Warga: Jembatan Gantung Penghubung Dua Desa Rusak Berat, Warga Minta Tanggap Darurat',
    category: 'Lapor Warga',
    categoryColor: '#ea580c',
    views: '52.1K dibaca'
  },
  {
    rank: 3,
    id: 'art-1',
    title: 'Pemerintah Resmikan Koridor Baru Kereta Cepat dan Tol Terintegrasi Antardaerah',
    category: 'Politik',
    categoryColor: '#004a99',
    views: '48.9K dibaca'
  },
  {
    rank: 4,
    id: 'art-4',
    title: 'Polda Metro Jaya Bongkar Jaringan Sindikat Penipuan Siber Transnasional Rp 35 Miliar',
    category: 'Kriminal',
    categoryColor: '#b91c1c',
    views: '41.5K dibaca'
  },
  {
    rank: 5,
    id: 'art-6',
    title: 'Panduan Lengkap Legalitas Usaha OSS RBA dan Sertifikasi Halal Gratis bagi Pelaku UMKM',
    category: 'Legalitas',
    categoryColor: '#4f46e5',
    views: '35.4K dibaca'
  },
  {
    rank: 6,
    id: 'art-2',
    title: 'IHSG Melonjak Sentuh Level Tertinggi Baru Didorong Arus Modal Masuk Asing',
    category: 'Ekonomi',
    categoryColor: '#0070ba',
    views: '31.2K dibaca'
  },
  {
    rank: 7,
    id: 'art-5',
    title: 'Pemerintah Provinsi Percepat Revitalisasi Jalur Logistik Pantura dan Kawasan Industri Daerah',
    category: 'Daerah',
    categoryColor: '#0284c7',
    views: '23.6K dibaca'
  },
  {
    rank: 8,
    id: 'art-8',
    title: 'Inovasi Panel Surya Murah Ramah Lingkungan untuk Rumah Tangga Karya Anak Bangsa',
    category: 'Lain-lain',
    categoryColor: '#6b7280',
    views: '19.8K dibaca'
  },
  {
    rank: 9,
    id: 'art-extra-1',
    title: 'DPR Bahas RUU Perlindungan Konsumen Digital dan Kepastian Hukum E-Commerce',
    category: 'Politik',
    categoryColor: '#004a99',
    views: '17.3K dibaca'
  },
  {
    rank: 10,
    id: 'art-extra-2',
    title: 'Polres Gagalkan Penyelundupan 50 Kg Sabu di Jalur Lintas Sumatera',
    category: 'Kriminal',
    categoryColor: '#b91c1c',
    views: '15.9K dibaca'
  }
];

export const TRENDING_TAGS = [
  '#PolitikNasional',
  '#TimnasDay',
  '#OperasiSiber',
  '#IHSGHijau',
  '#LaporWarga',
  '#LegalitasUsaha',
  '#PembangunanDaerah',
  '#HargaBahanPokok',
  '#KonsultasiHukum'
];

export const BREAKING_NEWS_ITEMS = [
  {
    id: 'b-1',
    headline: 'BREAKING: Gempa M 5.2 Guncang Pesisir Selatan Jawa, BMKG Pastikan Tidak Berpotensi Tsunami',
    time: 'Baru saja',
    category: 'Daerah'
  },
  {
    id: 'b-2',
    headline: 'Polda Metro Tangkap Sindikat Pemalsu Dokumen Legalitas Tanah dan Izin Properti',
    time: '10 menit lalu',
    category: 'Kriminal'
  },
  {
    id: 'b-3',
    headline: 'Sidang Paripurna DPR Sahkan Perubahan Regulasi Insentif Pajak untuk Usaha Kecil Daerah',
    time: '20 menit lalu',
    category: 'Politik'
  }
];

export const INITIAL_COMMENTS: Record<string, Array<{
  id: string;
  articleId: string;
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
  upvotes: number;
  downvotes: number;
}>> = {
  'art-1': [
    {
      id: 'c-1',
      articleId: 'art-1',
      author: 'Bambang Soedjarwo',
      avatar: 'BS',
      timestamp: '15 menit lalu',
      text: 'Semoga integrasi moda transportasi ini terus diperluas hingga seluruh pelosok daerah. Sangat membantu mobilitas warga!',
      upvotes: 42,
      downvotes: 1
    }
  ],
  'art-7': [
    {
      id: 'c-2',
      articleId: 'art-7',
      author: 'H. Suryadi',
      avatar: 'HS',
      timestamp: '30 menit lalu',
      text: 'Betul sekali, anak-anak kami tiap pagi cemas lewat jembatan itu. Mohon Pemkab Bogor segera turun tangan memasang jembatan bailey!',
      upvotes: 89,
      downvotes: 0
    }
  ],
  'art-4': [
    {
      id: 'c-3',
      articleId: 'art-4',
      author: 'Agus Santoso',
      avatar: 'AS',
      timestamp: '20 menit lalu',
      text: 'Apresiasi untuk jajaran kepolisian! Sindikat penipu seperti ini sangat meresahkan masyarakat awam.',
      upvotes: 64,
      downvotes: 0
    }
  ]
};
