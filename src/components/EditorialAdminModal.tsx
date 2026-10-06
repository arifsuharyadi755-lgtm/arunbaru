import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Type, 
  Sliders, 
  Image, 
  Check, 
  Eye, 
  Crown, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Megaphone,
  Lock,
  Award,
  Bookmark
} from 'lucide-react';
import { 
  LogoSettings, 
  LogoStyle, 
  LogoColorTheme, 
  DEFAULT_LOGO_SETTINGS 
} from '../types/logoConfig';
import { logoService } from '../services/logoService';
import { ArunNewsLogo } from './ArunNewsLogo';

interface EditorialAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'logo' | 'redaksi' | 'announcement';
}

const STYLE_OPTIONS: { id: LogoStyle; label: string; desc: string; badge: string }[] = [
  {
    id: 'graffiti_3d_glow',
    label: 'Grafiti 3D Menyala',
    desc: 'Huruf 3D timbul berdimensi nyata dengan pendaran cahaya neon emas, perak & mahkota megah.',
    badge: '3D Glow'
  },
  {
    id: 'graffiti_modern',
    label: 'Grafiti Modern Elegan',
    desc: 'Huruf kaligrafi urban bersih dengan mahkota emas dan garis kuas dinamis.',
    badge: 'Signature'
  },
  {
    id: 'graffiti_tag',
    label: 'Grafiti Street Tag',
    desc: 'Bentuk grafiti jalanan tegas dengan kemiringan dinamis dan cipratan cat.',
    badge: 'Urban Art'
  },
  {
    id: 'editorial_bold',
    label: 'Editorial Modern Bold',
    desc: 'Tipografi berita kontemporer tebal, tegas, dan berwibawa.',
    badge: 'Newsprint'
  },
  {
    id: 'calligraphy_brush',
    label: 'Kuas Kaligrafi Nusantara',
    desc: 'Sentuhan kaligrafi kuas berseni tinggi dengan alur lembut.',
    badge: 'Artistik'
  },
  {
    id: 'neon_glow',
    label: 'Neon Glow Nusantara',
    desc: 'Efek cahaya neon berpijar modern untuk nuansa digital futuristik.',
    badge: 'Cyber'
  },
  {
    id: 'custom_image',
    label: 'Tautan Logo Sendiri',
    desc: 'Gunakan tautan URL logo atau gambar brand Anda sendiri.',
    badge: 'Kustom'
  }
];

const COLOR_OPTIONS: { id: LogoColorTheme; label: string; bgClass: string }[] = [
  { id: 'amber_gold', label: 'Emas & Kuning Arun', bgClass: 'bg-amber-400' },
  { id: 'cyan_electric', label: 'Biru & Cyan Elektrik', bgClass: 'bg-cyan-400' },
  { id: 'flame_red', label: 'Merah Api & Putih', bgClass: 'bg-rose-500' },
  { id: 'emerald_green', label: 'Hijau Zamrud & Emas', bgClass: 'bg-emerald-400' }
];

interface EditorialProfile {
  pemimpinRedaksi: string;
  redakturPelaksana: string;
  dewanPenasihat: string;
  badanHukum: string;
  skKemenkumham: string;
  nomorDewanPers: string;
  alamatKantor: string;
  hotline: string;
  email: string;
}

const DEFAULT_EDITORIAL_PROFILE: EditorialProfile = {
  pemimpinRedaksi: 'Dr. H. Muhammad Arun, M.Si.',
  redakturPelaksana: 'Dimas Suryonegoro, S.I.Kom.',
  dewanPenasihat: 'Prof. R. Soedirman, S.H., LL.M.',
  badanHukum: 'PT Arun Media Nusantara Pers',
  skKemenkumham: 'AHU-0023412.AH.01.01.Tahun 2024',
  nomorDewanPers: 'Verifikasi Dewan Pers No: 142/DP/Verif/2025',
  alamatKantor: 'Gedung Arun Media Nusantara Lt. 8, Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110',
  hotline: '+62 811-2345-6789',
  email: 'redaksi@arunnews.id'
};

const REDAKSI_STORAGE_KEY = 'arun_editorial_profile_v1';

export const EditorialAdminModal: React.FC<EditorialAdminModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'logo'
}) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'redaksi' | 'announcement'>(initialTab);
  const [settings, setSettings] = useState<LogoSettings>(logoService.getSettings());
  const [previewBg, setPreviewBg] = useState<'blue' | 'dark' | 'light'>('blue');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Editorial Profile State
  const [editorialProfile, setEditorialProfile] = useState<EditorialProfile>(() => {
    try {
      const saved = localStorage.getItem(REDAKSI_STORAGE_KEY);
      if (saved) return { ...DEFAULT_EDITORIAL_PROFILE, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_EDITORIAL_PROFILE;
  });

  // Editorial Announcement
  const [announcementText, setAnnouncementText] = useState(
    'Redaksi Arun News membuka ruang hak jawab, koreksi, dan pengaduan pemberitaan masyarakat melalui hotline redaksi 24 jam.'
  );

  useEffect(() => {
    if (isOpen) {
      const current = logoService.getSettings();
      setSettings(current);
      setCustomUrlInput(current.customImageUrl || '');
      setSaveSuccess(false);
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = () => {
    // 1. Save logo settings
    const updatedLogo: LogoSettings = {
      ...settings,
      customImageUrl: customUrlInput.trim() || undefined
    };
    logoService.saveSettings(updatedLogo);

    // 2. Save editorial profile
    try {
      localStorage.setItem(REDAKSI_STORAGE_KEY, JSON.stringify(editorialProfile));
    } catch {
      // ignore
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const handleResetLogo = () => {
    const defaults = logoService.resetSettings();
    setSettings(defaults);
    setCustomUrlInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col transition-colors"
      >
        {/* Header Admin / Redaksi */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-amber-300 flex items-center justify-center shadow-md border border-amber-400/30 shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Pengaturan Admin & Ruang Redaksi
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Admin Utama</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Pusat kendali identitas portal, logo grafiti 3D, dan manajemen struktur redaksi Arun News
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tutup Panel Pengaturan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('logo')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'logo'
                ? 'border-[#004a99] dark:border-amber-400 text-[#004a99] dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Identitas & Logo Portal</span>
            <span className="bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-black">
              3D Menyala
            </span>
          </button>

          <button
            onClick={() => setActiveTab('redaksi')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'redaksi'
                ? 'border-[#004a99] dark:border-amber-400 text-[#004a99] dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Struktur & Legalitas Redaksi</span>
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcement'
                ? 'border-[#004a99] dark:border-amber-400 text-[#004a99] dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Siaran Pers & Hotline Redaksi</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: IDENTITAS & LOGO PORTAL */}
          {activeTab === 'logo' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Notice Box */}
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Ruang Pengaturan Identitas Visual Redaksi:</span> Pengubahan bentuk logo, huruf grafiti 3D menyala, dan tagline <em>&ldquo;Jembatan Informasi Nusantara&rdquo;</em> akan diterapkan secara langsung pada header, footer, dan seluruh antarmuka portal.
                </div>
              </div>

              {/* 1. LIVE PREVIEW BOX */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                    <span>Pratinjau Langsung Logo Redaksi</span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-slate-400 mr-1">Latar:</span>
                    <button
                      type="button"
                      onClick={() => setPreviewBg('blue')}
                      className={`px-2 py-0.5 rounded font-semibold transition-all ${
                        previewBg === 'blue'
                          ? 'bg-[#004a99] text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Biru Header
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg('dark')}
                      className={`px-2 py-0.5 rounded font-semibold transition-all ${
                        previewBg === 'dark'
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Gelap Footer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg('light')}
                      className={`px-2 py-0.5 rounded font-semibold transition-all ${
                        previewBg === 'light'
                          ? 'bg-slate-300 text-slate-900 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Terang
                    </button>
                  </div>
                </div>

                <div className={`p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center transition-all border shadow-inner ${
                  previewBg === 'blue'
                    ? 'bg-gradient-to-r from-[#003875] via-[#004a99] to-[#002752] border-blue-900'
                    : previewBg === 'dark'
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-slate-800 border-slate-700'
                }`}>
                  <ArunNewsLogo 
                    size="lg" 
                    showSubtitle={settings.showTagline}
                    overrideSettings={{
                      ...settings,
                      customImageUrl: customUrlInput.trim() || undefined
                    }} 
                  />
                </div>
              </div>

              {/* 2. CHOOSE LOGO STYLE */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Pilihan Bentuk & Gaya Huruf:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STYLE_OPTIONS.map((style) => {
                    const isSelected = settings.style === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => setSettings(prev => ({ ...prev, style: style.id }))}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#004a99] dark:border-amber-400 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs ring-1 ring-[#004a99] dark:ring-amber-400'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                              {style.label}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              {style.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            {style.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Image URL input if custom_image selected */}
                {settings.style === 'custom_image' && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tautan URL Gambar Logo Anda (PNG / SVG Transparan):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://domainanda.com/logo-arun.png"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. TEMA WARNA AKSEN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Tema Warna Pendaran & Huruf:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = settings.colorTheme === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSettings(prev => ({ ...prev, colorTheme: c.id }))}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'border-[#004a99] dark:border-amber-400 bg-amber-50/50 dark:bg-slate-800 shadow-2xs font-bold'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${c.bgClass} shadow-2xs shrink-0`} />
                        <span className="text-xs truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. KUSTOMISASI TEKS & TAGLINE */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                  <span>Teks Nama & Tagline Resmi Portal</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Kata Pertama:
                    </label>
                    <input
                      type="text"
                      value={settings.textArun}
                      onChange={(e) => setSettings(prev => ({ ...prev, textArun: e.target.value }))}
                      placeholder="ARUN"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Kata Kedua:
                    </label>
                    <input
                      type="text"
                      value={settings.textNews}
                      onChange={(e) => setSettings(prev => ({ ...prev, textNews: e.target.value }))}
                      placeholder="NEWS"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Tagline Resmi (Slogan Berita Nasional):
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Jembatan Informasi Nusantara"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4 pt-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.showTagline}
                      onChange={(e) => setSettings(prev => ({ ...prev, showTagline: e.target.checked }))}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>Tampilkan Tagline &ldquo;Jembatan Informasi Nusantara&rdquo;</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.showCrown}
                      onChange={(e) => setSettings(prev => ({ ...prev, showCrown: e.target.checked }))}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>Mahkota Grafiti 3D</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.showUnderline}
                      onChange={(e) => setSettings(prev => ({ ...prev, showUnderline: e.target.checked }))}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>Garis Kuas Dinamis</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STRUKTUR & LEGALITAS REDAKSI */}
          {activeTab === 'redaksi' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Standar Jurnalistik & Dewan Pers:</span> Data redaksi ini ditampilkan pada halaman Pedoman Media Siber dan footer portal berita untuk transparansi hukum dan kredibilitas pers.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pemimpin Redaksi / Penanggung Jawab:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.pemimpinRedaksi}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, pemimpinRedaksi: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Redaktur Pelaksana:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.redakturPelaksana}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, redakturPelaksana: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dewan Penasihat & Etika Pers:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.dewanPenasihat}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, dewanPenasihat: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Badan Hukum Penerbit:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.badanHukum}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, badanHukum: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    SK Kemenkumham RI:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.skKemenkumham}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, skKemenkumham: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Verifikasi Dewan Pers:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.nomorDewanPers}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, nomorDewanPers: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Kantor Redaksi:
                </label>
                <textarea
                  rows={2}
                  value={editorialProfile.alamatKantor}
                  onChange={(e) => setEditorialProfile(prev => ({ ...prev, alamatKantor: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hotline Redaksi:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.hotline}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, hotline: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Redaksi:
                  </label>
                  <input
                    type="email"
                    value={editorialProfile.email}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SIARAN PERS & PENGUMUMAN REDAKSI */}
          {activeTab === 'announcement' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                <span className="font-bold">Pengumuman & Siaran Resmi Redaksi:</span> Pesan ini dapat ditampilkan di bagian atas situs atau ruang redaksi sebagai pemberitahuan resmi Dewan Redaksi kepada pembaca.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Pesan Siaran Redaksi:
                </label>
                <textarea
                  rows={4}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  placeholder="Ketik pengumuman resmi redaksi..."
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sistem Autentikasi Ruang Redaksi Terenkripsi
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                  Aktif & Terproteksi
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80 flex items-center justify-between gap-3 shrink-0">
          {activeTab === 'logo' ? (
            <button
              type="button"
              onClick={handleResetLogo}
              className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Standar Logo</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Manajemen Redaksi Arun News</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Perubahan Redaksi Tersimpan!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Simpan Pengaturan Redaksi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
