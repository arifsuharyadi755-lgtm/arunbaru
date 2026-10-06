import { NewsArticle } from '../types/news';

export interface Columnist {
  id: string;
  name: string;
  title: string;
  avatarText: string;
  bio: string;
  articleCount: number;
}

export const OPINION_COLUMNISTS: Columnist[] = [
  {
    id: 'col-1',
    name: 'Prof. Dr. Satria Wicaksono',
    title: 'Guru Besar Hukum Tata Negara Universitas Indonesia',
    avatarText: 'SW',
    bio: 'Pemerhati konstitusi, peradilan, dan etika kelembagaan publik dengan pengalaman riset lebih dari 25 tahun.',
    articleCount: 18
  },
  {
    id: 'col-2',
    name: 'Dr. Hendri Saparini',
    title: 'Ekonom Senior & Direktur Eksekutif Riset Kebijakan',
    avatarText: 'HS',
    bio: 'Fokus pada ketahanan pangan, struktur APBN, dan perlindungan daya beli masyarakat kelas menengah.',
    articleCount: 24
  },
  {
    id: 'col-3',
    name: 'Ayu Lestari, M.Hum.',
    title: 'Esais, Sastrawan & Pemerhati Transformasi Sosial',
    avatarText: 'AL',
    bio: 'Menulis secara berkala tentang etika ruang publik, fenomena digitalisasi budaya, dan wacana kemanusiaan.',
    articleCount: 15
  },
  {
    id: 'col-4',
    name: 'Ir. Budi Rahardjo, Ph.D.',
    title: 'Pakar Keamanan Siber & Dosen Teknik Komputer',
    avatarText: 'BR',
    bio: 'Peneliti kecerdasan buatan, kedaulatan data nasional, dan arsitektur internet masa depan.',
    articleCount: 21
  }
];

export const OPINION_ARTICLES: NewsArticle[] = [
  {
    id: 'op-1',
    title: 'Arah Reformasi Hukum & Etika Kelembagaan: Menolak Normalisasi Kompromi Moral',
    slug: 'arah-reformasi-hukum-dan-etika-kelembagaan-negara',
    category: 'politik',
    categoryName: 'Politik',
    subCategory: 'Hukum & Tata Negara',
    isOpinion: true,
    author: 'Prof. Dr. Satria Wicaksono',
    authorRole: 'Guru Besar Hukum Tata Negara',
    authorAvatar: 'SW',
    authorBio: 'Pemerhati konstitusi dan etika kelembagaan publik dengan pengalaman riset 25 tahun.',
    pullQuote: 'Hukum tanpa komitmen etika hanya akan menjadi instrumen kekuasaan formal yang kehilangan jiwa keadilannya bagi rakyat.',
    summary: 'Normalisasi pelanggaran etika berisiko merapuhkan fondasi negara hukum. Diperlukan penegakan integritas substantif pada lembaga peradilan dan legislatif.',
    content: [
      'Ketika hukum hanya dimaknai sebagai kepatuhan pasal demi pasal formalitas, kita sesungguhnya sedang membiarkan kekosongan moral menggerogoti pilar republik. Negara hukum (rechstaat) bukanlah sekadar tumpukan lembaran undang-undang, melainkan komitmen luhur para pemangku amanah untuk menempatkan keadilan di atas kepentingan faksi.',
      'Dalam beberapa tahun terakhir, kita menyaksikan kecenderungan memprihatinkan: normalisasi manuver batas abu-abu (grey area). Selama suatu tindakan tidak secara eksplisit diancam pidana, tindakan tersebut dianggap sah-sah saja, mengabaikan fatsun moral dan rasa keadilan masyarakat luas.',
      'Padahal, bapak pendiri bangsa kita meletakkan etika sebagai kompas tertinggi. Tanpa etika, kekuasaan memiliki kecenderungan alamiah untuk mereproduksi dirinya sendiri dengan mengunci saluran kontrol konstitusional.',
      '"Hukum tanpa komitmen etika hanya akan menjadi instrumen kekuasaan formal yang kehilangan jiwa keadilannya bagi rakyat."',
      'Langkah korektif tidak bisa lagi ditunda. Penguatan komisi-komisi etika independen, transparansi proses seleksi pejabat publik tanpa patronase politik, serta keterlibatan aktif masyarakat sipil adalah prasyarat mutlak jika kita tidak ingin demokrasi kita merosot menjadi sekadar demokrasi prosedural hampa makna.'
    ],
    imageUrl: '/src/assets/images/indonesia_breaking_news_1791220903229.jpg',
    imageCaption: 'Gedung Mahkamah Konstitusi dan ruang sidang uji materi regulasi di Jakarta. (Foto: Dokumentasi Arun News)',
    publishedAt: '3 jam lalu',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    readTime: '6 menit baca',
    viewsCount: 38450,
    commentCount: 92,
    isEditorPick: true,
    tags: ['Opini', 'Hukum Tata Negara', 'Etika Publik', 'Demokrasi', 'Reformasi']
  },
  {
    id: 'op-2',
    title: 'Menimbang Daya Beli Rakyat di Tengah Disrupsi Global dan Beban Fiskal',
    slug: 'menimbang-daya-beli-rakyat-disrupsi-global-beban-fiskal',
    category: 'ekonomi',
    categoryName: 'Ekonomi',
    subCategory: 'Ekonomi Politik',
    isOpinion: true,
    author: 'Dr. Hendri Saparini',
    authorRole: 'Ekonom Senior & Peneliti Kebijakan Publik',
    authorAvatar: 'HS',
    authorBio: 'Direktur riset kebijakan fiskal, moneter, dan penguatan UMKM nasional.',
    pullQuote: 'Pertumbuhan ekonomi di atas kertas tidak bermakna jika dapur kelas menengah bawah kian tercekik inflasi kebutuhan pangan pokok.',
    summary: 'Angka pertumbuhan 5 persen perlu diuji secara kualitatif: sejauh mana penciptaan lapangan kerja formal mampu mengimbangi kenaikan biaya hidup sehari-hari.',
    content: [
      'Statistik makroekonomi kita kerap menampilkan potret yang menenteramkan: inflasi terkendali, pertumbuhan produk domestik bruto bertahan di atas 5 persen, dan neraca perdagangan mencatat surplus berkala.',
      'Namun di tingkat akar rumput, narasi keseharian menyuarakan kenyataan yang berbeda. Ibu-ibu rumah tangga dan para pekerja informal merasakan tekanan nyata dari melambungnya harga beras, minyak goreng, sewa tempat tinggal, serta iuran kesehatan dan pendidikan.',
      'Fenomena "fenomena kelas menengah yang rentan jatuh miskin" (the aspiring middle class) bukanlah mitos statistik. Mereka adalah jutaan keluarga yang tidak berhak menerima bansos tunai, namun tabungannya terus tergerus karena upah riil yang stagnan.',
      'Kebijakan fiskal kita harus bergeser dari sekadar mengejar target penerimaan jangka pendek melalui kenaikan tarif pajak konsumsi, menuju penguatan bantalan daya beli dan stimulus langsung bagi sektor riil padat karya.',
      'Jika konsumsi domestik yang menjadi motor 53 persen PDB kita melemah, roda pertumbuhan ekonomi nasional akan kehilangan tenaga penggerak utamanya.'
    ],
    imageUrl: '/src/assets/images/jakarta_stock_exchange_1791220920565.jpg',
    imageCaption: 'Aktivitas perdagangan dan lalu lintas ekonomi perkotaan di Jakarta. (Foto: Rubrik Opini Arun News)',
    publishedAt: '5 jam lalu',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    readTime: '5 menit baca',
    viewsCount: 29120,
    commentCount: 64,
    isEditorPick: true,
    tags: ['Opini', 'Ekonomi', 'Daya Beli', 'Kelas Menengah', 'Fiskal']
  },
  {
    id: 'op-3',
    title: 'Ruang Publik yang Beradab: Mengapa Algoritma Medsos Mengikis Kemampuan Kita Mendengarkan?',
    slug: 'ruang-publik-yang-beradab-algoritma-medsos-mengikis-dialog',
    category: 'lain_lain',
    categoryName: 'Lain-lain',
    subCategory: 'Sosial & Budaya',
    isOpinion: true,
    author: 'Ayu Lestari, M.Hum.',
    authorRole: 'Esais & Pemerhati Transformasi Sosial',
    authorAvatar: 'AL',
    authorBio: 'Penulis esai budaya dan pengkaji dinamika percakapan digital masyarakat kontemporer.',
    pullQuote: 'Ketika kemarahan dimonetisasi oleh algoritma linimasa, keheningan berpikir menjadi bentuk perlawanan budaya yang paling radikal.',
    summary: 'Di tengah banjir polarisasi digital, portal berita dan ruang literasi harus kembali menjadi wahana verifikasi akal sehat dan perjumpaan gagasan yang santun.',
    content: [
      'Kita hidup dalam era di mana perhatian manusia adalah komoditas paling diperebutkan. Algoritma media sosial dirancang dengan presisi matematis untuk satu hal: mempertahankan pandangan kita di layar selama mungkin. Dan tidak ada yang lebih efektif memicu klik selain rasa marah, keterkejutan, dan pembenaran kelompok sendiri.',
      'Dampaknya adalah pengikisan drastis kemampuan kita untuk mendengarkan perspektif orang lain. Setiap isu kompleks direduksi menjadi hitam-putih, kawan atau lawan, tagar viral atau cibiran sarkastik.',
      'Ruang publik Habermasian yang dicita-citakan sebagai arena deliberasi rasional kini berubah menjadi colosseum digital di mana tepuk tangan diraih lewat hinaan paling tajam.',
      'Kita membutuhkan jeda kontemplatif. Jurnalisme mendalam dan kolom esai hadir bukan untuk menambah kebisingan, melainkan mengajak pembaca mengunyah argumen secara tenang, menguji premis, dan menemukan titik temu kemanusiaan di balik perbedaan pandangan politik.',
      'Hanya dengan merawat ruang publik yang beradab itulah, kebinekaan bangsa ini dapat terus bertahan menghadapi gelombang disrupsi zaman.'
    ],
    imageUrl: '/src/assets/images/indonesia_tech_summit_1791220945719.jpg',
    imageCaption: 'Refleksi interaksi manusia di era ledakan layar digital dan kecerdasan artifisial. (Foto: Esai Arun News)',
    publishedAt: '8 jam lalu',
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    readTime: '7 menit baca',
    viewsCount: 42300,
    commentCount: 118,
    isEditorPick: true,
    tags: ['Esai', 'Kebudayaan', 'Ruang Publik', 'Media Sosial', 'Literasi']
  },
  {
    id: 'op-4',
    title: 'Kedaulatan Digital: Saat Data Warga Menjadi Komoditas Raksasa AI Asing',
    slug: 'kedaulatan-digital-saat-data-warga-menjadi-komoditas-ai-asing',
    category: 'lain_lain',
    categoryName: 'Lain-lain',
    subCategory: 'Sains & Teknologi',
    isOpinion: true,
    author: 'Ir. Budi Rahardjo, Ph.D.',
    authorRole: 'Pakar Keamanan Siber & Dosen ITB',
    authorAvatar: 'BR',
    authorBio: 'Pakar teknologi informasi dan pengkaji tata kelola kecerdasan buatan nasional.',
    pullQuote: 'Kedaulatan bangsa di abad ke-21 tidak lagi diukur dari benteng fisik, melainkan integritas kode dan infrastruktur cloud data bangsanya.',
    summary: 'Ledakan teknologi kecerdasan buatan menuntut Indonesia memiliki arsitektur perlindungan data pribadi dan ekosistem data center berdaulat.',
    content: [
      'Perbincangan mengenai kecerdasan artifisial sering kali didominasi decak kagum atas efisiensi otomasi dan kemampuan model generatif menjawab segala persoalan. Namun kita jarang menanyakan pertanyaan paling mendasar: data siapa yang dipakai melatih mesin-mesin raksasa tersebut?',
      'Setiap hari, jutaan interaksi digital warga Indonesia diserap ke server-server yang terletak ribuan mil jauhnya tanpa ada kepastian bagaimana data tersebut diolah, dianonimkan, atau dimonetisasi.',
      'Kedaulatan siber bukan berarti menutup diri dari kolaborasi global. Kedaulatan berarti kita memiliki aturan main yang tegas, kepatuhan yurisdiksi yang ditegakkan tanpa kompromi, dan kemampuan mandiri mengembangkan talenta insinyur lokal.',
      'UU Pelindungan Data Pribadi (PDP) adalah modal awal yang baik, namun tanpa lembaga otoritas pengawas independen yang bergigi, regulasi tersebut berisiko menjadi macan kertas.',
      'Saatnya Indonesia tidak hanya menjadi pasar konsumtif teknologi, melainkan produsen solusi digital yang berakar pada kepentingan nasional.'
    ],
    imageUrl: '/src/assets/images/indonesia_tech_summit_1791220945719.jpg',
    imageCaption: 'Pusat data komputasi awan dan inovasi teknologi digital Indonesia. (Foto: Dok. Kolom Sains Arun News)',
    publishedAt: '12 jam lalu',
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    readTime: '5 menit baca',
    viewsCount: 26500,
    commentCount: 52,
    isEditorPick: false,
    tags: ['Opini', 'Teknologi', 'Kedaulatan Digital', 'Kecerdasan Buatan', 'Siber']
  }
];
