import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const Analysis = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov'],
      'audio/*': ['.mp3', '.wav'],
    },
    multiple: false,
  });

  const handleAnalysis = async () => {
    if (files.length === 0) {
      setError('Please upload a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      let endpoint = '';
      const fileType = files[0].type.split('/')[0];
      
      switch (fileType) {
        case 'image':
          endpoint = '/analyze/image';
          break;
        case 'video':
          endpoint = '/analyze/video';
          break;
        case 'audio':
          endpoint = '/analyze/audio';
          break;
        default:
          throw new Error('Unsupported file type');
      }

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Health Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            {...getRootProps()}
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? '#f0f8ff' : 'white',
              border: '2px dashed #ccc',
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive
                ? 'Drop the file here'
                : 'Drag and drop a file here, or click to select'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Supported formats: Images (JPEG, PNG), Videos (MP4, MOV), Audio (MP3, WAV)
            </Typography>
          </Paper>

          {files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Selected file: {files[0].name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnalysis}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze'}
              </Button>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {results && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Results
                </Typography>
                <Typography variant="body1">
                  {results.message}
                </Typography>
                {results.analysis_results && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Detected Conditions:
                    </Typography>
                    {results.analysis_results.detected_conditions.map((condition, index) => (
                      <Typography key={index} variant="body2">
                        • {condition}
                      </Typography>
                    ))}
                    
                    <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                      Recommendations:
                    </Typography>
                    {results.analysis_results.recommendations.map((rec, index) => (
                      <Typography key={index} variant="body2">
                        • {rec}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export { Analysis }; 