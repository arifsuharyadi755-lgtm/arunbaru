import React, { useState, useEffect } from 'react';
import { 
  X, 
  PenTool, 
  Send, 
  CheckCircle2, 
  FileText, 
  Eye, 
  HelpCircle, 
  Quote, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';
import { NewsArticle } from '../types/news';
import { auth } from '../services/firebase';

interface OpinionSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpinionSubmitted: (newArticle: NewsArticle) => void;
}

export const OpinionSubmissionModal: React.FC<OpinionSubmissionModalProps> = ({
  isOpen,
  onClose,
  onOpinionSubmitted
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'guidelines' | 'preview'>('form');

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'politik' | 'ekonomi' | 'lain_lain' | 'legalitas'>('politik');
  const [subCategory, setSubCategory] = useState('Hukum & Tata Negara');
  const [title, setTitle] = useState('');
  const [pullQuote, setPullQuote] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedArticle, setSubmittedArticle] = useState<NewsArticle | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && auth.currentUser) {
      if (auth.currentUser.displayName && !authorName) {
        setAuthorName(auth.currentUser.displayName);
      }
      if (auth.currentUser.email && !email) {
        setEmail(auth.currentUser.email);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!authorName.trim() || !authorRole.trim() || !email.trim()) {
      setErrorMsg('Harap lengkapi identitas dan kontak penulis.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setErrorMsg('Harap masukkan judul dan naskah lengkap esai.');
      return;
    }

    if (wordCount < 150) {
      setErrorMsg(`Naskah minimal 150 kata (saat ini ${wordCount} kata) untuk memberikan kedalaman analisis.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Split paragraphs
      const paragraphs = content
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const initials = authorName
        .split(' ')
        .map(w => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

      const newOpArticle: NewsArticle = {
        id: `op-user-${Date.now()}`,
        title: title.trim(),
        slug: title.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        category,
        categoryName: category === 'politik' ? 'Politik' : category === 'ekonomi' ? 'Ekonomi' : 'Opini',
        subCategory,
        isOpinion: true,
        author: authorName.trim(),
        authorRole: authorRole.trim(),
        authorAvatar: initials || 'OP',
        authorBio: `${authorRole.trim()} - Kontributor Opini Arun News.`,
        pullQuote: pullQuote.trim() || paragraphs[0]?.slice(0, 140) + '...',
        summary: paragraphs[0] || 'Esai opini kontributor masyarakat di kanal Arun News.',
        content: paragraphs,
        imageUrl: '/src/assets/images/indonesia_breaking_news_1791220903229.jpg',
        imageCaption: `Ilustrasi naskah opini "${title}". (Foto: Arun News)`,
        publishedAt: 'Baru saja',
        timestamp: Date.now(),
        readTime: `${Math.max(2, Math.round(wordCount / 180))} menit baca`,
        viewsCount: 1,
        commentCount: 0,
        isEditorPick: true,
        tags: ['Opini Publik', 'Esai Pembaca', subCategory, 'Kolom']
      };

      try {
        const saved = localStorage.getItem('arun_user_opinions_v1');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift(newOpArticle);
        localStorage.setItem('arun_user_opinions_v1', JSON.stringify(list));
      } catch {
        // ignore
      }

      setSubmittedArticle(newOpArticle);
      setIsSubmitting(false);
      onOpinionSubmitted(newOpArticle);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedArticle(null);
    setTitle('');
    setPullQuote('');
    setContent('');
    setActiveTab('form');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col transition-colors"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003875] to-[#004a99] flex items-center justify-center text-amber-300 shadow-md border border-amber-400/40 shrink-0">
              <PenTool className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Kirim Tulisan Kolom & Esai
                </h3>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-2xs">
                  Redaksi Arun
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ruang bagi akademisi, peneliti, praktisi, dan mahasiswa menyuarakan gagasan publik
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        {!submittedArticle && (
          <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 flex gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'form'
                  ? 'border-amber-400 text-[#004a99] dark:text-amber-300 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Tulis Naskah Esai</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'preview'
                  ? 'border-amber-400 text-[#004a99] dark:text-amber-300 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2. Pratinjau Tampilan</span>
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'guidelines'
                  ? 'border-amber-400 text-[#004a99] dark:text-amber-300 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pedoman Penulisan</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {submittedArticle ? (
            /* SUCCESS CONFIRMATION */
            <div className="py-6 px-4 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Status: Terbit di Portal
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 font-serif">
                  Naskah Opini Berhasil Ditayangkan!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Terima kasih, <strong>{submittedArticle.author}</strong>. Naskah Anda yang berjudul <em>&ldquo;{submittedArticle.title}&rdquo;</em> telah masuk ke dalam kurasi kolom opini Arun News dan siap dibaca publik.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-[#004a99] hover:bg-[#003d80] text-amber-300 font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat di Kanal Opini Sekarang</span>
                </button>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Kirim Naskah Baru
                </button>
              </div>
            </div>
          ) : activeTab === 'guidelines' ? (
            /* GUIDELINES TAB */
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm mb-1">
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Standar & Pedoman Penulisan Kolom Opini Arun News</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Kolom Arun News adalah wahana gagasan independen dan pencerahan publik yang menjunjung tinggi etika berdemokrasi.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-[#004a99] dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Orisinalitas & Eksklusivitas:</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Naskah harus karya asli penulis, belum pernah dipublikasikan di media massa lain atau blog pribadi.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-[#004a99] dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Panjang Naskah:</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Disarankan berkisar antara 700 hingga 1.200 kata, disusun dengan argumen logis dan data pendukung yang valid.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-[#004a99] dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Etika & Akal Sehat:</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Tidak mengandung ujaran kebencian, pencemaran nama baik, fitnah, maupun isu SARA yang memecah belah bangsa.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-[#004a99] dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Hak Cipta & Tanggung Jawab:</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Substansi tulisan merupakan pandangan dan tanggung jawab pribadi penulis, redaksi berhak menyunting judul dan tipografi tanpa mengubah esensi gagasan.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('form')}
                  className="px-4 py-2 bg-[#004a99] text-amber-300 text-xs font-bold rounded-lg hover:bg-[#003875] transition-colors"
                >
                  Mulai Menulis Naskah
                </button>
              </div>
            </div>
          ) : activeTab === 'preview' ? (
            /* PREVIEW TAB */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#004a99] text-amber-300 font-bold text-sm flex items-center justify-center">
                    {authorName ? authorName[0]?.toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {authorName || 'Nama Penulis Kolom'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {authorRole || 'Gelar / Afiliasi / Profesi Anda'}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1.5">
                  KOLOM OPINI · {subCategory}
                </div>

                <h3 className="text-lg sm:text-2xl font-black font-serif text-slate-900 dark:text-slate-100 leading-snug mb-3">
                  {title || 'Judul Naskah Opini Anda yang Menggugah'}
                </h3>

                {pullQuote && (
                  <div className="p-3 my-3 rounded-lg bg-amber-100/50 dark:bg-slate-800 border-l-4 border-amber-400 italic font-serif text-xs text-slate-800 dark:text-slate-200">
                    &ldquo;{pullQuote}&rdquo;
                  </div>
                )}

                <div className="font-serif text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap">
                  {content || 'Isi paragraf tulisan opini Anda akan tampil di sini dengan tipografi jurnalistik yang nyaman dibaca.'}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg"
                >
                  Kembali ke Formulir
                </button>
              </div>
            </div>
          ) : (
            /* FORM TAB */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Penulis & Gelar Akademik *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Contoh: Dr. Irwan Setiawan, S.H., M.Hum."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Profesi / Jabatan / Afiliasi Institusi *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dosen Kebijakan Publik Universitas Gadjah Mada"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Email Kontak *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="penulis@kampus.ac.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp (Konfirmasi Redaksi)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="0812-xxxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Topic / Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Bidang Kajian
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setCategory(val);
                      if (val === 'politik') setSubCategory('Hukum & Tata Negara');
                      else if (val === 'ekonomi') setSubCategory('Ekonomi Politik');
                      else if (val === 'legalitas') setSubCategory('Legalitas & Keadilan');
                      else setSubCategory('Sosial & Budaya');
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="politik">Politik, Demokrasi & Tata Negara</option>
                    <option value="ekonomi">Ekonomi, Fiskal & Bisnis</option>
                    <option value="legalitas">Hukum, Hak Warga & Legalitas</option>
                    <option value="lain_lain">Sosial, Kebudayaan & Sains Teknologi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sub-topik Spesifik
                  </label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Essay Content */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Esai Opini *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Menata Ulang Demokrasi Konstitusional Pasca Pemilu"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kutipan Kunci / Gagasan Pokok (Pull Quote)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Contoh: Demokrasi yang sehat tidak boleh mematikan nalar kritis warganya."
                      value={pullQuote}
                      onChange={(e) => setPullQuote(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <Quote className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Naskah Lengkap Tulisan * (Pisahkan antar paragraf dengan baris kosong)
                    </label>
                    <span className={`text-[11px] font-mono ${wordCount >= 150 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                      {wordCount} Kata {wordCount < 150 ? '(Minimal 150 kata)' : '✓ Memenuhi syarat'}
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    placeholder="Tuliskan naskah esai opini Anda di sini secara runut dan bernas..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs sm:text-sm font-serif rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="text-xs text-blue-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau Redaksi</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Mengirimkan Naskah...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Kirimkan ke Redaksi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
