/**
 * Entry loader + sound gate. Shows once (until the user picks a preference),
 * then never blocks again. Sound is strictly opt-in.
 */
import { initAudio, play } from '@/lib/audio';
import { EASE_EXPO } from '@/lib/motion';
import { useStore, store } from '@/lib/store';
import { AppleHelloEnglishEffect } from '@components/ui/apple-hello-effect';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { useState } from 'react';

export default function SoundGate() {
  const sound = useStore((s) => s.sound);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

  const choose = (on: boolean) => {
    store.setSound(on ? 'on' : 'off');
    initAudio();
    if (on) play('enter');
  };

  return (
    <AnimatePresence>
      {sound === 'unknown' && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950 text-neutral-50"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
        >
          <motion.div
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-10 px-6 text-center"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              aria-label="hello, I am Kovid."
              className="flex max-w-full items-center justify-center"
            >
              {/* Speed 0 collapses the draw for reduced-motion, so
                  onAnimationComplete still gates the buttons. */}
              <AppleHelloEnglishEffect
                aria-hidden="true"
                className="h-[clamp(2.5rem,8vw,6rem)] w-auto shrink-0"
                onAnimationComplete={() => setReady(true)}
                speed={reduce ? 0 : 0.45}
              />
              <motion.span
                animate="visible"
                aria-hidden="true"
                className="relative -ml-1 [font-family:var(--font-display)] text-[clamp(1.25rem,4.5vw,3.5rem)] leading-none font-medium tracking-[-0.045em] whitespace-nowrap [perspective:600px] sm:-ml-2"
                initial={reduce ? false : 'hidden'}
                variants={introTextVariants}
              >
                {', I am Kovid.'.split('').map((character, index) => (
                  <motion.span
                    className="inline-block"
                    key={`${character}-${index}`}
                    variants={introCharacterVariants}
                  >
                    {character === ' ' ? '\u00a0' : character}
                  </motion.span>
                ))}
                {!reduce && (
                  <motion.span
                    animate={{ opacity: [0, 0.55, 0], scaleX: [0, 1, 1] }}
                    className="absolute -bottom-[0.14em] left-0 h-px w-full origin-left bg-current"
                    initial={{ opacity: 0, scaleX: 0 }}
                    transition={{
                      delay: 0.2,
                      duration: 1.15,
                      ease: EASE_EXPO,
                      times: [0, 0.78, 1],
                    }}
                  />
                )}
              </motion.span>
            </h1>

            <AnimatePresence>
              {ready && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.6, ease: EASE_EXPO }}
                >
                  <p className="max-w-xs [font-family:var(--font-display)] text-sm font-normal text-white/45 sm:text-base">
                    This is best with sound on. Your call.
                  </p>
                  <div className="flex items-center gap-3">
                    <GateButton
                      label="Enter with sound"
                      onClick={() => choose(true)}
                      primary
                      reduceMotion={!!reduce}
                    >
                      <SoundOnIcon />
                    </GateButton>
                    <GateButton
                      label="Enter silently"
                      onClick={() => choose(false)}
                      reduceMotion={!!reduce}
                    >
                      <SoundOffIcon />
                    </GateButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const introTextVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.045,
    },
  },
};

const introCharacterVariants: Variants = {
  hidden: {
    filter: 'blur(6px)',
    opacity: 0,
    rotateX: 55,
    rotateZ: -4,
    scale: 0.9,
    x: '-0.12em',
    y: '0.32em',
  },
  visible: {
    filter: 'blur(0px)',
    opacity: 1,
    rotateX: 0,
    rotateZ: 0,
    scale: 1,
    transition: { duration: 0.38, ease: EASE_EXPO },
    x: 0,
    y: 0,
  },
};

function GateButton({
  children,
  label,
  onClick,
  primary,
  reduceMotion,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.button
      aria-label={label}
      className={
        'group flex size-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ' +
        (primary
          ? 'bg-white text-neutral-950 hover:bg-white/85'
          : 'border border-white/25 text-white/70 hover:border-white/50 hover:text-white')
      }
      initial="idle"
      onClick={onClick}
      type="button"
      whileFocus={reduceMotion ? undefined : 'active'}
      whileHover={reduceMotion ? undefined : 'active'}
      whileTap={reduceMotion ? undefined : { scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
}

const soundWaveVariants: Variants = {
  idle: { opacity: 0.3, x: 0 },
  active: (delay: number) => ({
    opacity: [0.25, 1, 0.25],
    transition: {
      delay,
      duration: 0.9,
      ease: 'easeInOut',
      repeat: Infinity,
    },
    x: [0, 1, 0],
  }),
};

const speakerVariants: Variants = {
  idle: { scale: 1 },
  active: {
    scale: [1, 1.08, 1],
    transition: { duration: 0.9, ease: 'easeInOut', repeat: Infinity },
  },
};

function SpeakerShape() {
  return (
    <motion.path
      d="M4 10h3.2L11 6.7v10.6L7.2 14H4z"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ originX: 0.4, originY: 0.5 }}
      variants={speakerVariants}
    />
  );
}

function SoundOnIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 overflow-visible"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <SpeakerShape />
      <motion.path
        custom={0}
        d="M14 9.3a3.6 3.6 0 0 1 0 5.4"
        strokeLinecap="round"
        variants={soundWaveVariants}
      />
      <motion.path
        custom={0.12}
        d="M16.8 6.7a7.2 7.2 0 0 1 0 10.6"
        strokeLinecap="round"
        variants={soundWaveVariants}
      />
    </svg>
  );
}

const muteMarkVariants: Variants = {
  idle: { opacity: 0.65, rotate: 0, scale: 1 },
  active: {
    opacity: [0.65, 1, 1],
    rotate: [0, -8, 8, 0],
    scale: [1, 1.12, 1],
    transition: {
      duration: 0.7,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 0.15,
    },
  },
};

function SoundOffIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 overflow-visible"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <SpeakerShape />
      <motion.g
        strokeLinecap="round"
        style={{ originX: '17px', originY: '12px' }}
        variants={muteMarkVariants}
      >
        <path d="m14.5 9 5 6" />
        <path d="m19.5 9-5 6" />
      </motion.g>
    </svg>
  );
}
