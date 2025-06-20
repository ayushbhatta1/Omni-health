import React from 'react';
import {
  Box,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
}) => {
  return (
    <VStack spacing={4} align="center" justify="center" minH="200px">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text color="gray.500">{message}</Text>
    </VStack>
  );
}; 