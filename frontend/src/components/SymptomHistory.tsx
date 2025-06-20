import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Badge,
  List,
  ListItem,
  HStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export interface SymptomRecord {
  id: string;
  symptoms: string;
  severity: 'mild' | 'moderate' | 'severe';
  timestamp: string;
  diagnosis?: string;
  recommendations?: string[];
}

interface SymptomHistoryProps {
  records: SymptomRecord[];
  onDelete: (id: string) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'mild':
      return 'green';
    case 'moderate':
      return 'yellow';
    case 'severe':
      return 'red';
    default:
      return 'gray';
  }
};

export const SymptomHistory: React.FC<SymptomHistoryProps> = ({ records, onDelete }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box p={4} bg={bgColor} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Symptom History</Heading>
        
        {records.length === 0 ? (
          <Text color="gray.500">No symptom records yet.</Text>
        ) : (
          <List spacing={3}>
            {records.map((record) => (
              <ListItem
                key={record.id}
                p={3}
                borderWidth={1}
                borderRadius="md"
                borderColor={borderColor}
              >
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Badge colorScheme={getSeverityColor(record.severity)}>
                      {record.severity}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(record.timestamp).toLocaleString()}
                    </Text>
                  </HStack>
                  
                  <Text>{record.symptoms}</Text>
                  
                  {record.diagnosis && (
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Diagnosis:</Text>
                      <Text fontSize="sm">{record.diagnosis}</Text>
                    </Box>
                  )}
                  
                  {record.recommendations && record.recommendations.length > 0 && (
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Recommendations:</Text>
                      <List spacing={1}>
                        {record.recommendations.map((rec, index) => (
                          <ListItem key={index} fontSize="sm">
                            • {rec}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                  
                  <HStack justify="flex-end">
                    <IconButton
                      aria-label="Delete record"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onDelete(record.id)}
                    />
                  </HStack>
                </VStack>
              </ListItem>
            ))}
          </List>
        )}
      </VStack>
    </Box>
  );
}; 