import React, { useState, useEffect } from 'react';
import { 
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
  ArrowLeft,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Newspaper,
  Coffee,
  DollarSign,
  Send,
  Globe,
  Radio,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { 
  LogoSettings, 
  LogoStyle, 
  LogoColorTheme, 
  DEFAULT_LOGO_SETTINGS 
} from '../types/logoConfig';
import { logoService } from '../services/logoService';
import { ArunNewsLogo } from './ArunNewsLogo';
import { INITIAL_ARTICLES } from '../data/newsData';
import { OPINION_ARTICLES } from '../data/opinionData';
import { AdSubmission } from '../types/advertising';
import { CoffeeDonation } from './CoffeeTipModal';
import { firestoreService } from '../services/firestoreService';
import { auth, isUserAdmin, ADMIN_EMAIL } from '../services/firebase';

interface EditorialAdminPageProps {
  onBackToPublic: () => void;
  initialTab?: AdminMenuTab;
}

export type AdminMenuTab = 
  | 'overview'
  | 'logo'
  | 'redaksi'
  | 'articles'
  | 'opinions'
  | 'ads'
  | 'coffee'
  | 'announcement';

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

export const EditorialAdminPage: React.FC<EditorialAdminPageProps> = ({
  onBackToPublic,
  initialTab = 'logo'
}) => {
  const [activeTab, setActiveTab] = useState<AdminMenuTab>(initialTab);
  const [settings, setSettings] = useState<LogoSettings>(logoService.getSettings());
  const [previewBg, setPreviewBg] = useState<'blue' | 'dark' | 'light'>('blue');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Editorial Profile
  const [editorialProfile, setEditorialProfile] = useState<EditorialProfile>(() => {
    try {
      const saved = localStorage.getItem(REDAKSI_STORAGE_KEY);
      if (saved) return { ...DEFAULT_EDITORIAL_PROFILE, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_EDITORIAL_PROFILE;
  });

  // Announcement Text
  const [announcementText, setAnnouncementText] = useState(
    'Redaksi Arun News membuka ruang hak jawab, koreksi, dan verifikasi berita bagi seluruh masyarakat Indonesia melalui hotline redaksi 24 jam.'
  );

  // Stored Ads
  const [adsList, setAdsList] = useState<AdSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('arun_ads_submissions_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Stored Donations
  const [donationsList, setDonationsList] = useState<CoffeeDonation[]>(() => {
    try {
      const saved = localStorage.getItem('arun_saweran_kopi_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) + ' · ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update browser document title for separate web portal experience
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Ruang Redaksi & Backoffice | Arun News';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  // Sync ads, donations, and editorial profile from Firestore
  useEffect(() => {
    const unsubAds = firestoreService.subscribeAds((remoteAds) => {
      if (remoteAds && remoteAds.length > 0) {
        setAdsList(remoteAds);
      }
    });

    const unsubDonations = firestoreService.subscribeDonations((remoteDonations) => {
      if (remoteDonations && remoteDonations.length > 0) {
        setDonationsList(remoteDonations);
      }
    });

    const unsubEditorial = firestoreService.subscribeEditorialProfile((remoteProfile) => {
      if (remoteProfile) {
        setEditorialProfile(prev => ({ ...prev, ...remoteProfile }));
      }
    });

    return () => {
      unsubAds();
      unsubDonations();
      unsubEditorial();
    };
  }, []);

  const handleSave = () => {
    // 1. Save logo settings (syncs to localStorage + Firestore)
    const updatedLogo: LogoSettings = {
      ...settings,
      customImageUrl: customUrlInput.trim() || undefined
    };
    logoService.saveSettings(updatedLogo);

    // 2. Save editorial profile (localStorage + Firestore)
    try {
      localStorage.setItem(REDAKSI_STORAGE_KEY, JSON.stringify(editorialProfile));
    } catch {
      // ignore
    }
    firestoreService.saveEditorialProfile(editorialProfile).catch(err => console.warn('Firestore editorial save:', err));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleUpdateAdStatus = (adId: string, status: 'review' | 'approved' | 'active') => {
    setAdsList(prev => prev.map(a => a.id === adId ? { ...a, status } : a));
    firestoreService.updateAdStatus(adId, status).catch(err => console.warn('Firestore ad status:', err));
  };

  const handleResetLogo = () => {
    const defaults = logoService.resetSettings();
    setSettings(defaults);
    setCustomUrlInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* SEPARATE WEB PLATFORM ADDRESS BAR */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 py-1.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-md text-[11px] text-emerald-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-500">https://</span>
            <span className="font-bold text-slate-200">admin.arunnews.id</span>
            <span className="text-amber-400 font-semibold">/redaksi-backoffice</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-slate-500 font-sans">
            &bull; Web Redaksi Terpisah &bull; Hak Akses: Administrator Penuh
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-sans">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors font-medium"
            title="Buka Website Publik Arun News di Jendela / Tab Baru"
          >
            <span>Buka Website Publik (Tab Baru)</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
          <span className="text-slate-700">|</span>
          <button
            onClick={onBackToPublic}
            className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
          >
            Tutup & Kembali
          </button>
        </div>
      </div>

      {/* 1. TOP NAVBAR: REDAKSI SYSTEM BAR */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Admin Brand Lockup */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-amber-300 flex items-center justify-center shadow-lg border border-amber-400/40 shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  ARUN NEWS
                </span>
                <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                  RUANG REDAKSI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                CMS Backoffice &bull; Jembatan Informasi Nusantara &bull; {currentTime}
              </p>
            </div>
          </div>

          {/* Right: User Status & Back to Public Portal Link */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firestore: stable-welder-nxctm</span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Administrator:</span>
              <span className="font-bold text-white truncate max-w-[180px]">
                {auth.currentUser?.email === ADMIN_EMAIL ? auth.currentUser.email : editorialProfile.pemimpinRedaksi}
              </span>
            </div>

            {/* Link back to public web portal */}
            <button
              onClick={onBackToPublic}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs rounded-xl shadow-md border border-blue-400/40 transition-all hover:scale-[1.02] cursor-pointer"
              title="Buka Website Publik Arun News"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Portal Publik</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. ADMIN MAIN CONTAINER WITH SIDEBAR & CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg">
            <div className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Menu Utama Redaksi
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('logo')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'logo'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 shrink-0" />
                  <span>Identitas & Logo 3D</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  activeTab === 'logo' ? 'bg-slate-950 text-amber-300' : 'bg-amber-400/20 text-amber-300'
                }`}>
                  3D Glow
                </span>
              </button>

              <button
                onClick={() => setActiveTab('redaksi')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'redaksi'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Struktur Redaksi & Legalitas</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('articles')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'articles'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Newspaper className="w-4 h-4 shrink-0" />
                  <span>Manajemen Berita</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-bold">
                  {INITIAL_ARTICLES.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('opinions')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'opinions'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Kolom Opini & Esai Warga</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-bold">
                  {OPINION_ARTICLES.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'ads'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <span>Pengiklan & Advertorial</span>
                </div>
                {adsList.length > 0 && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                    {adsList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('coffee')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'coffee'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 shrink-0" />
                  <span>Rekap Saweran Kopi</span>
                </div>
                {donationsList.length > 0 && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                    {donationsList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('announcement')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'announcement'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 shrink-0" />
                  <span>Siaran Pers Redaksi</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Quick System Badge */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-white">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Legalitas Pers Terdaftar</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {editorialProfile.skKemenkumham} &bull; Dewan Pers No: 142/DP/Verif/2025
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status Server:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Aktif
              </span>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="flex-1 space-y-6 min-w-0">
          {/* TAB 1: IDENTITAS & LOGO 3D (FITUR UTAMA UBAH LOGO REDAKSI) */}
          {activeTab === 'logo' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-amber-400" />
                    <span>Identitas Brand & Logo 3D Menyala</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ubah gaya huruf grafiti 3D, efek pendaran neon, teks ARUN NEWS, dan tagline resmi portal
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Standar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tersimpan di Portal!</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Simpan ke Portal Publik</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pengaturan Logo 3D Menyala & Tagline berhasil disimpan! Perubahan seketika aktif pada website utama Arun News.</span>
                </div>
              )}

              {/* 1. LIVE PREVIEW BOX */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Pratinjau Langsung Tampilan Logo di Portal:</span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-slate-500 mr-1">Latar Tampilan:</span>
                    <button
                      type="button"
                      onClick={() => setPreviewBg('blue')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        previewBg === 'blue'
                          ? 'bg-[#004a99] text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Biru Header
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg('dark')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        previewBg === 'dark'
                          ? 'bg-slate-950 text-white shadow-xs border border-slate-700'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Gelap Footer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg('light')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        previewBg === 'light'
                          ? 'bg-slate-300 text-slate-900 shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Terang
                    </button>
                  </div>
                </div>

                <div className={`p-8 sm:p-10 rounded-2xl flex flex-col items-center justify-center text-center transition-all border shadow-inner ${
                  previewBg === 'blue'
                    ? 'bg-gradient-to-r from-[#003875] via-[#004a99] to-[#002752] border-blue-900'
                    : previewBg === 'dark'
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-slate-800 border-slate-700'
                }`}>
                  <ArunNewsLogo 
                    size="xl" 
                    showSubtitle={settings.showTagline}
                    overrideSettings={{
                      ...settings,
                      customImageUrl: customUrlInput.trim() || undefined
                    }} 
                  />
                </div>
              </div>

              {/* 2. CHOOSE LOGO STYLE */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Pilihan Bentuk & Gaya Tipografi Logo:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {STYLE_OPTIONS.map((style) => {
                    const isSelected = settings.style === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => setSettings(prev => ({ ...prev, style: style.id }))}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/10 shadow-md ring-1 ring-amber-400'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-850'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-extrabold text-white">
                              {style.label}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {style.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {style.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Image URL input if custom_image selected */}
                {settings.style === 'custom_image' && (
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 space-y-2 animate-in fade-in">
                    <label className="block text-xs font-bold text-slate-200">
                      Tautan URL Gambar Logo Anda (PNG / SVG Transparan):
                    </label>
                    <input
                      type="url"
                      placeholder="https://domainanda.com/logo-arun.png"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              {/* 3. TEMA WARNA AKSEN */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Tema Warna Pendaran Neon & Huruf:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = settings.colorTheme === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSettings(prev => ({ ...prev, colorTheme: c.id }))}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/10 shadow-xs font-bold text-white'
                            : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${c.bgClass} shadow-xs shrink-0`} />
                        <span className="text-xs truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. KUSTOMISASI TEKS & TAGLINE */}
              <div className="p-5 rounded-xl bg-slate-850 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-amber-400" />
                  <span>Kustomisasi Teks Nama & Tagline Resmi</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Kata Pertama (Huruf Grafiti 3D):
                    </label>
                    <input
                      type="text"
                      value={settings.textArun}
                      onChange={(e) => setSettings(prev => ({ ...prev, textArun: e.target.value }))}
                      placeholder="ARUN"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white font-bold focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Kata Kedua (Huruf Grafiti 3D):
                    </label>
                    <input
                      type="text"
                      value={settings.textNews}
                      onChange={(e) => setSettings(prev => ({ ...prev, textNews: e.target.value }))}
                      placeholder="NEWS"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white font-bold focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tagline Resmi (Slogan Berita Nasional):
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Jembatan Informasi Nusantara"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-5 pt-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.showTagline}
                      onChange={(e) => setSettings(prev => ({ ...prev, showTagline: e.target.checked }))}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>Tampilkan Tagline &ldquo;Jembatan Informasi Nusantara&rdquo;</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.showCrown}
                      onChange={(e) => setSettings(prev => ({ ...prev, showCrown: e.target.checked }))}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>Mahkota Grafiti 3D</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>Struktur Redaksi & Legalitas Media Siber</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Data kepengurusan redaksi dan sertifikasi Dewan Pers yang tampil di halaman Pedoman Media Siber
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Data Redaksi</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Pemimpin Redaksi / Penanggung Jawab:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.pemimpinRedaksi}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, pemimpinRedaksi: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Redaktur Pelaksana:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.redakturPelaksana}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, redakturPelaksana: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Dewan Penasihat & Ahli Hukum:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.dewanPenasihat}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, dewanPenasihat: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Badan Hukum Penerbit:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.badanHukum}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, badanHukum: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    SK Kemenkumham RI:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.skKemenkumham}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, skKemenkumham: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Status Verifikasi Dewan Pers:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.nomorDewanPers}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, nomorDewanPers: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alamat Gedung Kantor Redaksi:
                </label>
                <textarea
                  rows={2}
                  value={editorialProfile.alamatKantor}
                  onChange={(e) => setEditorialProfile(prev => ({ ...prev, alamatKantor: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Hotline Redaksi:
                  </label>
                  <input
                    type="text"
                    value={editorialProfile.hotline}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, hotline: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Redaksi:
                  </label>
                  <input
                    type="email"
                    value={editorialProfile.email}
                    onChange={(e) => setEditorialProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAJEMEN BERITA */}
          {activeTab === 'articles' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-blue-400" />
                    <span>Daftar Artikel & Berita Publikasi</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total {INITIAL_ARTICLES.length} berita aktif ditayangkan pada saluran kategori nasional
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {INITIAL_ARTICLES.slice(0, 8).map((art) => (
                  <div key={art.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30">
                          {art.categoryName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {art.publishedAt} &bull; Oleh {art.author}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">
                        {art.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 shrink-0">
                      Tayang
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MODERASI OPINI */}
          {activeTab === 'opinions' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Moderasi Kolom Opini & Esai Warga</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kiriman esai dan opini kritis pembaca yang diterbitkan di kolom opini resmi Arun News
                </p>
              </div>

              <div className="space-y-3">
                {OPINION_ARTICLES.map((op) => (
                  <div key={op.id} className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">{op.author}</span>
                      <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-bold">
                        Terverifikasi Redaksi
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{op.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{op.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: IKLAN & MITRA */}
          {activeTab === 'ads' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-blue-400" />
                  <span>Pengiklan & Advertorial Mitra</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manajemen permohonan pasang iklan billboard, leaderboard, dan berita advertorial
                </p>
              </div>

              {adsList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-850 rounded-xl border border-slate-800 space-y-2">
                  <Megaphone className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <p className="font-bold text-white">Belum ada pengajuan iklan baru di sesi lokal</p>
                  <p className="text-slate-500">Iklan yang didaftarkan melalui tombol Pasang Iklan akan muncul di panel ini.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adsList.map((ad) => (
                    <div key={ad.id} className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-amber-400">{ad.brandName}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                            {ad.packageType}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{ad.headline}</h4>
                        <p className="text-[11px] text-slate-500">Kontak: {ad.contactName} ({ad.phoneWhatsapp} &bull; {ad.email})</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 shrink-0">
                        Aktif Tayang
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SAWERAN KOPI */}
          {activeTab === 'coffee' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-400" />
                  <span>Rekap Saweran Kopi untuk Redaksi</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dukungan finansial sukarela dari pembaca setia untuk tim peliput investigasi dan operasional server
                </p>
              </div>

              {donationsList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-850 rounded-xl border border-slate-800">
                  <Coffee className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="font-bold text-white">Dukungan Saweran Kopi</p>
                  <p className="text-slate-500 mt-1">Pembaca dapat mengirimkan saweran kopi melalui tombol Saweran Kopi di footer situs.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donationsList.map((d) => (
                    <div key={d.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white">{d.name}</span>
                          <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-black">
                            ☕ {d.cups} Cangkir
                          </span>
                          <span className="text-[10px] text-slate-500">{d.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 italic">&ldquo;{d.message}&rdquo;</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-400">
                          Rp {d.amount.toLocaleString('id-ID')}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono">{d.paymentMethod}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SIARAN PERS */}
          {activeTab === 'announcement' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-blue-400" />
                  <span>Siaran Pers & Pengumuman Redaksi</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publikasikan pengumuman resmi Dewan Redaksi atau breaking advisory kepada seluruh pembaca
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Isi Pesan Siaran Redaksi:
                </label>
                <textarea
                  rows={4}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                  placeholder="Ketik isi siaran pers redaksi..."
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Sistem Integritas Jurnalistik Terverifikasi</h5>
                    <p className="text-[11px] text-slate-400">Setiap siaran terikat pada Kode Etik Jurnalistik (KEJ) Dewan Pers.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Publikasikan Siaran
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. ADMIN FOOTER BAR */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Arun News CMS Backoffice</span>
            <span>&bull;</span>
            <span>Portal Manajemen Redaksi & Identitas Media Nusantara</span>
          </div>
          <button
            onClick={onBackToPublic}
            className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1"
          >
            <span>Kembali ke Halaman Berita &rarr;</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
