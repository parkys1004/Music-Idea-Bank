import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  showScrollTop: boolean;
  scrollToTop: () => void;
}

export default function ScrollToTop({ showScrollTop, scrollToTop }: ScrollToTopProps) {
  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-colors border border-white/20"
          whileHover={{ y: -5 }}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
