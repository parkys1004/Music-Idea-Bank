import { motion, AnimatePresence } from 'motion/react';
import { Globe, User, Cpu } from 'lucide-react';
import { LANGUAGES, VOCAL_TYPES } from '../constants';
import { AVAILABLE_MODELS } from '../services/ai';
import { cn } from '../lib/utils';

interface SettingsPanelProps {
  showSettings: boolean;
  ideasLength: number;
  isLoading: boolean;
  mainLang: string;
  setMainLang: (lang: string) => void;
  subLang: string;
  setSubLang: (lang: string) => void;
  langPercent: number;
  setLangPercent: (percent: number) => void;
  vocalType: string;
  setVocalType: (type: string) => void;
  currentModel: string;
  handleModelChange: (modelId: string) => void;
}

export default function SettingsPanel({
  showSettings,
  ideasLength,
  isLoading,
  mainLang,
  setMainLang,
  subLang,
  setSubLang,
  langPercent,
  setLangPercent,
  vocalType,
  setVocalType,
  currentModel,
  handleModelChange,
}: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {showSettings && !ideasLength && !isLoading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mb-12 max-w-2xl mx-auto"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            {/* Language Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Globe className="w-4 h-4 text-blue-400" />
                가사 언어 설정
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 ml-1">메인 언어</label>
                  <select
                    value={mainLang}
                    onChange={(e) => setMainLang(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 ml-1">서브 언어 (옵션)</label>
                  <select
                    value={subLang}
                    onChange={(e) => setSubLang(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="None">선택 안함</option>
                    {LANGUAGES.filter(l => l.code !== mainLang).map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {subLang !== 'None' && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-white/50 mb-2">
                    <span>{LANGUAGES.find(l => l.code === mainLang)?.label} {langPercent}%</span>
                    <span>{LANGUAGES.find(l => l.code === subLang)?.label} {100 - langPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="10"
                    value={langPercent}
                    onChange={(e) => setLangPercent(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              )}
            </div>

            <div className="h-px bg-white/10" />

            {/* Vocal Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <User className="w-4 h-4 text-pink-400" />
                보컬 타입
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {VOCAL_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setVocalType(type.id)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm transition-all border",
                      vocalType === type.id
                        ? "bg-purple-500/20 border-purple-500/50 text-white"
                        : "bg-black/20 border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* AI Model Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Cpu className="w-4 h-4 text-emerald-400" />
                AI 모델 선택
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm transition-all border text-left",
                      currentModel === model.id
                        ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                        : "bg-black/20 border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
