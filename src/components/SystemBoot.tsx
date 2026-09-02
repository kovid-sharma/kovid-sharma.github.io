import { EASE_EXPO } from '@/lib/motion';
import { useStore, store } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export default function SystemBoot() {
  const sound = useStore((s) => s.sound); // Hijacked to mean "booted"

  useEffect(() => {
    if (sound !== 'unknown') return;
    
    // Automatically dismiss the loading screen after 1.5 seconds
    const timer = setTimeout(() => {
      store.setSound('on');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [sound]);

  return (
    <AnimatePresence>
      {sound === 'unknown' && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-neutral-400"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="flex items-center gap-3 font-mono text-sm tracking-widest"
          >
            LOADING...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
