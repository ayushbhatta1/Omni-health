import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaCamera, FaMicrophone, FaVideo, FaFileAlt } from 'react-icons/fa';

const features = [
  {
    title: 'Image Analysis',
    description: 'Upload images for skin condition and eye disease detection',
    icon: FaCamera,
    path: '/analysis?type=image',
  },
  {
    title: 'Audio Analysis',
    description: 'Record or upload audio for breathing and cough analysis',
    icon: FaMicrophone,
    path: '/analysis?type=audio',
  },
  {
    title: 'Video Analysis',
    description: 'Upload videos for movement pattern and facial expression analysis',
    icon: FaVideo,
    path: '/analysis?type=video',
  },
  {
    title: 'Text Analysis',
    description: 'Describe your symptoms for AI-powered analysis',
    icon: FaFileAlt,
    path: '/analysis?type=text',
  },
];

export const Home: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" py={10}>
          <Heading as="h1" size="2xl" mb={4}>
            Welcome to Medical AI Assistant
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Your intelligent health monitoring companion
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {features.map((feature, index) => (
            <Box
              key={index}
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
              }}
              transition="all 0.2s"
            >
              <VStack spacing={4} align="center">
                <Icon as={feature.icon} w={10} h={10} color="medical.primary" />
                <Heading as="h3" size="md">
                  {feature.title}
                </Heading>
                <Text textAlign="center" color="gray.600">
                  {feature.description}
                </Text>
                <Button
                  as={RouterLink}
                  to={feature.path}
                  colorScheme="blue"
                  variant="outline"
                  width="full"
                >
                  Get Started
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Box textAlign="center" py={8}>
          <Button
            as={RouterLink}
            to="/analysis"
            size="lg"
            colorScheme="blue"
            leftIcon={<Icon as={FaCamera} />}
          >
            Start Analysis
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}; 