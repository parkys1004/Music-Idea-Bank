import { motion, AnimatePresence } from 'motion/react';

interface LoadingProgressProps {
  isLoading: boolean;
  statusMessage: string;
  progress: number;
}

export default function LoadingProgress({ isLoading, statusMessage, progress }: LoadingProgressProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="w-full max-w-md space-y-4">
            <div className="flex justify-between text-sm font-medium text-white/80">
              <span>{statusMessage}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
