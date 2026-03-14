import { Timer } from "lucide-react";
import "./QuizTimer.css";

export function QuizTimer({ tempsRestant }) {
  const urgent = tempsRestant <= 10;

  return (
    <div
      className={`quiz-timer-carte ${urgent ? "quiz-timer-carte--urgent" : ""}`}
    >
      <div className="quiz-timer-centre">
        <Timer
          className={`quiz-timer-icone ${urgent ? "quiz-timer-icone--urgent" : "quiz-timer-icone--normal"}`}
        />

        <span
          className={`quiz-timer-valeur ${urgent ? "quiz-timer-valeur--urgent" : "quiz-timer-valeur--normal"}`}
        >
          {tempsRestant}s
        </span>
      </div>
    </div>
  );
}
