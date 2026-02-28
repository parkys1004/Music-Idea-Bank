import { motion, AnimatePresence } from 'motion/react';
import { X, History, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { MusicIdea } from '../services/ai';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MusicIdea[];
  onSelectIdea: (idea: MusicIdea) => void;
  onClearHistory: () => void;
}

export default function HistoryModal({ isOpen, onClose, history, onSelectIdea, onClearHistory }: HistoryModalProps) {
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
                <History className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold">생성 기록 다시보기</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                  <Clock className="w-12 h-12 mb-4 opacity-20" />
                  <p>아직 생성된 기록이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((idea, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectIdea(idea);
                        onClose();
                      }}
                      className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all group flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {idea.genre || 'Unknown Genre'}
                          </span>
                          <h3 className="text-white font-bold truncate">{idea.title}</h3>
                        </div>
                        <p className="text-slate-400 text-xs truncate font-mono opacity-60">
                          {idea.stylePrompt}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors ml-4" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#25262b] border-t border-white/5 flex justify-between items-center">
              <button
                onClick={onClearHistory}
                disabled={history.length === 0}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                기록 전체 삭제
              </button>
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
