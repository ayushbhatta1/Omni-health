import React from 'react';
import { ChakraProvider, Box, useColorModeValue } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import { History } from './pages/History';
import theme from './theme';

const App: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg={bgColor}>
          <Navigation />
          <Box as="main" py={8}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
