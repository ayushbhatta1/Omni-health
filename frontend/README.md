# Medical AI Assistant Frontend

A modern React-based frontend for the Medical AI Assistant application, built with TypeScript and Chakra UI.

## Features

- Image analysis for skin conditions and eye diseases
- Audio analysis for breathing patterns and cough sounds
- Video analysis for movement patterns and facial expressions
- Text analysis for symptom description
- History tracking of all analyses
- Modern, responsive UI with dark mode support

## Tech Stack

- React 18
- TypeScript
- Chakra UI
- React Router
- Axios
- React Dropzone
- React Webcam

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API and other services
  ├── types/         # TypeScript type definitions
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions
  ├── theme.ts       # Chakra UI theme configuration
  ├── App.tsx        # Main App component
  └── main.tsx       # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
