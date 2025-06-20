import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#b3e0ff',
      200: '#80cbff',
      300: '#4db5ff',
      400: '#1a9fff',
      500: '#0080ff',
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
    medical: {
      primary: '#2B6CB0',
      secondary: '#4299E1',
      accent: '#63B3ED',
      success: '#48BB78',
      warning: '#ECC94B',
      error: '#F56565',
      info: '#4299E1',
    },
    severity: {
      mild: '#48BB78',
      moderate: '#ECC94B',
      severe: '#F56565',
      critical: '#C53030',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        medical: {
          bg: 'medical.primary',
          color: 'white',
          _hover: {
            bg: 'medical.secondary',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        p: '6',
        bg: 'white',
        borderRadius: 'lg',
        boxShadow: 'md',
      },
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
      },
    }),
  },
});

export default theme; 