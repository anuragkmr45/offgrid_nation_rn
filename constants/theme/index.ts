import { Colors } from '../Colors';

export interface ThemeTokens {
  colors: typeof Colors;
  borderRadius: number;
  fontSizes: {
    displayLarge: number;
    displayMedium: number;
    displaySmall: number;
    headlineMedium: number;
    headlineSmall: number;
    titleLarge: number;
    titleMedium: number;
    titleSmall: number;
    bodyLarge: number;
    bodyMedium: number;
    labelLarge: number;
  };
  fontWeights: {
    bold: string;
    medium: string;
    regular: string;
  };
}

export const lightTheme: ThemeTokens = {
  colors: Colors,
  borderRadius: 8,
  fontSizes: {
    displayLarge: 32,
    displayMedium: 28,
    displaySmall: 24,
    headlineMedium: 20,
    headlineSmall: 18,
    titleLarge: 16,
    titleMedium: 16,
    titleSmall: 14,
    bodyLarge: 14,
    bodyMedium: 14,
    labelLarge: 16,
  },
  fontWeights: {
    bold: '700',
    medium: '600',
    regular: '400',
  },
};

export const darkTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    ...Colors,
    background: '#000000',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1A1',
  },
};

// const colorScheme = Appearance.getColorScheme();
// export const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
export const theme = lightTheme;
