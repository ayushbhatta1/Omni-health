import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/test', (req, res) => {
  res.send('<h1>Backend Server is Alive 🚀</h1>');
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  console.log('Serving index.html for:', req.url);
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Static files being served from: ${join(__dirname, 'dist')}`);
});
