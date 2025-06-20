import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  useToast,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Select,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { analyzeSymptoms, DiagnosisResponse } from '../services/openai';
import { SymptomHistory, SymptomRecord } from './SymptomHistory';

export const SymptomAnalysis: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [history, setHistory] = useState<SymptomRecord[]>([]);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter symptoms',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeSymptoms(symptoms);
      setDiagnosis(result);

      // Add to history
      const newRecord: SymptomRecord = {
        id: Date.now().toString(),
        symptoms,
        severity,
        timestamp: new Date().toISOString(),
        diagnosis: result.diagnosis,
        recommendations: result.recommendations,
      };
      setHistory([newRecord, ...history]);

      toast({
        title: 'Analysis Complete',
        description: 'Symptoms have been analyzed and added to history.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze symptoms',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setHistory(history.filter(record => record.id !== id));
    toast({
      title: 'Record Deleted',
      description: 'The symptom record has been removed.',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Box p={4} bg={bgColor} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Symptom Analysis</Heading>
            
            <FormControl>
              <FormLabel>Describe your symptoms</FormLabel>
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Enter your symptoms in detail..."
                size="lg"
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Severity Level</FormLabel>
              <Select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Analyzing..."
            >
              Analyze Symptoms
            </Button>

            {diagnosis && (
              <Box p={4} borderWidth={1} borderRadius="md">
                <Heading size="sm" mb={2}>Analysis Results</Heading>
                
                <Text fontWeight="bold">Diagnosis:</Text>
                <Text mb={2}>{diagnosis.diagnosis}</Text>
                
                <Text fontWeight="bold">Confidence:</Text>
                <Text mb={2}>{diagnosis.confidence}%</Text>
                
                <Text fontWeight="bold">Recommendations:</Text>
                <List spacing={2}>
                  {diagnosis.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      {rec}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </VStack>
        </Box>

        <SymptomHistory records={history} onDelete={handleDeleteRecord} />
      </VStack>
    </Box>
  );
}; 