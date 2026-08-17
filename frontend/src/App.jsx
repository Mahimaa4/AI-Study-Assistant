import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  const requestId = useRef(0);

  async function generateQuiz() {
    if (!topic.trim()) return;
    const currentRequest = ++requestId.current;

    setLoading(true);
    setError("");
    setQuiz(null);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setWrongQuestions([]);
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);


    try {
      const response = await fetch("http://127.0.0.1:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (currentRequest !== requestId.current) {
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      setQuiz(data);
   } catch (err) {
      if (currentRequest !== requestId.current) {
        return;
      }

      if (err.name === "AbortError") {
        setError(
          "The request took too long. Please try generating the quiz again."
        );
      } else if (err.message === "Failed to fetch") {
        setError(
          "Unable to connect to the server. Please try again."
        );
      } else {
        setError(err.message || "Something went wrong.");
      }
}finally {
  clearTimeout(timeoutId);

  if (currentRequest === requestId.current) {
    setLoading(false);
  }
}
  }

  function submitAnswer() {
    if (selectedAnswer === null) return;

    const question = quiz.questions[currentQuestion];

    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
    else {
    setWrongQuestions((previous) => [
      ...previous,
      question
    ]);
  }

    setAnswered(true);
  }

  function nextQuestion() {
    setSelectedAnswer(null);
    setAnswered(false);
    setCurrentQuestion(currentQuestion + 1);
  }

  function retryWrongAnswers() {
  if (wrongQuestions.length === 0) {
    return;
  }

  setQuiz({
    title: "Retry Wrong Answers",
    questions: wrongQuestions
  });

  setCurrentQuestion(0);
  setScore(0);
  setSelectedAnswer(null);
  setAnswered(false);
  setWrongQuestions([]);
}

  const quizFinished =
    quiz && currentQuestion >= quiz.questions.length;

  return (
        <div className="app">
          <header>
      <div className="logo">
        <div className="logo-icon">✦</div>
        StudyMate AI
      </div>

      <div className="header-badge">
        AI Powered
      </div>
    </header>

      <main>

          {!quiz && !loading && (
            <div className="hero">
              <h1>
                Learn smarter.<br />
                <span>Test yourself.</span>
              </h1>

              <p>
                Turn your notes or any topic into an AI-generated
                interactive quiz in seconds.
              </p>
            </div>
          )}

          {!quiz && !loading && (
            <div className="input-card">

              <label className="input-label">
                What do you want to study?
              </label>

              <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  maxLength={5000}
                  placeholder={`Enter a topic or paste your notes here...

                Example:
                Python OOP

                or paste your class notes, study material, or a paragraph.`}
                />

              <button
                onClick={generateQuiz}
                disabled={!topic.trim()}
              >
                Generate Quiz
              </button>

              <div className="features">
                <span>✦ AI Generated</span>
                <span>✓ 5 Questions</span>
                <span>↻ Retry Mistakes</span>
              </div>

              {error && (
                <div className="error">
                  <strong>⚠ Something went wrong</strong>

                  <p>{error}</p>

                  <button onClick={generateQuiz}>
                    Try Again
                  </button>
                </div>
              )}

            </div>
          )}

        {loading && (
          <div className="status-card">
              <div className="loader"></div>

              <h2>Generating your quiz...</h2>

              <p>
                StudyMate AI is preparing your questions.
              </p>
            </div>
        )}

        {quiz && !quizFinished && (
          <div className="quiz-card">

            <div className="progress-row">
              <span>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>

              <span>
                {Math.round(
                  ((currentQuestion + 1) / quiz.questions.length) * 100
                )}%
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                }}
              />
            </div>
            <h2>{quiz.title}</h2>

            <div className="question">
              <h3>
                {quiz.questions[currentQuestion].question}
              </h3>

              {quiz.questions[currentQuestion].options.map(
                (option, index) => (
                  <button
                    className={`option ${
                      selectedAnswer === index ? "selected" : ""
                    }`}
                    key={index}
                    onClick={() => !answered && setSelectedAnswer(index)}
                  >
                    {option}
                  </button>
                )
              )}

              {!answered && (
                <button
                  className="submit-button"
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </button>
              )}

              {answered && (
                <div className="feedback">
                  <h3>
                    {selectedAnswer ===
                    quiz.questions[currentQuestion].correctAnswer
                      ? "✅ Correct!"
                      : "❌ Incorrect"}
                  </h3>

                  <p>
                    {quiz.questions[currentQuestion].explanation}
                  </p>

                  <button onClick={nextQuestion}>
                    {currentQuestion === quiz.questions.length - 1
                      ? "See Results"
                      : "Next Question"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {quizFinished && (
        <div className="result-card">
          <h2>Quiz Complete 🎉</h2>

          <p>Your final score</p>

          <div className="score">
            {score} / {quiz.questions.length}
          </div>

          <p>
            {Math.round((score / quiz.questions.length) * 100)}% correct
          </p>

          <p>
            {score === quiz.questions.length
              ? "Perfect score! Excellent work."
              : score >= quiz.questions.length / 2
              ? "Good job! Keep practicing."
              : "Keep learning and try again."}
          </p>

            {wrongQuestions.length > 0 && (
              <button onClick={retryWrongAnswers}>
                Retry Wrong Answers ({wrongQuestions.length})
              </button>
            )}

            <button onClick={generateQuiz}>
              Generate New Quiz
            </button>

            <button
              className="secondary-button"
              onClick={() => setQuiz(null)}
            >
              New Topic
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;