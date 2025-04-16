# Healthcare Translation Web App

A real-time healthcare translation web application that enables seamless communication between patients and healthcare providers across different languages.

## Features

- Real-time voice-to-text transcription
- Instant translation using Gemini AI
- Audio playback of translations
- Mobile-responsive design
- Support for multiple languages
- Medical terminology optimization

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Gemini AI API
- Web Speech API
- React
- Node.js

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template:
   ```bash
   cp .env.local.example .env.local
   ```
4. Add your Gemini AI API key to `.env.local`
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

- `GEMINI_API_KEY`: Your Gemini AI API key
- `DEFAULT_SOURCE_LANG`: Default source language (e.g., 'en')
- `DEFAULT_TARGET_LANG`: Default target language (e.g., 'es')

## Security and Privacy

This application implements basic security measures to protect patient data:
- No data persistence
- Client-side processing where possible
- Secure API communication
- Environment variable protection

## License

MIT 

