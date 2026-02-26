import { ChangeEvent, RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Upload, Download, Settings2 } from 'lucide-react';

interface HeaderProps {
  setShowApiKeyManager: (show: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  historyLength: number;
  downloadHistory: () => void;
  ideasLength: number;
  isLoading: boolean;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export default function Header({
  setShowApiKeyManager,
  fileInputRef,
  handleFileUpload,
  historyLength,
  downloadHistory,
  ideasLength,
  isLoading,
  showSettings,
  setShowSettings,
}: HeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
        뮤직 아이디어 뱅크
      </h1>
      <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
        장르를 선택하면 AI가 제목, 가사, 그리고 스타일 프롬프트까지 생성해드립니다.
      </p>
      
      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowApiKeyManager(true)}
          className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium border border-emerald-500/20"
        >
          <Key className="w-4 h-4 mr-2" />
          API Key 관리
        </motion.button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".json" 
          className="hidden" 
        />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-sm font-medium border border-white/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          JSON 불러오기
        </motion.button>

        {historyLength > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={downloadHistory}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-sm font-medium border border-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            전체 히스토리 다운로드 ({historyLength}개)
          </motion.button>
        )}
      </div>

      {/* Settings Toggle */}
      {!ideasLength && !isLoading && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center text-white/60 hover:text-white transition-colors text-sm"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            {showSettings ? '설정 닫기' : '생성 옵션 설정 (언어/보컬/모델)'}
          </button>
        </div>
      )}
    </motion.div>
  );
}
