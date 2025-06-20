import React from 'react';
import {
  ChakraProvider,
  ColorModeScript,
  createLocalStorageManager,
} from '@chakra-ui/react';
import { theme } from '../theme';

const colorModeManager = createLocalStorageManager('medical-ai-color-mode');

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        {children}
      </ChakraProvider>
    </>
  );
}; 