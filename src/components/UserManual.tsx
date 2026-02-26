import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Music, Settings, Key, Download, Sparkles } from 'lucide-react';

interface UserManualProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserManual({ isOpen, onClose }: UserManualProps) {
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
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#1a1b1e] border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
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

            {/* Content - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-8 text-slate-300 custom-scrollbar">
              
              {/* Section 1: Getting Started */}
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-white font-bold text-lg">
                  <Music className="w-5 h-5 text-emerald-400" />
                  1. 장르 선택 및 아이디어 생성
                </h3>
                <p className="text-sm leading-relaxed pl-7">
                  원하는 음악 장르 카드를 클릭하세요. AI가 해당 장르에 최적화된 
                  <span className="text-white font-medium"> 제목, 가사, 스타일 프롬프트</span>를 자동으로 생성합니다.
                  한 번에 5개의 아이디어가 생성됩니다.
                </p>
              </section>

              {/* Section 2: Options */}
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-white font-bold text-lg">
                  <Settings className="w-5 h-5 text-blue-400" />
                  2. 상세 옵션 설정
                </h3>
                <ul className="space-y-2 text-sm pl-7 list-disc list-outside marker:text-slate-600">
                  <li><span className="text-white font-medium">언어 설정:</span> 가사의 메인 언어와 서브 언어 비율을 조절할 수 있습니다. (예: 한국어 70% + 영어 30%)</li>
                  <li><span className="text-white font-medium">보컬 타입:</span> 여성, 남성, 혼성 등 원하는 보컬 톤을 지정할 수 있습니다.</li>
                  <li><span className="text-white font-medium">AI 모델:</span> 속도가 빠른 Flash 모델부터 고성능 Pro 모델까지 선택 가능합니다.</li>
                </ul>
              </section>

              {/* Section 3: API Key */}
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-white font-bold text-lg">
                  <Key className="w-5 h-5 text-yellow-400" />
                  3. API Key 관리
                </h3>
                <p className="text-sm leading-relaxed pl-7">
                  기본 제공되는 무료 할당량이 초과되면 <span className="text-white font-medium">API Key 관리</span> 메뉴에서 
                  본인의 Google Gemini API Key를 등록하여 계속 사용할 수 있습니다. 
                  등록된 키는 브라우저에 암호화되어 안전하게 저장됩니다.
                </p>
              </section>

              {/* Section 4: Save & Export */}
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-white font-bold text-lg">
                  <Download className="w-5 h-5 text-pink-400" />
                  4. 저장 및 활용
                </h3>
                <p className="text-sm leading-relaxed pl-7">
                  생성된 아이디어는 <span className="text-white font-medium">JSON 파일</span>로 다운로드하여 백업할 수 있습니다.
                  나중에 'JSON 불러오기' 기능을 통해 언제든 다시 로드하여 작업을 이어갈 수 있습니다.
                  복사 버튼을 눌러 Suno AI나 다른 음악 생성 툴에 바로 붙여넣으세요!
                </p>
              </section>

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
