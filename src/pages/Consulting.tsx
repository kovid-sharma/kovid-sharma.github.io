/** Consulting intro and live Cal.com booking page. */
import { EASE_EXPO } from '@/lib/motion';
import Cal, { getCalApi } from '@calcom/embed-react';
import EmailLink from '@components/EmailLink';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

// ponytail: set this to your public cal.com link, "username/event-slug".
const CAL_LINK = 'kovid-sharma/15min';
const CAL_NAMESPACE = 'consulting';
const EMAIL = 'kovid2020@gmail.com';

export default function Consulting() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      if (cancelled) return;
      cal('ui', {
        cssVarsPerTheme: {
          dark: { 'cal-brand': '#ffffff' },
          light: { 'cal-brand': '#111111' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
        theme,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [theme]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="page-gutter relative flex min-h-[100svh] w-full flex-col gap-8"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE_EXPO }}
    >
      <header className="flex w-full max-w-xl shrink-0 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h1>Consulting</h1>
          <p className="text-tertiary text-xs font-medium tracking-wide">
            AI &amp; Data Advisory
          </p>
        </div>
        <p className="text-secondary text-base">
          Book a 15-minute intro call for AI &amp; LLM engineering, data
          prototyping, or technical advisory. The first call is on me. You can
          also reach me at{' '}
          <EmailLink aria-label={`Email ${EMAIL}`} href={`mailto:${EMAIL}`}>
            kovid2020[at]gmail[dot]com
          </EmailLink>
          .
        </p>
      </header>

      <div className="pointer-events-auto min-h-0 w-full max-w-5xl flex-1">
        <Cal
          calLink={CAL_LINK}
          config={{ layout: 'month_view', theme }}
          namespace={CAL_NAMESPACE}
          style={{ height: '100%', overflow: 'scroll', width: '100%' }}
        />
      </div>
    </motion.div>
  );
}
