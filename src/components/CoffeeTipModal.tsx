import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coffee, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Send, 
  MessageSquare, 
  Clock, 
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { auth } from '../services/firebase';

interface CoffeeTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTipSuccess?: (donorName: string, amount: number, message: string) => void;
}

export interface CoffeeDonation {
  id: string;
  name: string;
  cups: number;
  amount: number;
  message: string;
  time: string;
  paymentMethod: string;
}

const STORAGE_KEY = 'arun_saweran_kopi_v1';

const COFFEE_PACKAGES = [
  { cups: 1, name: '1 Cangkir Kopi Tubruk', amount: 10000, desc: 'Penyemangat jurnalis di lapangan' },
  { cups: 2, name: '2 Cangkir Kopi Susu Aren', amount: 25000, desc: 'Dukungan riset data & verifikasi' },
  { cups: 5, name: '5 Cangkir Espresso Dobel', amount: 50000, desc: 'Bahan bakar liputan investigasi mendalam' },
  { cups: 10, name: '10 Cangkir Kopi Luwak Redaksi', amount: 10000, desc: 'Dukungan penuh tim redaksi & server' }
];

const INITIAL_DONATIONS: CoffeeDonation[] = [
  {
    id: 'tip-1',
    name: 'Budi Santoso',
    cups: 2,
    amount: 25000,
    message: 'Semangat liputannya Arun News! Selalu kritis dan independen membela rakyat kecil.',
    time: '15 menit lalu',
    paymentMethod: 'QRIS'
  },
  {
    id: 'tip-2',
    name: 'Siti Rahmawati',
    cups: 5,
    amount: 50000,
    message: 'Terima kasih atas kanal Lapor Warga dan liputan transparansi hukumnya.',
    time: '1 jam lalu',
    paymentMethod: 'GoPay'
  },
  {
    id: 'tip-3',
    name: 'Hamba Allah',
    cups: 1,
    amount: 10000,
    message: 'Kopi hangat untuk teman-teman wartawan yang bekerja lembur malam ini.',
    time: '3 jam lalu',
    paymentMethod: 'DANA'
  }
];

export const CoffeeTipModal: React.FC<CoffeeTipModalProps> = ({
  isOpen,
  onClose,
  onTipSuccess
}) => {
  const [selectedCups, setSelectedCups] = useState<number>(2);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'gopay' | 'dana' | 'bca'>('qris');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [recentDonations, setRecentDonations] = useState<CoffeeDonation[]>([]);
  const [activeTab, setActiveTab] = useState<'sawer' | 'history'>('sawer');

  // Load history from localStorage and Firestore
  useEffect(() => {
    // Prefill donor name if logged in
    if (auth.currentUser?.displayName && !donorName) {
      setDonorName(auth.currentUser.displayName);
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentDonations(JSON.parse(stored));
      } else {
        setRecentDonations(INITIAL_DONATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DONATIONS));
      }
    } catch {
      setRecentDonations(INITIAL_DONATIONS);
    }

    // Subscribe to Firestore donations
    const unsubscribe = firestoreService.subscribeDonations((remoteDonations) => {
      if (remoteDonations && remoteDonations.length > 0) {
        setRecentDonations(remoteDonations);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Selected amount calculation
  const currentPackage = COFFEE_PACKAGES.find(p => p.cups === selectedCups) || COFFEE_PACKAGES[1];
  const finalAmount = isCustom 
    ? Math.max(5000, parseInt(customAmount.replace(/\D/g, '') || '10000', 10))
    : currentPackage.amount;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleProcessSawer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const finalName = isAnonymous ? 'Pencinta Kopi (Anonim)' : (donorName.trim() || 'Sahabat Arun News');
      const finalMsg = message.trim() || 'Semangat untuk seluruh jurnalis & redaktur Arun News!';
      
      const newDonation: CoffeeDonation = {
        id: `tip-${Date.now()}`,
        name: finalName,
        cups: isCustom ? Math.max(1, Math.round(finalAmount / 10000)) : selectedCups,
        amount: finalAmount,
        message: finalMsg,
        time: 'Baru saja',
        paymentMethod: paymentMethod.toUpperCase()
      };

      const updatedList = [newDonation, ...recentDonations];
      setRecentDonations(updatedList);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch {
        // ignore
      }

      // Save to Firestore
      firestoreService.addDonation(newDonation).catch(err => console.warn('Firestore add donation:', err));

      setIsProcessing(false);
      setIsSuccess(true);

      if (onTipSuccess) {
        onTipSuccess(finalName, finalAmount, finalMsg);
      }
    }, 850);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setMessage('');
    setDonorName('');
    setIsCustom(false);
    setSelectedCups(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col transition-colors relative"
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-md border border-amber-300 shrink-0">
              <Coffee className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Saweran Kopi Redaksi
                </h3>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-2xs uppercase">
                  Dukung Kami
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Traktir secangkir kopi untuk jurnalis & redaksi Arun News
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
        {!isSuccess && (
          <div className="px-5 pt-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex gap-2">
            <button
              onClick={() => setActiveTab('sawer')}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'sawer'
                  ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Traktir Kopi</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'history'
                  ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Penyawer Kopi ({recentDonations.length})</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {isSuccess ? (
            /* SUCCESS CONFIRMATION */
            <div className="py-6 px-4 text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-inner">
                  <Coffee className="w-10 h-10 fill-amber-500 animate-bounce" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Saweran Kopi Berhasil Terkirim!
                </span>
                <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
                  Terima Kasih Banyak, Sahabat Redaksi!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed max-w-sm mx-auto">
                  Dukungan <strong>{formatRupiah(finalAmount)}</strong> dari Anda sangat berarti untuk membiayai operasional riset, pulsa wartawan lapangan, dan teknologi server Arun News.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 italic font-serif">
                &ldquo;{message.trim() || 'Tetap semangat memberikan informasi terpercaya bagi Indonesia!'}&rdquo;
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-[#004a99] hover:bg-[#003875] text-amber-300 text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Selesai & Tutup
                </button>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Sawer Lagi
                </button>
              </div>
            </div>
          ) : activeTab === 'history' ? (
            /* DONATIONS LEADERBOARD / HISTORY */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold uppercase tracking-wider text-[11px]">Riwayat Dukungan Pembaca</span>
                <span>Total: {recentDonations.length} Kebaikan</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {recentDonations.map((tip) => (
                  <div 
                    key={tip.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                        <Coffee className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{tip.name}</span>
                        <span className="text-[10px] font-normal text-slate-400">({tip.cups} cangkir)</span>
                      </div>
                      <span className="font-extrabold text-[#004a99] dark:text-amber-400">
                        {formatRupiah(tip.amount)}
                      </span>
                    </div>
                    {tip.message && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic font-serif">
                        &ldquo;{tip.message}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Via {tip.paymentMethod}</span>
                      <span>{tip.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('sawer')}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Coffee className="w-4 h-4 fill-slate-950" />
                <span>Ikut Traktir Kopi Sekarang</span>
              </button>
            </div>
          ) : (
            /* DONATION FORM */
            <form onSubmit={handleProcessSawer} className="space-y-4">
              {/* Coffee Package Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Jumlah Saweran Kopi:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COFFEE_PACKAGES.map((pkg) => {
                    const isSelected = !isCustom && selectedCups === pkg.cups;
                    return (
                      <button
                        type="button"
                        key={pkg.cups}
                        onClick={() => {
                          setIsCustom(false);
                          setSelectedCups(pkg.cups);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{pkg.name}</span>
                          <span className="text-xs">{'☕'.repeat(Math.min(pkg.cups, 4))}</span>
                        </div>
                        <div className="text-sm font-extrabold text-[#004a99] dark:text-amber-300">
                          {formatRupiah(pkg.amount)}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {pkg.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Button */}
                <div className="mt-2">
                  {isCustom ? (
                    <div className="p-2.5 rounded-xl border border-amber-500 bg-amber-50/50 dark:bg-slate-800 flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Rp</span>
                      <input
                        type="number"
                        min="5000"
                        step="5000"
                        placeholder="Contoh: 150000"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full text-xs font-bold bg-transparent outline-none text-slate-900 dark:text-slate-100"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustom(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustom(true);
                        setCustomAmount('100000');
                      }}
                      className="w-full py-1.5 text-xs text-blue-600 dark:text-amber-400 hover:underline font-semibold text-center"
                    >
                      + Atau Masukkan Nominal Saweran Bebas
                    </button>
                  )}
                </div>
              </div>

              {/* Name & Anonymous Check */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nama Penyumbang:
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer text-slate-500">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>Kirim sebagai Anonim</span>
                  </label>
                </div>
                {!isAnonymous && (
                  <input
                    type="text"
                    placeholder="Nama Anda atau Inisial"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                )}
              </div>

              {/* Message to Newsroom */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pesan / Ucapan Penyemangat untuk Redaksi:
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="Tulis pesan penyemangat Anda untuk wartawan kami..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Metode Pembayaran:
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  {[
                    { id: 'qris', label: 'QRIS' },
                    { id: 'gopay', label: 'GoPay' },
                    { id: 'dana', label: 'DANA' },
                    { id: 'bca', label: 'BCA VA' }
                  ].map(method => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all ${
                        paymentMethod === method.id
                          ? 'bg-[#004a99] text-amber-300 border border-amber-400/40 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* QRIS / Summary Preview Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border flex items-center justify-center text-slate-900 dark:text-slate-100">
                    <QrCode className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Total Saweran:</div>
                    <div className="text-sm font-extrabold text-[#004a99] dark:text-amber-300">
                      {formatRupiah(finalAmount)}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Aman & Terenkripsi</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Menghubungkan Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-4 h-4 fill-slate-950" />
                    <span>Kirim Saweran Kopi ({formatRupiah(finalAmount)})</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
