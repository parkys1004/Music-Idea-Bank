import { motion, AnimatePresence } from 'motion/react';
import { MusicIdea } from '../services/ai';

interface QuickJumpNavProps {
  ideas: MusicIdea[];
  scrollToSection: (index: number) => void;
}

export default function QuickJumpNav({ ideas, scrollToSection }: QuickJumpNavProps) {
  return (
    <AnimatePresence>
      {ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed top-8 left-8 z-50 hidden xl:block"
        >
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 px-2">
              Quick Jump
            </div>
            {ideas.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSection(idx)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-white/70 hover:text-white transition-colors flex items-center group"
              >
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] mr-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  {idx + 1}
                </span>
                <span className="truncate max-w-[120px]">{idea.title}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
