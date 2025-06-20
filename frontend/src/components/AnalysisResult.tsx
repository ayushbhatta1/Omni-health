import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { AnalysisResult as AnalysisResultType } from '../types';
import { formatConfidence } from '../utils/formatting';

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <VStack spacing={4} align="stretch" w="100%">
      <Box>
        <Heading size="md" mb={2}>
          Analysis Results
        </Heading>
        <Badge colorScheme="blue" mb={4}>
          Confidence: {formatConfidence(result.confidence)}
        </Badge>
      </Box>

      <Box>
        <Heading size="sm" mb={2}>
          Findings
        </Heading>
        <List spacing={2}>
          {result.findings.map((finding, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={FaCheckCircle} color="green.500" />
              <Text>{finding}</Text>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Heading size="sm" mb={2}>
          Recommendations
        </Heading>
        <List spacing={2}>
          {result.recommendations.map((recommendation, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={FaExclamationTriangle} color="orange.500" />
              <Text>{recommendation}</Text>
            </ListItem>
          ))}
        </List>
      </Box>

      <Alert status="info" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="auto" p={4}>
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Important Notice
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {result.disclaimer}
        </AlertDescription>
      </Alert>
    </VStack>
  );
}; 