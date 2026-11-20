import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

export const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    primary: '#0B6BAE',
    background: '#F3F7FA',
    card: '#FFFFFF',
    text: '#0E2433',
    border: '#DCE6EE',
    notification: '#B42318',
  },
};

export const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    primary: '#4DB3EB',
    background: '#0A1620',
    card: '#122231',
    text: '#E8F1F7',
    border: '#213A4F',
    notification: '#F97066',
  },
};
