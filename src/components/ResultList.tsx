import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Check, Copy, Wand2, Mic2, Loader2 } from 'lucide-react';
import { MusicIdea } from '../services/ai';

interface ResultListProps {
  ideas: MusicIdea[];
  isLoading: boolean;
  reset: () => void;
  selectedGenre: string | null;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
}

export default function ResultList({
  ideas,
  isLoading,
  reset,
  selectedGenre,
  copyToClipboard,
  copiedId,
}: ResultListProps) {
  return (
    <AnimatePresence>
      {ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Navigation / Reset (Only show when fully done or at least metadata exists) */}
          {!isLoading && (
            <div className="flex items-center justify-between">
              <button 
                onClick={reset}
                className="flex items-center text-white/60 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다른 장르 선택하기
              </button>
              <div className="flex items-center gap-3">
                <div className="px-4 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-sm font-medium">
                  {selectedGenre}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-8">
            {ideas.map((idea, idx) => (
              <motion.div
                id={`idea-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all scroll-mt-32"
              >
                {/* Card Header: Title */}
                <div className="p-6 md:p-8 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 group/title">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold font-mono">
                      {idx + 1}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{idea.title}</h2>
                    <button
                      onClick={() => copyToClipboard(idea.title, `${idx}-title`)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 group-hover/title:text-white/60 hover:text-white transition-colors"
                      title="제목 복사"
                    >
                      {copiedId === `${idx}-title` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Style Prompt Section */}
                  <div className="flex-1 md:max-w-xl">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-emerald-500/10 rounded-xl blur-sm group-hover:bg-emerald-500/20 transition-all" />
                      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl p-3 pr-10 flex items-center">
                        <Wand2 className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                        <p className="text-sm text-white/70 truncate font-mono">{idea.stylePrompt}</p>
                        <button
                          onClick={() => copyToClipboard(idea.stylePrompt, `${idx}-style`)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="스타일 프롬프트 복사"
                        >
                          {copiedId === `${idx}-style` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body: Lyrics */}
                <div className="p-6 md:p-8 relative group/lyrics">
                  <div className="absolute top-6 right-6 opacity-0 group-hover/lyrics:opacity-100 transition-opacity">
                     <button
                      onClick={() => copyToClipboard(idea.lyrics, `${idx}-lyrics`)}
                      className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors text-xs font-medium backdrop-blur-sm"
                    >
                      {copiedId === `${idx}-lyrics` ? (
                        <>
                          <Check className="w-3 h-3 mr-1.5 text-emerald-400" />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1.5" />
                          가사 복사
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mic2 className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                    <div className="space-y-2 w-full">
                      <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Lyrics</h3>
                      {idea.lyrics ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="whitespace-pre-wrap text-white/90 leading-relaxed font-light text-lg"
                        >
                          {idea.lyrics}
                        </motion.div>
                      ) : (
                        <div className="flex items-center space-x-2 text-white/30 py-4">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>가사 생성 중...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
