import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export const Navigation: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={10}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={2}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Link
            as={RouterLink}
            to="/"
            fontSize="xl"
            fontWeight="bold"
            color="brand.500"
            _hover={{ textDecoration: 'none', color: 'brand.600' }}
          >
            Medical AI Assistant
          </Link>
          <HStack spacing={4}>
            <Link
              as={RouterLink}
              to="/"
              color="gray.600"
              _hover={{ color: 'brand.500' }}
            >
              Home
            </Link>
            <Link
              as={RouterLink}
              to="/analysis"
              color="gray.600"
              _hover={{ color: 'brand.500' }}
            >
              Analysis
            </Link>
            <Link
              as={RouterLink}
              to="/history"
              color="gray.600"
              _hover={{ color: 'brand.500' }}
            >
              History
            </Link>
          </HStack>
        </HStack>

        <IconButton
          aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          size="md"
        />
      </Flex>
    </Box>
  );
}; 