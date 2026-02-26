import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { GENRES } from '../constants';
import { cn } from '../lib/utils';

interface GenreGridProps {
  ideasLength: number;
  isLoading: boolean;
  handleGenreSelect: (genreName: string) => void;
}

export default function GenreGrid({ ideasLength, isLoading, handleGenreSelect }: GenreGridProps) {
  return (
    <AnimatePresence mode="wait">
      {ideasLength === 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          {GENRES.map((genre) => (
            <motion.button
              key={genre.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenreSelect(genre.name)}
              className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 text-left transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br",
                genre.color
              )} />
              
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br shadow-lg",
                  genre.color
                )}>
                  <genre.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{genre.name}</h3>
                  <div className="flex items-center text-white/40 text-sm font-medium group-hover:text-white/80 transition-colors">
                    생성하기 <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
