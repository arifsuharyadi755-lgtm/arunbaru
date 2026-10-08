import React, { useState } from 'react';
import { 
  X, 
  Megaphone, 
  CheckCircle2, 
  Eye, 
  Send, 
  TrendingUp, 
  ExternalLink, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  Tag, 
  Sparkles, 
  Check, 
  Layers, 
  HelpCircle,
  MessageCircle,
  Clock
} from 'lucide-react';
import { 
  AD_PACKAGES, 
  AdPlacementType, 
  AdSubmission 
} from '../types/advertising';
import { CATEGORIES } from '../data/newsData';
import { firestoreService } from '../services/firestoreService';
import { auth } from '../services/firebase';

interface AdvertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCreated?: (newAd: AdSubmission) => void;
}

export const AdvertiseModal: React.FC<AdvertiseModalProps> = ({
  isOpen,
  onClose,
  onAdCreated
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'order' | 'preview'>('packages');
  const [selectedPackageId, setSelectedPackageId] = useState<AdPlacementType>('leaderboard_top');
  
  // Form fields
  const [brandName, setBrandName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [targetCategory, setTargetCategory] = useState('all');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [bannerColorTheme, setBannerColorTheme] = useState<'blue' | 'amber' | 'emerald' | 'dark'>('blue');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<AdSubmission | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPackage = AD_PACKAGES.find(p => p.id === selectedPackageId) || AD_PACKAGES[0];

  // Calculate pricing with multi-day discount
  const getDiscountPercent = (days: number) => {
    if (days >= 30) return 25;
    if (days >= 14) return 15;
    if (days >= 7) return 10;
    return 0;
  };

  const discountPercent = getDiscountPercent(durationDays);
  const rawTotal = currentPackage.pricePerDay * durationDays;
  const finalTotal = Math.round(rawTotal * (1 - discountPercent / 100));

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!brandName.trim() || !contactName.trim() || !phoneWhatsapp.trim() || !email.trim()) {
      setErrorMsg('Harap lengkapi seluruh data kontak dan informasi brand.');
      return;
    }

    if (!headline.trim() || !description.trim()) {
      setErrorMsg('Harap isi judul promosi dan pesan iklan Anda.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newAd: AdSubmission = {
        id: `ADS-${Date.now().toString().slice(-5)}`,
        brandName: brandName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phoneWhatsapp: phoneWhatsapp.trim(),
        targetCategory,
        packageType: selectedPackageId,
        durationDays,
        startDate: new Date().toLocaleDateString('id-ID'),
        headline: headline.trim(),
        description: description.trim(),
        targetUrl: targetUrl.trim() || 'https://arunnews.id',
        totalCost: finalTotal,
        status: 'approved',
        createdAt: new Date().toLocaleString('id-ID')
      };

      try {
        const existing = localStorage.getItem('arun_ads_submissions_v1');
        const list = existing ? JSON.parse(existing) : [];
        list.unshift(newAd);
        localStorage.setItem('arun_ads_submissions_v1', JSON.stringify(list));
      } catch {
        // ignore
      }

      // Save to Firestore
      firestoreService.addAdSubmission(newAd).catch(err => console.warn('Firestore ad save:', err));

      setSubmittedData(newAd);
      setIsSubmitting(false);

      if (onAdCreated) {
        onAdCreated(newAd);
      }
    }, 700);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setBrandName('');
    setContactName('');
    setPhoneWhatsapp('');
    setEmail('');
    setHeadline('');
    setDescription('');
    setTargetUrl('');
    setActiveTab('packages');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col transition-colors"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003875] to-[#004a99] flex items-center justify-center text-amber-300 shadow-md border border-amber-400/40 shrink-0">
              <Megaphone className="w-5 h-5 text-amber-300 fill-amber-300/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Layanan Pasang Iklan Arun News
                </h3>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-2xs uppercase">
                  Media Kit 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Jangkau lebih dari 15.000.000+ pembaca berita aktif dan audiens pembuat keputusan se-Indonesia
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

        {/* Modal Navigation Tabs */}
        {!submittedData && (
          <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === 'packages'
                  ? 'border-amber-400 text-[#004a99] dark:text-amber-300 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Format & Paket Iklan</span>
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === 'order'
                  ? 'border-amber-400 text-[#004a99] dark:text-amber-300 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>2. Formulir & Pesan Iklan</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === 'preview'
                  ? 'border-amber-400 text-[#004a99] dark:text-amber-300 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3. Pratinjau Banner Iklan</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {submittedData ? (
            /* SUCCESS STATE */
            <div className="py-6 px-4 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  ID Registrasi: {submittedData.id}
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
                  Pengajuan Iklan Berhasil Diterima!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Terima kasih, <strong>{submittedData.contactName}</strong>. Materi iklan untuk brand <strong>{submittedData.brandName}</strong> telah terdaftar dalam sistem periklanan Arun News dan sedang disiapkan untuk penayangan.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Format Iklan:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentPackage.title}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Durasi Penayangan:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{submittedData.durationDays} Hari</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Target Kanal:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{submittedData.targetCategory}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-extrabold text-[#004a99] dark:text-amber-300">
                  <span>Total Biaya Promosi:</span>
                  <span>{formatRupiah(submittedData.totalCost)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-[#004a99] hover:bg-[#003d80] text-amber-300 font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat Iklan di Halaman Portal</span>
                </button>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Pasang Iklan Lain
                </button>
              </div>
            </div>
          ) : activeTab === 'packages' ? (
            /* TAB 1: FORMAT & PACKAGES */
            <div className="space-y-6">
              {/* Highlight Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 text-center">
                  <div className="text-base sm:text-lg font-black text-[#004a99] dark:text-amber-300">15 Juta+</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Pembaca / Bulan</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center">
                  <div className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-400">2,85%</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Rata-rata CTR Klik</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
                  <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">8 Kanal</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Target Audiens Relevan</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-center">
                  <div className="text-base sm:text-lg font-black text-purple-700 dark:text-purple-400">24/7 Live</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Analitik & Reporting</div>
                </div>
              </div>

              {/* Package Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AD_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#004a99] dark:border-amber-400 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-1 ring-[#004a99] dark:ring-amber-400'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-[#004a99] text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            {pkg.badge}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{pkg.dimensions}</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {pkg.description}
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          {pkg.benefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Harga Mulai Dari:</div>
                          <div className="text-sm sm:text-base font-extrabold text-[#004a99] dark:text-amber-300">
                            {formatRupiah(pkg.pricePerDay)} <span className="text-[10px] font-normal text-slate-500">/ hari</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPackageId(pkg.id);
                            setActiveTab('order');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-[#004a99] text-amber-300 hover:bg-[#003d80]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Pilih Paket
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Callout */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Butuh Paket Khusus atau Kampanye Jangka Panjang?
                    </h5>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                      Tim redaksi dan marketing kami siap merancang strategi advertorial dan branding khusus bisnis Anda.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('order')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-2xs whitespace-nowrap"
                >
                  Mulai Pengajuan
                </button>
              </div>
            </div>
          ) : activeTab === 'order' ? (
            /* TAB 2: ORDER FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Selected Package Banner Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Format Dipilih:</span>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {currentPackage.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Est. {currentPackage.estImpressionsPerDay} · {formatRupiah(currentPackage.pricePerDay)}/hari
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('packages')}
                  className="text-xs text-blue-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Ganti Format
                </button>
              </div>

              {/* Brand & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Brand / Perusahaan *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Contoh: PT Sumber Pangan Nusantara"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Penanggung Jawab (PIC) *
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Anda"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="0812-3456-7890"
                      value={phoneWhatsapp}
                      onChange={(e) => setPhoneWhatsapp(e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Email Resmi *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="marketing@brandanda.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Targeting & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Kanal Penayangan
                  </label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">Semua Kanal (Portal Utama & Homepage)</option>
                    {CATEGORIES.slice(1).map(c => (
                      <option key={c.id} value={c.id}>Kanal {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi Penayangan
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { days: 3, label: '3 Hari' },
                      { days: 7, label: '7 Hari (-10%)' },
                      { days: 14, label: '14 Hari (-15%)' },
                      { days: 30, label: '30 Hari (-25%)' }
                    ].map((d) => (
                      <button
                        type="button"
                        key={d.days}
                        onClick={() => setDurationDays(d.days)}
                        className={`py-1.5 px-1 rounded-md text-[11px] font-bold transition-all text-center ${
                          durationDays === d.days
                            ? 'bg-[#004a99] text-amber-300 border border-amber-400/40 shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ad Creative Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Materi Promosi & Pesan Iklan
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="text-xs text-blue-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Lihat Pratinjau Langsung</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Judul Promosi / Headline Iklan *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Diskon Akbar Ramadhan! Solusi Bisnis & Software ERP Terpercaya"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Deskripsi Singkat / Pesan Penawaran *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Nikmati gratis implementasi dan konsultasi gratis 30 hari pertama. Dapatkan penawaran terbatas sekarang!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Tautan URL Tujuan (Landing Page / WhatsApp)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://brandanda.com/promo atau https://wa.me/..."
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                      />
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Tema Warna Banner Pratinjau
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {[
                        { id: 'blue', name: 'Biru Arun', bg: 'bg-[#004a99]' },
                        { id: 'amber', name: 'Kuning Emas', bg: 'bg-amber-400' },
                        { id: 'emerald', name: 'Hijau Modern', bg: 'bg-emerald-600' },
                        { id: 'dark', name: 'Gelap Elegan', bg: 'bg-slate-900' }
                      ].map((t) => (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => setBannerColorTheme(t.id as any)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border transition-all ${
                            bannerColorTheme === t.id
                              ? 'border-blue-600 dark:border-amber-400 font-bold bg-slate-100 dark:bg-slate-800'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${t.bg}`} />
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-slate-50 to-amber-50/60 dark:from-slate-800 dark:via-slate-850 dark:to-blue-950/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Biaya Normal ({durationDays} hari x {formatRupiah(currentPackage.pricePerDay)}):</span>
                  <span>{formatRupiah(rawTotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Diskon Paket ({discountPercent}%):</span>
                    <span>- {formatRupiah(rawTotal - finalTotal)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                  <span className="flex items-center gap-1">
                    <span>Total Estimasi Investasi:</span>
                  </span>
                  <span className="text-[#004a99] dark:text-amber-300">{formatRupiah(finalTotal)}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('packages')}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Memproses Pengajuan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 fill-slate-950" />
                      <span>Kirim Pengajuan Iklan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* TAB 3: LIVE PREVIEW */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Pratinjau Tampilan Iklan Anda
                  </h4>
                  <p className="text-xs text-slate-500">
                    Simulasi tampilan iklan saat aktif di halaman portal berita Arun News
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('order')}
                  className="px-3 py-1.5 bg-[#004a99] text-amber-300 text-xs font-bold rounded-lg hover:bg-[#003d80] transition-colors"
                >
                  Lanjut Isi Form
                </button>
              </div>

              {/* Preview 1: Leaderboard Banner */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pratinjau: Billboard Leaderboard Utama (970x90)
                </span>
                <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  bannerColorTheme === 'amber'
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-slate-950 border-amber-500/40'
                    : bannerColorTheme === 'emerald'
                    ? 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white border-emerald-600/40'
                    : bannerColorTheme === 'dark'
                    ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-slate-700'
                    : 'bg-gradient-to-r from-[#003875] via-[#004a99] to-[#002b5c] text-white border-amber-400/40'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/20 text-white tracking-widest">
                        Iklan Disponsori
                      </span>
                      <span className="text-xs font-extrabold opacity-90">
                        {brandName || 'Nama Brand / Perusahaan Anda'}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black leading-snug">
                      {headline || 'Judul Promosi Menarik yang Menarik Perhatian Pembaca Arun News'}
                    </h4>
                    <p className="text-xs opacity-85 line-clamp-1">
                      {description || 'Pesan penawaran spesial, diskon eksklusif, atau keunggulan layanan produk Anda.'}
                    </p>
                  </div>

                  <a
                    href={targetUrl || '#'}
                    onClick={(e) => e.preventDefault()}
                    className={`px-4 py-2 rounded-lg text-xs font-extrabold shadow-sm shrink-0 whitespace-nowrap transition-transform flex items-center gap-1.5 ${
                      bannerColorTheme === 'amber'
                        ? 'bg-slate-950 text-amber-300 hover:bg-slate-900'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    <span>Kunjungi Promo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Preview 2: Sidebar Medium Rectangle */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pratinjau: Sidebar Medium Rectangle (300x250)
                </span>
                <div className="max-w-xs p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="uppercase font-mono">Advertorial</span>
                    <span>{brandName || 'Brand Anda'}</span>
                  </div>
                  <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white p-3 text-center">
                    <div>
                      <Megaphone className="w-6 h-6 mx-auto text-amber-300 mb-1" />
                      <div className="text-xs font-bold">{brandName || 'Logo / Visual Produk'}</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {headline || 'Headline Iklan Kotak Sidebar Arun News'}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {description || 'Deskripsi singkat produk yang langsung dibaca oleh pengunjung saat membaca portal berita.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-full py-1.5 bg-[#004a99] text-amber-300 font-bold text-xs rounded-lg hover:bg-[#003d80] transition-colors"
                  >
                    Pelajari Selengkapnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Quick Contact Strip */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hotline Iklan: 021-7918-7700</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>iklan@arunnews.id</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Arun Media Network · Panduan & Standar Periklanan Terdaftar Dewan Pers
          </div>
        </div>
      </div>
    </div>
  );
};
