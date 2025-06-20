import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { AnalysisResult } from '../components/AnalysisResult';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { analyzeImage, analyzeAudio, analyzeVideo, analyzeText, type AnalysisResponse } from '../services/api';
import { SymptomAnalysis } from '../components/SymptomAnalysis';

const ACCEPTED_FILE_TYPES = {
  image: {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
  },
  audio: {
    'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
  },
  video: {
    'video/*': ['.mp4', '.mov', '.avi', '.webm'],
  },
};

export const Analysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'image';
  const [activeTab, setActiveTab] = useState(initialType);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const toast = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let response: AnalysisResponse;

      switch (activeTab) {
        case 'image':
          response = await analyzeImage(file);
          break;
        case 'audio':
          response = await analyzeAudio(file);
          break;
        case 'video':
          response = await analyzeVideo(file);
          break;
        case 'text':
          response = await analyzeText(file.name);
          break;
        default:
          throw new Error('Invalid analysis type');
      }

      setResult(response);
      toast({
        title: 'Analysis Complete',
        description: 'Your file has been analyzed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      toast({
        title: 'Analysis Failed',
        description: 'There was an error analyzing your file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileAnalysis = async (file: File, type: 'image' | 'audio' | 'video') => {
    try {
      let result;
      switch (type) {
        case 'image':
          result = await analyzeImage(file);
          break;
        case 'audio':
          result = await analyzeAudio(file);
          break;
        case 'video':
          result = await analyzeVideo(file);
          break;
      }

      toast({
        title: 'Analysis Complete',
        description: 'The file has been analyzed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return result;
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'There was an error analyzing the file.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Medical Analysis
          </Heading>
          <Text color="gray.600">
            Upload your file for AI-powered medical analysis
          </Text>
        </Box>

        <Tabs
          variant="enclosed"
          colorScheme="blue"
          index={['image', 'audio', 'video', 'text'].indexOf(activeTab)}
          onChange={(index) => setActiveTab(['image', 'audio', 'video', 'text'][index])}
        >
          <TabList>
            <Tab>File Analysis</Tab>
            <Tab>Symptom Analysis</Tab>
          </TabList>

          <TabPanels>
            {['image', 'audio', 'video'].map((type) => (
              <TabPanel key={type}>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  accept={ACCEPTED_FILE_TYPES[type as keyof typeof ACCEPTED_FILE_TYPES]}
                  title={`Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                  description={`Drag and drop your ${type} file here, or click to select`}
                />
              </TabPanel>
            ))}
            <TabPanel>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept={{ 'text/*': ['.txt'] }}
                title="Upload Text"
                description="Drag and drop your text file here, or click to select"
              />
            </TabPanel>
            <TabPanel>
              <SymptomAnalysis />
            </TabPanel>
          </TabPanels>
        </Tabs>

        {isLoading && <LoadingSpinner message="Analyzing your file..." />}

        {error && (
          <ErrorMessage
            title="Analysis Error"
            message={error}
            onRetry={handleAnalyze}
          />
        )}

        {result && <AnalysisResult result={result} />}
      </VStack>
    </Container>
  );
}; 