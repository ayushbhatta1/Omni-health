import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@chakra-ui/react';

interface UseFileUploadOptions {
  accept: Record<string, string[]>;
  maxSize?: number;
  onUpload?: (file: File) => void;
}

export const useFileUpload = ({ accept, maxSize = 10 * 1024 * 1024, onUpload }: UseFileUploadOptions) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    
    if (!uploadedFile) {
      toast({
        title: 'Error',
        description: 'No file was uploaded',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (uploadedFile.size > maxSize) {
      toast({
        title: 'Error',
        description: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFile(uploadedFile);
    
    // Create preview URL for images and videos
    if (uploadedFile.type.startsWith('image/') || uploadedFile.type.startsWith('video/')) {
      const previewUrl = URL.createObjectURL(uploadedFile);
      setPreview(previewUrl);
    }

    onUpload?.(uploadedFile);
  }, [maxSize, onUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const clearFile = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  }, [preview]);

  return {
    file,
    preview,
    isDragActive,
    getRootProps,
    getInputProps,
    clearFile,
  };
}; 