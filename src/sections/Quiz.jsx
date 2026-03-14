import { useState, useEffect, useCallback } from "react";
import {
  questionsDebutant,
  questionsIntermediaire,
  questionsExpert,
} from "../data/questions.js";
import { useStore, BADGES_DISPONIBLES } from "../store/store.js";
import { Star } from "lucide-react";

import { QuizResultats } from "./QuizResultats/QuizResultats.jsx";
import { QuizTimer } from "./QuizTimer/QuizTimer.jsx";
import { QuizQuestion } from "./QuizQuestion/QuizQuestion.jsx";
import { QuizExplication } from "./QuizExplication/QuizExplication.jsx";

import "./Quiz.css";

const TEMPS_PAR_QUESTION = 45;

const NOMS_NIVEAU = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  expert: "Expert",
};

export function Quiz({ niveau, surTermine, surQuitter }) {
  const questions = {
    debutant: questionsDebutant,
    intermediaire: questionsIntermediaire,
    expert: questionsExpert,
  }[niveau];

  const { ajouterXP, terminerNiveau, sauvegarderResultatsQuiz } = useStore();

  const [questionActuelle, setQuestionActuelle] = useState(0);

  const [reponseChoisie, setReponseChoisie] = useState(null);

  const [resultats, setResultats] = useState([]);

  const [tempsRestant, setTempsRestant] = useState(TEMPS_PAR_QUESTION);

  const [montrerExplication, setMontrerExplication] = useState(false);

  const [quizTermine, setQuizTermine] = useState(false);

  const [nouveauBadge, setNouveauBadge] = useState(null);

  const question = questions[questionActuelle];

  const tempsEcoule = useCallback(() => {
    if (reponseChoisie === null) {
      setResultats((prev) => [
        ...prev,
        {
          idQuestion: question.id,
          reponseChoisie: -1,
          correct: false,
          tempsPasse: TEMPS_PAR_QUESTION,
        },
      ]);
      setMontrerExplication(true);
    }
  }, [question, reponseChoisie]);

  useEffect(() => {
    if (montrerExplication || quizTermine) return;

    const minuterie = setInterval(() => {
      setTempsRestant((prev) => {
        if (prev <= 1) {
          tempsEcoule();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(minuterie);
  }, [questionActuelle, montrerExplication, quizTermine, tempsEcoule]);

  function choisirReponse(index) {
    if (reponseChoisie !== null || montrerExplication) return;

    setReponseChoisie(index);

    setResultats((prev) => [
      ...prev,
      {
        idQuestion: question.id,
        reponseChoisie: index,
        correct: index === question.correctAnswer,
        tempsPasse: TEMPS_PAR_QUESTION - tempsRestant,
      },
    ]);

    setMontrerExplication(true);
  }

  function questionSuivante() {
    if (questionActuelle < questions.length - 1) {
      setQuestionActuelle(questionActuelle + 1);
      setReponseChoisie(null);
      setMontrerExplication(false);
      setTempsRestant(TEMPS_PAR_QUESTION);
    } else {
      terminerLeQuiz();
    }
  }

  function terminerLeQuiz() {
    const nbBonnes = [...resultats].filter((r) => r.correct).length;
    const tempsTotal = [...resultats].reduce((t, r) => t + r.tempsPasse, 0);
    const xpGagne = nbBonnes * 10 + (nbBonnes === 20 ? 100 : 0);

    ajouterXP(xpGagne);
    sauvegarderResultatsQuiz(niveau, resultats);

    if (nbBonnes >= 12) terminerNiveau(niveau);

    if (nbBonnes === 20) setNouveauBadge(BADGES_DISPONIBLES.SCORE_PARFAIT.nom);
    else if (tempsTotal < 600) setNouveauBadge(BADGES_DISPONIBLES.RAPIDITE.nom);

    setQuizTermine(true);
  }

  if (quizTermine) {
    return (
      <QuizResultats
        resultats={resultats}
        questions={questions}
        niveau={niveau}
        nouveauBadge={nouveauBadge}
        surTermine={surTermine}
      />
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-contenu">
        <div className="quiz-entete">
          <button onClick={surQuitter} className="quiz-bouton-quitter">
            Quitter
          </button>
          <div className="quiz-entete-niveau">
            <Star className="quiz-entete-icone" />
            <span>{NOMS_NIVEAU[niveau]}</span>
          </div>
          <div className="quiz-entete-espace" />
        </div>

        <div className="quiz-progression">
          <div className="quiz-progression-labels">
            <span>
              Question {questionActuelle + 1} sur {questions.length}
            </span>
            <span>
              {Math.round(((questionActuelle + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="quiz-progression-piste">
            <div
              className="quiz-progression-remplissage"
              style={{
                width: `${((questionActuelle + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <QuizTimer tempsRestant={tempsRestant} />

        <QuizQuestion
          question={question}
          reponseChoisie={reponseChoisie}
          onReponse={choisirReponse}
        />

        {montrerExplication && (
          <QuizExplication
            question={question}
            reponseChoisie={reponseChoisie}
            estDerniere={questionActuelle >= questions.length - 1}
            onSuivant={questionSuivante}
          />
        )}
      </div>
    </div>
  );
}
