import os
import json

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from jsonschema import validate, ValidationError

load_dotenv()

app = Flask(__name__)
CORS(app)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
QUIZ_SCHEMA = {
    "type": "object",
    "required": ["title", "questions"],
    "properties": {
        "title": {
            "type": "string",
            "minLength": 1
        },
        "questions": {
            "type": "array",
            "minItems": 5,
            "maxItems": 5,
            "items": {
                "type": "object",
                "required": [
                    "question",
                    "options",
                    "correctAnswer",
                    "explanation"
                ],
                "properties": {
                    "question": {
                        "type": "string",
                        "minLength": 1
                    },
                    "options": {
                        "type": "array",
                        "minItems": 4,
                        "maxItems": 4,
                        "items": {
                            "type": "string"
                        }
                    },
                    "correctAnswer": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 3
                    },
                    "explanation": {
                        "type": "string"
                    }
                }
            }
        }
    }
}


@app.route("/api/generate", methods=["POST"])
def generate_quiz():

    data = request.get_json(silent=True) or {}

    topic = data.get("topic", "").strip()
    if not topic:
        return jsonify({
            "error": "Topic is required"
        }), 400
    if len(topic) > 5000:
        return jsonify({
            "error": "Please keep your input within 5000 characters."
        }), 400

    prompt = f"""
You are a quiz generator.

Create a quiz based on the following topic:

{topic}

Return ONLY valid JSON.

Use exactly this structure:

{{
  "title": "Quiz title",
  "questions": [
    {{
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "explanation": "Short explanation"
    }}
  ]
}}

Rules:
- Generate exactly 5 questions.
- Each question must have exactly 4 options.
- correctAnswer must be a number from 0 to 3.
- Do not include markdown.
- Do not include any text outside the JSON.
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text.strip()

        quiz = json.loads(text)
        validate(instance=quiz, schema=QUIZ_SCHEMA)
        return jsonify(quiz)

    except json.JSONDecodeError:

        return jsonify({
            "error": "AI returned invalid JSON. Please try again."
        }), 502

    except ValidationError:

        return jsonify({
            "error": "AI returned an unexpected quiz format. Please try again."
        }), 502

    except Exception as e:

        print("AI Error:", e)

        return jsonify({
            "error": "Failed to generate quiz. Please try again."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)