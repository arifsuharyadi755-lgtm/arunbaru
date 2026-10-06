import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  SlidersHorizontal, 
  Sparkles, 
  Clock, 
  Check, 
  AlertCircle,
  XCircle,
  Inbox
} from 'lucide-react';

interface SubscriptionData {
  email: string;
  frequency: 'morning' | 'evening' | 'both';
  topics: string[];
  subscribedAt: string;
}

const STORAGE_KEY = 'arun_newsletter_subscription_v1';

const AVAILABLE_TOPICS = [
  { id: 'politik', label: 'Politik' },
  { id: 'ekonomi', label: 'Ekonomi' },
  { id: 'olahraga', label: 'Olahraga' },
  { id: 'kriminal', label: 'Kriminal' },
  { id: 'lapor_warga', label: 'Lapor Warga' }
];

export const NewsletterWidget: React.FC = () => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'morning' | 'evening' | 'both'>('morning');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['politik', 'ekonomi', 'olahraga']);
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [justSubscribed, setJustSubscribed] = useState(false);

  // Load existing subscription from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSubscription(JSON.parse(saved));
      }
    } catch {
      // ignore storage error
    }
  }, []);

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId)
        ? prev.length > 1 ? prev.filter(t => t !== topicId) : prev // keep at least 1
        : [...prev, topicId]
    );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMessage('Harap masukkan alamat email Anda.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Format alamat email tidak valid.');
      return;
    }

    setLoading(true);

    // Simulate API submission
    setTimeout(() => {
      const newSub: SubscriptionData = {
        email: email.trim(),
        frequency,
        topics: selectedTopics,
        subscribedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSub));
      } catch {
        // ignore
      }

      setSubscription(newSub);
      setLoading(false);
      setJustSubscribed(true);
      setTimeout(() => setJustSubscribed(false), 5000);
    }, 600);
  };

  const handleUnsubscribe = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSubscription(null);
    setEmail('');
    setShowPreferences(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors overflow-hidden relative">
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003875] via-amber-400 to-[#004a99]" />

      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 mt-0.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#004a99] flex items-center justify-center text-amber-300 shadow-2xs">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Newsletter Arun News
            </h3>
          </div>
        </div>
        <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-300/60 dark:border-amber-700/60 uppercase tracking-wider">
          Gratis
        </span>
      </div>

      {subscription ? (
        /* SUBSCRIBED STATE CARD */
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-100">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  {justSubscribed ? 'Pendaftaran Berhasil!' : 'Langganan Aktif'}
                </h4>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/80 mt-0.5 truncate max-w-[210px] sm:max-w-xs font-medium">
                  {subscription.email}
                </p>
              </div>
            </div>
            
            <div className="mt-2.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60 text-[11px] space-y-1 text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Jadwal: {subscription.frequency === 'morning' ? 'Pagi (06:30 WIB)' : subscription.frequency === 'evening' ? 'Sore (17:30 WIB)' : 'Pagi & Sore'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Inbox className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Kanal: {subscription.topics.map(t => AVAILABLE_TOPICS.find(at => at.id === t)?.label || t).join(', ')}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Ringkasan kurasi 5 berita penting dari redaktur Arun News dikirim langsung ke kotak masuk Anda.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setEmail(subscription.email);
                setFrequency(subscription.frequency);
                setSelectedTopics(subscription.topics);
                setShowPreferences(true);
              }}
              className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Ubah Preferensi</span>
            </button>
            <button
              onClick={handleUnsubscribe}
              className="py-1.5 px-2.5 rounded-lg text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              Berhenti
            </button>
          </div>
        </div>
      ) : (
        /* SUBSCRIPTION FORM */
        <form onSubmit={handleSubscribe} className="space-y-3">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Kurasi Berita Harian Pilihan Redaksi</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Dapatkan rangkuman 5 isu nasional terhangat, pergerakan bursa, dan berita utama langsung di email Anda setiap hari.
            </p>
          </div>

          {/* Email Input */}
          <div>
            <div className="relative">
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={loading}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            {errorMessage && (
              <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 mt-1.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Frequency & Topic Preferences Collapsible */}
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Waktu Pengiriman:</span>
              <button
                type="button"
                onClick={() => setShowPreferences(!showPreferences)}
                className="text-blue-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{showPreferences ? 'Tutup Pilihan' : 'Kanal Pilihan'}</span>
                <SlidersHorizontal className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Frequency Pills */}
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setFrequency('morning')}
                className={`py-1.5 px-2 rounded-md font-semibold text-center transition-all ${
                  frequency === 'morning'
                    ? 'bg-[#004a99] text-amber-300 font-bold border border-amber-400/40 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                🌅 Pagi (06:30)
              </button>
              <button
                type="button"
                onClick={() => setFrequency('evening')}
                className={`py-1.5 px-2 rounded-md font-semibold text-center transition-all ${
                  frequency === 'evening'
                    ? 'bg-[#004a99] text-amber-300 font-bold border border-amber-400/40 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                🌇 Sore (17:30)
              </button>
              <button
                type="button"
                onClick={() => setFrequency('both')}
                className={`py-1.5 px-2 rounded-md font-semibold text-center transition-all ${
                  frequency === 'both'
                    ? 'bg-[#004a99] text-amber-300 font-bold border border-amber-400/40 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                ⚡ 2x Sehari
              </button>
            </div>

            {/* Custom Topics Checkbox Pills */}
            {showPreferences && (
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 mt-2 animate-in fade-in duration-150">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Topik yang Diminati:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.id);
                    return (
                      <button
                        type="button"
                        key={topic.id}
                        onClick={() => handleToggleTopic(topic.id)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                            : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        <span>{topic.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-3 bg-[#004a99] hover:bg-[#003d80] text-amber-300 hover:text-amber-200 text-xs font-bold rounded-lg border border-amber-400/40 shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                <span>Mendaftarkan Email...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Langganan Sekarang</span>
              </>
            )}
          </button>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 pt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Bebas spam. Berhenti berlangganan kapan saja dalam 1 klik.</span>
          </div>
        </form>
      )}
    </div>
  );
};
