import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
} from '@chakra-ui/react';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  onRetry,
}) => {
  return (
    <VStack spacing={4} align="stretch">
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="auto"
        p={4}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          {title}
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {message}
        </AlertDescription>
        {onRetry && (
          <Button
            colorScheme="red"
            variant="outline"
            mt={4}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </Alert>
    </VStack>
  );
}; 