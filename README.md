# StudyMate AI

StudyMate AI is an AI-powered study assistant built for the Frontend Internship Assignment. Users can enter a topic or paste study notes, and Gemini generates a structured interactive quiz.

## Features

* Free-form topic/notes input
* AI-generated 5-question quizzes
* Interactive multiple-choice questions
* Instant feedback and explanations
* Score calculation
* Retry wrong answers
* Loading, error, empty and retry states
* 30-second timeout for slow requests
* Protection against stale responses
* Responsive UI for mobile and desktop

## Tech Stack

* **Frontend:** React, Vite, JavaScript, CSS
* **Backend:** Python, Flask, Flask-CORS
* **AI:** Google Gemini API
* **Deployment:** Render

## Architecture

```text
User
  ↓
React Frontend
  ↓
Flask Backend
  ↓
Google Gemini API
  ↓
Structured Quiz Data
  ↓
Interactive React Quiz
```

The Gemini API key is stored securely as a backend environment variable and is never exposed in the frontend.

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Set the environment variable:

```text
GEMINI_API_KEY=your_api_key_here
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Usage

1. Enter a topic or paste study notes.
2. Click **Generate Quiz**.
3. Answer the questions and submit your answers.
4. View explanations and your final score.
5. Retry incorrectly answered questions.

## Error Handling

The application handles empty input, failed API requests, slow requests, and stale responses without crashing. Users receive appropriate loading/error states and can retry failed requests.

## AI Usage

ChatGPT was used during development for implementation guidance, debugging, code review, and deployment troubleshooting. Suggestions were reviewed, adapted, and tested during development.

## Known Limitations

* Quiz quality depends on the AI-generated response.
* Currently generates five questions per quiz.
* No authentication or persistent quiz history.
* The free Render backend may take longer to respond after inactivity.

## Time Spent

Approximately 8 hours.

## Live Demo

[**StudyMate AI**](https://ai-study-assistant-frontend-ggjt.onrender.com/)


