# StudyMate AI

StudyMate AI is an AI-powered study assistant built for the Frontend Internship Assignment.

It allows users to enter a topic or paste study notes, sends the input to a real LLM, and converts the structured AI response into an interactive quiz.

The application is not a chatbot. Instead, the AI generates structured quiz data which is parsed and rendered as interactive React components.

---

## Features

- Free-form text input for topics or study notes
- AI-generated quizzes using Google Gemini
- Five questions generated per quiz
- Interactive multiple-choice questions
- Answer selection and submission
- Immediate correct/incorrect feedback
- Explanations for answers
- Automatic score calculation
- Retry only incorrectly answered questions
- Generate a new quiz
- Loading state while the AI response is being generated
- Error and retry states for failed requests
- Timeout handling for slow requests
- Protection against stale responses
- Responsive interface for desktop and mobile

---

## How It Works

The application uses a separate React frontend and Flask backend.

```text
                    User
                     |
                     v
              React Frontend
                (Render)
                     |
                     | POST /api/generate
                     v
               Flask Backend
                 (Render)
                     |
                     v
                Gemini API
                     |
                     | Structured JSON
                     v
               Flask Backend
                     |
                     v
              React Frontend
                     |
                     v
             Interactive Quiz

---

## Live Demo

https://ai-study-assistant-frontend-ggjt.onrender.com/

## GitHub Repository

https://github.com/Mahimaa4/AI-Study-Assistant
