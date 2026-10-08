import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  X, 
  Send, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  User
} from 'lucide-react';
import { NewsArticle } from '../types/news';
import { auth } from '../services/firebase';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newArticle: NewsArticle) => void;
}

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [categoryType, setCategoryType] = useState('Fasilitas Umum');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && auth.currentUser) {
      if (auth.currentUser.displayName && !name) {
        setName(auth.currentUser.displayName);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newReport: NewsArticle = {
      id: `report-${Date.now()}`,
      title: `[Lapor Warga] ${title.trim()} (${location || 'Warga Setempat'})`,
      slug: `lapor-warga-${Date.now()}`,
      category: 'lapor_warga',
      categoryName: 'Lapor Warga',
      subCategory: categoryType,
      summary: description.slice(0, 160) + (description.length > 160 ? '...' : ''),
      content: [
        `LOKASI: ${location || 'Tidak disebutkan'} · KATEGORI: ${categoryType}`,
        `PELAPOR: ${name || 'Warga Anonim'}`,
        description.trim(),
        'Catatan Redaksi Arun News: Laporan ini telah diverifikasi awal dan diteruskan secara terbuka kepada instansi dan dinas terkait untuk proses penanganan lebih lanjut.'
      ],
      imageUrl: '/src/assets/images/indonesia_breaking_news_1791220903229.jpg',
      imageCaption: `Laporan warga perihal ${title.trim()} di ${location || 'wilayah setempat'}. (Foto: Dok. Pelapor Warga)`,
      author: name.trim() || 'Warga Pelapor',
      publishedAt: 'Baru saja',
      timestamp: Date.now(),
      readTime: '2 menit',
      viewsCount: 1,
      commentCount: 0,
      isBreaking: true,
      tags: ['Lapor Warga', categoryType, location || 'Daerah', 'Aspirasi']
    };

    onSubmitReport(newReport);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      setPhone('');
      setLocation('');
      setTitle('');
      setDescription('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-amber-500 text-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                Kanal Lapor Warga Arun News
              </h3>
              <p className="text-xs text-slate-900 font-medium">
                Sampaikan aduan fasilitas rusak, keluhan pelayanan, atau aspirasi
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-950 hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Laporan Berhasil Dikirim!
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
              Terima kasih atas partisipasi Anda. Laporan telah dipublikasikan di kanal Lapor Warga dan akan kami pantau tindak lanjutnya.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm overflow-y-auto max-h-[75vh]">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Laporan Anda akan ditayangkan di portal Arun News dan dapat dipantau oleh dinas terkait serta masyarakat luas.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Aduan / Laporan <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-xs sm:text-sm focus:border-amber-500"
              >
                <option value="Fasilitas Umum">Fasilitas Umum (Jalan / Jembatan / Taman)</option>
                <option value="Keluhan Pelayanan">Keluhan Pelayanan Publik / Administrasi</option>
                <option value="Infrastruktur Rusak">Infrastruktur Rusak / Bahaya Lingkungan</option>
                <option value="Aspirasi Warga">Aspirasi & Usulan Pembangunan</option>
                <option value="Lampu Jalan & Listrik">Penerangan Jalan & Gangguan Listrik</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Laporan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Lampu Penerangan Jalan Protokol Padam 3 Pekan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-xs sm:text-sm focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Lokasi Kejadian</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jl. Sudirman Km 4, Bogor"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-xs sm:text-sm focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>Nama Pelapor (Boleh Anonim)</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Anda atau Anonim"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-xs sm:text-sm focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Rincian Kronologi & Aduan <span className="text-red-500">*</span></span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Ceritakan kondisi lapangan, kendala yang dialami warga, dan harapan penanganannya..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-xs sm:text-sm focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-[#004a99] hover:bg-blue-800 text-amber-300 border border-amber-400/40 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Laporan Sekarang</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
