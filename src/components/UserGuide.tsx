import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Key, Music, Settings2, Copy } from 'lucide-react';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserGuide({ isOpen, onClose }: UserGuideProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#1a1b1e] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#25262b]">
              <div className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold">사용 설명서</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
              
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    API Key 설정
                    <Key className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    앱을 사용하려면 Google Gemini API Key가 필요합니다. 
                    우측 상단의 <span className="text-emerald-400 font-medium">'API Key 관리'</span> 버튼을 눌러 키를 등록해주세요.
                    <br />
                    <span className="text-xs text-slate-500 mt-1 block">* 키는 브라우저에 암호화되어 저장되며 서버로 전송되지 않습니다.</span>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    옵션 설정 (선택 사항)
                    <Settings2 className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <span className="text-blue-400 font-medium">'생성 옵션 설정'</span>을 열어 가사 언어(한국어/영어 등), 보컬 타입(여성/남성/듀엣), AI 모델을 선택할 수 있습니다.
                    기본값으로 바로 시작해도 좋습니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    장르 선택 및 생성
                    <Music className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    원하는 음악 장르 카드를 클릭하세요. AI가 해당 장르에 최적화된 
                    <span className="text-white font-medium"> 제목, 가사, 스타일 프롬프트</span>를 자동으로 생성합니다.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold border border-orange-500/20">
                  4
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    결과 활용
                    <Copy className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    생성된 결과물의 제목, 스타일 프롬프트, 가사를 각각 복사 버튼을 눌러 클립보드에 저장할 수 있습니다.
                    <br />
                    이 프롬프트를 <span className="text-orange-400 font-medium">Suno AI</span>나 <span className="text-orange-400 font-medium">Udio</span> 같은 음악 생성 AI에 붙여넣어 실제 음악을 만들어보세요!
                  </p>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="pt-4 border-t border-white/5">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    화면이나 폰트가 이상하게 보이나요?
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    브라우저의 <span className="text-white font-medium">자동 번역 기능</span>이 켜져 있으면 화면이 깨지거나 폰트가 이상하게 보일 수 있습니다.
                    주소창 우측의 번역 아이콘을 눌러 <span className="text-white font-medium">'번역 끄기'</span> 또는 <span className="text-white font-medium">'원본 보기'</span>를 선택해주세요.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-[#25262b] border-t border-white/5 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-black hover:bg-slate-200 font-medium rounded-lg text-sm transition-colors"
              >
                확인했습니다
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
