import React from 'react';
import {
  Box,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { formatFileSize } from '../utils/formatting';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: Record<string, string[]>;
  maxSize?: number;
  title?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  maxSize = 10 * 1024 * 1024,
  title = 'Upload File',
  description = 'Drag and drop your file here, or click to select',
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept,
    maxSize,
    multiple: false,
  });

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box
      {...getRootProps()}
      p={10}
      border="2px dashed"
      borderColor={isDragActive ? 'blue.400' : borderColor}
      borderRadius="lg"
      bg={isDragActive ? activeBgColor : bgColor}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        borderColor: 'blue.400',
        bg: activeBgColor,
      }}
    >
      <input {...getInputProps()} />
      <VStack spacing={4}>
        <Icon as={FaCloudUploadAlt} w={12} h={12} color="blue.400" />
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
        <Text textAlign="center" color="gray.500">
          {description}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Max file size: {formatFileSize(maxSize)}
        </Text>
      </VStack>
    </Box>
  );
}; 