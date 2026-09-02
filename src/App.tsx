import { cn } from '@/lib/className';
import { EASE_EXPO } from '@/lib/motion';
import AudioToggle from '@components/AudioToggle';
import Background from '@components/Background';
import CursorTrail from '@components/CursorTrail';
import MenuOverlay from '@components/MenuOverlay';
import Navbar from '@components/Navbar';
import SoundGate from '@components/SoundGate';
import { useRouterState } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThemeProvider } from 'next-themes';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isHome = pathname === '/';
  const usesPageGutter =
    isHome ||
    pathname === '/highlights' ||
    pathname === '/writing' ||
    pathname === '/consulting' ||
    pathname === '/resources';
  const isPlayground = pathname === '/playground';
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen">
      <Background showGrid={isHome} />
      {isHome && <CursorTrail />}
      <SoundGate />
      <Navbar />
      <MenuOverlay />

      <main
        className={cn(
          'relative z-10 w-full font-sans antialiased',
          isPlayground
            ? 'min-h-[100svh]'
            : cn(
                'pointer-events-none flex min-h-screen flex-col',
                usesPageGutter
                  ? 'justify-start'
                  : 'justify-center py-24 sm:py-28',
              ),
          '[&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto [&_nav]:pointer-events-auto',
          '[&_canvas]:pointer-events-auto [&_div[class*="cursor-pointer"]]:pointer-events-auto',
        )}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'w-full',
              isPlayground
                ? 'h-[100svh]'
                : usesPageGutter
                  ? 'p-0'
                  : 'mx-auto p-4',
            )}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            key={pathname}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isPlayground && <AudioToggle />}
      <Analytics />
    </div>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
