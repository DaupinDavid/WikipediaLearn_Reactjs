import { CheckCircle, XCircle } from "lucide-react";
import "./QuizQuestion.css";

function styleReponse(index, reponseChoisie, correctAnswer) {
  if (reponseChoisie === null) return "quiz-reponse--neutre";

  if (index === correctAnswer) return "quiz-reponse--correct";

  if (index === reponseChoisie) return "quiz-reponse--incorrect";

  return "quiz-reponse--grise";
}

export function QuizQuestion({ question, reponseChoisie, onReponse }) {
  return (
    <div className="quiz-question-carte">
      <h2 className="quiz-question-texte">{question.question}</h2>
      <div className="quiz-question-liste">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onReponse(index)}
            disabled={reponseChoisie !== null}
            className={`quiz-reponse-bouton ${styleReponse(index, reponseChoisie, question.correctAnswer)}`}
          >
            <div className="quiz-reponse-ligne">
              <span className="quiz-reponse-lettre">
                {String.fromCharCode(65 + index)}
              </span>

              <span>{option}</span>

              {reponseChoisie === index && index !== question.correctAnswer && (
                <XCircle className="quiz-reponse-icone quiz-reponse-icone--incorrect" />
              )}

              {reponseChoisie === index && index === question.correctAnswer && (
                <CheckCircle className="quiz-reponse-icone quiz-reponse-icone--correct" />
              )}

              {reponseChoisie !== null &&
                reponseChoisie !== index &&
                index === question.correctAnswer && (
                  <CheckCircle className="quiz-reponse-icone quiz-reponse-icone--correct" />
                )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
