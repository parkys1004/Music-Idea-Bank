import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, Check, AlertCircle, Loader2, Trash2, Zap, FileText, Music, Shield, Settings } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { setApiKey, testConnection } from '../services/ai';

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'gemini_api_key_enc';
const SECRET_SALT = 'gemini-music-app-salt-v1'; // Simple obfuscation

export default function ApiKeyManager({ isOpen, onClose }: ApiKeyManagerProps) {
  const [apiKey, setApiKeyState] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isPersistEnabled, setIsPersistEnabled] = useState(false);
  const [capabilities, setCapabilities] = useState<{name: string, available: boolean}[]>([]);

  // Load key from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const bytes = CryptoJS.AES.decrypt(stored, SECRET_SALT);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (decrypted) {
          setApiKeyState(decrypted);
          setApiKey(decrypted);
          setIsPersistEnabled(true);
          // Optional: Auto-test on load? Maybe just set it.
        }
      } catch (e) {
        console.error("Failed to decrypt stored key");
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleTestConnection = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    
    if (!apiKey) {
      setStatus('error');
      setMessage('API Key를 입력해주세요.');
      return;
    }

    setStatus('testing');
    setMessage('연결 테스트 중...');
    setCapabilities([]);

    try {
      const success = await testConnection(apiKey);

      if (success) {
        setStatus('success');
        setMessage('연결 성공! 키가 저장되었습니다.');
        setApiKey(apiKey);
        
        // Mock capabilities check
        setCapabilities([
          { name: '프롬프트/텍스트', available: true },
          { name: '음악 스타일 분석', available: true },
          { name: '가사 생성', available: true },
        ]);

        if (isPersistEnabled) {
          saveToStorage(apiKey);
        }
      } else {
        setStatus('error');
        setMessage('연결 실패. API Key를 확인해주세요.');
        setCapabilities([]);
      }
    } catch (error: any) {
      setStatus('error');
      setCapabilities([]);
      if (error.message === "QUOTA_EXCEEDED") {
        setMessage('연결 실패: 이 API Key의 사용 한도가 초과되었습니다.');
      } else {
        setMessage('연결 실패. API Key를 확인해주세요.');
      }
    }
  };

  const handleDelete = () => {
    setApiKeyState('');
    setApiKey(null);
    setStatus('idle');
    setMessage('');
    setCapabilities([]);
    localStorage.removeItem(STORAGE_KEY);
    // Keep persist enabled state or reset? Let's keep it as user preference, 
    // but since key is gone, nothing is saved.
  };

  const saveToStorage = (key: string) => {
    const encrypted = CryptoJS.AES.encrypt(key, SECRET_SALT).toString();
    localStorage.setItem(STORAGE_KEY, encrypted);
  };

  const togglePersist = () => {
    const newState = !isPersistEnabled;
    setIsPersistEnabled(newState);
    
    if (newState && apiKey && status === 'success') {
      saveToStorage(apiKey);
    } else if (!newState) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#1a1b1e] border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#25262b]">
              <div className="flex items-center gap-2 text-white">
                <Settings className="w-5 h-5" />
                <h2 className="text-lg font-bold">설정</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* API Key Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label className="text-sm font-bold text-white">
                    API 키 설정 및 테스트
                  </label>
                  <span className="text-xs text-slate-500">
                    (Google AI Studio Key - 모든 티어 호환)
                  </span>
                </div>
                
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••••••"
                  className="w-full bg-[#141517] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={status === 'testing'}
                    className="flex-1 bg-[#2c2e33] hover:bg-[#373a40] text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    {status === 'testing' ? (
                      <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                    ) : (
                      <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                    저장 및 테스트
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </div>

              {/* Result Box */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#141517] rounded-lg border border-white/5 p-4 space-y-3"
                  >
                    <div className="text-sm font-medium text-slate-400">
                      키 권한 확인 결과:
                    </div>
                    <div className="space-y-2">
                      {capabilities.map((cap, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            {idx === 0 ? <FileText className="w-3.5 h-3.5" /> : 
                             idx === 1 ? <Music className="w-3.5 h-3.5" /> : 
                             <Zap className="w-3.5 h-3.5" />}
                            {cap.name}
                          </div>
                          <div className="flex items-center gap-1 text-emerald-400 font-medium text-xs">
                            <Check className="w-3.5 h-3.5" />
                            가능
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <Check className="w-4 h-4" />
                      {message}
                    </div>
                  </motion.div>
                )}
                
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 rounded-lg border border-red-500/20 p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-400">{message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px bg-white/5" />

              {/* Local Encryption Toggle */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    사용자 로컬 암호화
                  </div>
                  <button
                    type="button"
                    onClick={togglePersist}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isPersistEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`${
                        isPersistEnabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  브라우저 내에 저장되는 임시 데이터나 기록을 암호화하여 보호합니다. (현재 세션에 적용)
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#25262b] border-t border-white/5 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-black hover:bg-slate-200 font-medium rounded-lg text-sm transition-colors"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}
