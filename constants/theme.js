// Lunara Design System — Lunar Bloom

export const COLORS = {
  background: '#FBF6FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F3EAF3',
  surfaceTint: '#F7EDF6',

  ink: '#5B4470',
  slate: '#8B7AA3',
  gold: '#C9A86A',
  orchid: '#B98FC4',
  blush: '#E6A9C4',
  terracotta: '#D4849E',
  petal: '#F0C8DC',

  textPrimary: '#4A3760',
  textSecondary: '#7A6B8C',
  textMuted: '#A99BB8',
  textOnDark: '#FFFFFF',

  period: '#D4849E',
  fertile: '#DCC9E8',
  ovulation: '#9B7BB5',
  predicted: '#E8DCEC',

  coral: '#E0806B',
  amber: '#DCA84F',
  butter: '#E8C765',
  teal: '#5AA39C',
  sage: '#8FA882',
  sky: '#7398C9',
  lilac: '#A88FCF',
  mint: '#7FBFA8',
  peach: '#E8A87C',
  rose: '#D98BA4',
  plum: '#8E6BA8',
  magenta: '#C4577E',

  border: '#EDE2EE',
  white: '#FFFFFF',
};

export const GRADIENTS = {
  screen: ['#FDF8FC', '#FBF2F8', '#F6EBF5', '#F2E6F3'],
  splash: ['#F5D3E4', '#E8C4E0', '#D4B5DE', '#B9A8D6', '#A79BC9'],
  hero: ['#E8C4E0', '#C9AEDA', '#A79BC9'],
  card: ['#FFFFFF', '#FDF8FC'],
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const RADIUS = { sm: 8, md: 16, lg: 24, pill: 999 };
export const FONT_SIZES = { caption: 13, body: 16, subtitle: 18, title: 24, heading: 32 };

export const FONTS = {
  display: 'CormorantGaramond_600SemiBold',
  displayLight: 'CormorantGaramond_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
};

export const TYPE = {
  hero: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 44, letterSpacing: 0.5 },
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 32, letterSpacing: 0.3 },
  subtitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, letterSpacing: -0.2 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 15, letterSpacing: -0.1 },
  bodyMedium: { fontFamily: 'Inter_500Medium', fontSize: 15, letterSpacing: -0.1 },
  caption: { fontFamily: 'Inter_400Regular', fontSize: 12.5, letterSpacing: 0.1 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
};

export const SHADOW = {
  card: { shadowColor: '#5B4470', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
};
export const SHADOW_SOFT = {
  shadowColor: '#5B4470', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
};
export const SHADOW_LIFT = {
  shadowColor: '#5B4470', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 6,
};
