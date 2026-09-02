/** Shared motion tokens — from the design system's easing/duration set. */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_QUART = [0.25, 1, 0.5, 1] as const;
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

/**
 * The navbar's menu pill and the menu card are the same surface: whichever is
 * mounted owns this layoutId, and framer morphs the pill's box into the card's
 * (and back) on open/close.
 */
export const MENU_SURFACE = 'menu-surface';
export const MENU_MORPH = { duration: 0.65, ease: EASE_QUART } as const;
