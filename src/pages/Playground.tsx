import MusicControls from '@/components/MusicControls';
import MusicSequencer from '@/components/MusicSequencer';
import { PRESETS } from '@/lib/presets';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

/** A single instrument surface: identity, score and transport share one frame. */
export default function Playground() {
  const state = useStore((current) => current);
  const activePreset = PRESETS.find((preset) => preset.id === state.presetId);
  const status = activePreset
    ? `${activePreset.label} · ${activePreset.artist}`
    : state.noteCount > 0
      ? `${state.noteCount} ${state.noteCount === 1 ? 'note' : 'notes'} · your score`
      : 'Spatial sequencer';
  const instruction = state.sequencerPlaying
    ? 'Notes sound as they cross the white gate.'
    : activePreset
      ? 'Swipe to inspect the score. Press play to resume.'
      : state.noteCount > 0
        ? 'Swipe to explore. Click or drag to keep composing.'
        : 'Click or drag to add notes. Swipe sideways to explore.';

  return (
    <div className="h-[100svh]">
      <motion.section
        animate={{ opacity: 1 }}
        aria-label="Spatial music sequencer"
        className="relative flex h-full min-h-0 flex-col overflow-hidden bg-stone-50 dark:bg-neutral-950"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="flex h-16 shrink-0 items-center border-b border-black/10 px-5 pr-40 sm:px-8 sm:pr-52 dark:border-white/10">
          <div className="min-w-0">
            <h1 className="truncate text-base font-medium sm:text-lg">
              Playground
            </h1>
            <p className="text-quaternary mt-0.5 truncate text-[10px] leading-none sm:text-xs">
              {status}
            </p>
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <MusicSequencer />
          <p className="text-quaternary pointer-events-none absolute top-4 left-[4.5rem] z-[3] max-w-[18rem] text-[10px] leading-snug sm:top-5 sm:left-20 sm:max-w-none sm:text-xs">
            {instruction}
          </p>
        </div>

        <MusicControls />
      </motion.section>
    </div>
  );
}
