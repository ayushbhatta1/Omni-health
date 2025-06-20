import React from 'react';
import {
  Box,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navigation />
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
}; 