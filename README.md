# CaffMed - Brain Tumor Detection System

CaffMed is a comprehensive brain tumor detection system that uses machine learning to analyze medical images and provide predictions for different types of brain tumors. The system consists of a Flask backend API with a CNN model and a Next.js frontend with an interactive chatbot interface.

## 🏗️ Project Structure

```
caffmed/
├── backend/                 # Flask API server
│   ├── app/                # Application modules
│   │   ├── model.py        # ML model handling
│   │   ├── routes.py       # API endpoints
│   │   └── utils.py        # Utility functions
│   ├── model/              # CNN model and dataset
│   │   ├── model.h5        # Trained CNN model
│   │   └── dataset/        # Training dataset
│   ├── server.py           # Flask application entry point
│   ├── requirements.txt    # Python dependencies
│   └── docker-compose.yml  # Docker configuration
├── frontend/               # Next.js frontend application
│   ├── app/                # Next.js app directory
│   │   ├── (main)/         # Main pages
│   │   ├── about/          # About page
│   │   ├── knowledge/      # Knowledge page
│   │   └── api/            # API routes
│   ├── components/         # Reusable React components
│   │   ├── chatbot/        # Chatbot components
│   │   ├── navbar/         # Navigation components
│   │   └── ui/             # UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── types/              # TypeScript type definitions
└── .github/
    └── workflows/          # CI/CD pipeline
```

## 🚀 Features

### Backend Features

- **Brain Tumor Detection**: CNN-based classification for 4 tumor types:
  - Glioma
  - Meningioma
  - Pituitary
  - No Tumor
- **REST API**: RESTful endpoints for image prediction
- **Model Management**: Efficient loading and caching of the trained model
- **Docker Support**: Containerized deployment

### Frontend Features

- **Interactive UI**: Modern, responsive design with dark/light theme support
- **AI Chatbot**: Intelligent chatbot for medical consultations using OpenAI
- **Image Upload**: Easy drag-and-drop image upload for tumor detection
- **Real-time Results**: Instant prediction results with confidence scores
- **Knowledge Base**: Educational content about brain tumors

## 🛠️ Technology Stack

### Backend

- **Framework**: Flask (Python)
- **ML Framework**: TensorFlow/Keras
- **Image Processing**: PIL, OpenCV
- **API**: RESTful API with JSON responses
- **Containerization**: Docker

### Frontend

- **Framework**: Next.js 15 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **AI Integration**: OpenAI API

## 📋 Prerequisites

- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 18+, npm/yarn/bun
- **Optional**: Docker and Docker Compose

## 🔧 Installation & Setup

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Create virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the server**:
   ```bash
   python server.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration:
   ```

4. **Environment variables for frontend**:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_MODEL_ENDPOINT_URL=http://localhost:8000/api/v1/predict
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   # or
   bun dev
   ```

The frontend will be available at `http://localhost:3000`

### Docker Setup (Alternative)

1. **Run with Docker Compose**:
   ```bash
   cd backend
   docker-compose up --build
   ```

## 📡 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Endpoints

#### POST `/predict`

Upload an image for brain tumor detection.

**Request**:

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Image file

**Response**:

```json
{
  "prediction": "glioma",
  "confidence": 0.95,
  "all_predictions": {
    "glioma": 0.95,
    "meningioma": 0.03,
    "pituitary": 0.015,
    "notumor": 0.005
  }
}
```

## 🤖 Chatbot Integration

The frontend includes an AI-powered chatbot that:

- Provides medical information about brain tumors
- Answers questions about the detection process
- Offers general health guidance
- Uses OpenAI's API for intelligent responses

## 🎨 Frontend Components

### Key Components

- [`FloatingChatbot`](frontend/components/chatbot/floating-chatbot.tsx): Main chatbot interface
- [`ChatMarkdown`](frontend/components/chatbot/chatmarkdown.tsx): Markdown rendering for chat messages
- [`MessageBubble`](frontend/components/chatbot/message-bubble.tsx): Individual message display
- Navigation components in [`navbar/`](frontend/components/navbar/)
- UI components in [`ui/`](frontend/components/ui/)

### Custom Hooks

- [`caffchatbot-api.ts`](frontend/hooks/caffchatbot-api.ts): Chatbot API integration
- [`auto-scroll.ts`](frontend/hooks/auto-scroll.ts): Auto-scroll functionality
- [`confirmation-modal.ts`](frontend/hooks/confirmation-modal.ts): Modal management

## 🧠 Model Information

The system uses a Convolutional Neural Network (CNN) trained on brain MRI images:

- **Model Type**: CNN (Convolutional Neural Network)
- **Input**: MRI brain scan images
- **Output**: Classification into 4 categories
- **Model File**: [`backend/model/model.h5`](backend/model/model.h5)
- **Training Notebook**: [`BrainTumorDetection_CNN.ipynb`](backend/model/BrainTumorDetection_CNN.ipynb)

### Dataset Structure

```
dataset/
├── glioma/        # Glioma tumor images
├── meningioma/    # Meningioma tumor images
├── pituitary/     # Pituitary tumor images
└── notumor/       # Normal brain images
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

The frontend is optimized for deployment on Vercel:

```bash
npm run build
```

Deploy to Vercel using their CLI or GitHub integration.

### Backend Deployment

The backend can be deployed using Docker:

```bash
docker build -t caffmed-backend .
docker run -p 8000:8000 caffmed-backend
```

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

- Automated testing for both frontend and backend
- Linting and code quality checks
- Conditional workflows based on commit messages

## 🧪 Testing

### Backend Testing

```bash
cd backend
pytest test_be_caffmed.py
```

### Frontend Testing

```bash
cd frontend
npm run lint
```

## 📝 Scripts

### Frontend Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Backend Scripts

- `python server.py`: Start the Flask server
- `pytest`: Run tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This system is for educational and research purposes only. It should not be used as a substitute for professional medical diagnosis. Always consult with qualified healthcare professionals for medical advice.

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in each component
- Review the API documentation above

## 🔮 Future Enhancements

- [ ] Support for more tumor types
- [ ] Batch image processing
- [ ] Model performance analytics
- [ ] User authentication system
- [ ] Medical report generation
- [ ] Integration with DICOM format
- [ ] Multi-language support for the chatbot
