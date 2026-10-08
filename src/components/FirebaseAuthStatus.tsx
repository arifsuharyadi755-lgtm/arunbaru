import React, { useState, useEffect } from 'react';
import { 
  User, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  CloudCheck, 
  Loader2,
  Sparkles 
} from 'lucide-react';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  isUserAdmin,
  ADMIN_EMAIL 
} from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface FirebaseAuthStatusProps {
  onOpenAdmin?: () => void;
}

export const FirebaseAuthStatus: React.FC<FirebaseAuthStatusProps> = ({ onOpenAdmin }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Gagal masuk dengan Google');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (err: any) {
      console.error(err);
    }
  };

  const isAdmin = isUserAdmin(user);

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden sm:inline">Firebase...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            title="Akses Ruang Redaksi (Admin Terverifikasi)"
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-amber-900 bg-amber-400 hover:bg-amber-300 rounded shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Redaksi</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2 py-1 rounded-md text-xs text-white border border-white/20 transition-colors">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-5 h-5 rounded-full object-cover border border-amber-400"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
              {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
          )}

          <div className="hidden lg:flex flex-col text-left leading-none max-w-[120px]">
            <span className="truncate font-semibold text-[11px] text-white">
              {user.displayName || user.email?.split('@')[0]}
            </span>
            {isAdmin ? (
              <span className="text-[9px] text-amber-300 font-mono">Redaktur Utama</span>
            ) : (
              <span className="text-[9px] text-blue-200">Pembaca</span>
            )}
          </div>

          <button
            onClick={handleSignOut}
            title="Keluar dari Akun"
            className="p-1 hover:text-red-300 transition-colors text-blue-200 ml-0.5"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleSignIn}
        title="Masuk dengan Google (Firebase Auth)"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 transition-all shadow-xs"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
          />
        </svg>
        <span className="hidden sm:inline">Masuk</span>
      </button>

      {authError && (
        <span className="hidden xl:inline text-[10px] text-red-200 truncate max-w-[150px]">
          {authError}
        </span>
      )}
    </div>
  );
};
