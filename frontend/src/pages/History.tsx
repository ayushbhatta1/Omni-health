import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { getAnalysisHistory } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { formatDate } from '../utils/formatting';
import type { AnalysisHistory } from '../types';

export const History: React.FC = () => {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAnalysisHistory();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis history');
      toast({
        title: 'Error',
        description: 'Failed to load analysis history',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'blue';
      case 'audio':
        return 'green';
      case 'video':
        return 'purple';
      case 'text':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Analysis History
          </Heading>
          <Text color="gray.600">
            View your past medical analyses and their results
          </Text>
        </Box>

        {isLoading && <LoadingSpinner message="Loading history..." />}

        {error && (
          <ErrorMessage
            title="History Error"
            message={error}
            onRetry={fetchHistory}
          />
        )}

        {!isLoading && !error && (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Type</Th>
                  <Th>Findings</Th>
                  <Th>Recommendations</Th>
                </Tr>
              </Thead>
              <Tbody>
                {history.map((item) => (
                  <Tr key={item.id}>
                    <Td>{formatDate(new Date(item.date))}</Td>
                    <Td>
                      <Badge colorScheme={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        {item.findings.map((finding, index) => (
                          <Text key={index} fontSize="sm">
                            • {finding}
                          </Text>
                        ))}
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        {item.recommendations.map((recommendation, index) => (
                          <Text key={index} fontSize="sm">
                            • {recommendation}
                          </Text>
                        ))}
                      </VStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Container>
  );
}; 