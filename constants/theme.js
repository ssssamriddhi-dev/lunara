// Lunara Design System — Nocturne
// Every color, size and spacing value lives here.

export const COLORS = {
  // Surfaces
  background: '#F7F5F0',    // warm ivory — main screen background
  surface: '#FFFFFF',       // cards sitting on the background
  surfaceMuted: '#EDE7DC',  // warm sand — secondary cards, unselected chips

  // Brand
  ink: '#2E3350',           // indigo — headings, primary buttons
  slate: '#6B7399',         // muted indigo — icons, secondary elements
  gold: '#C9A86A',          // accent — highlights, active states
  terracotta: '#C1705C',    // warm accent — period days, flow

  // Text
  textPrimary: '#2E3350',
  textSecondary: '#5F6478',
  textMuted: '#8E90A0',
  textOnDark: '#F7F5F0',    // text sitting on top of ink

  // Cycle calendar
  period: '#C1705C',
  fertile: '#C3C8DC',
  ovulation: '#4A5178',
  predicted: '#D6D0C4',     // subtle outline for estimated period

  // Utility
  border: '#E4DED2',
  white: '#FFFFFF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const FONT_SIZES = {
  caption: 13,
  body: 16,
  subtitle: 18,
  title: 24,
  heading: 32,
};

export const SHADOW = {
  card: {
    shadowColor: '#2E3350',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
};
