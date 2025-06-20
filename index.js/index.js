require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Ayush\'s AI-powered Health System 🚑🤖');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
