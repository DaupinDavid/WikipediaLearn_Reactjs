import { useState } from "react";
import { Accueil } from "./sections/Accueil.jsx";
import { Cours } from "./sections/Cours.jsx";
import { Quiz } from "./sections/Quiz.jsx";
import { Examen } from "./sections/Examen.jsx";
import { ModeSurvie } from "./sections/ModeSurvie.jsx";
import { useStore } from "./store/store.js";

// ================================================================
// COMPOSANT PRINCIPAL
// ================================================================

function App() {
  const [pageActuelle, setPageActuelle] = useState("accueil");
  const [niveauChoisi, setNiveauChoisi] = useState(null);
  const { changerNiveauActuel } = useStore();

  function allerAuCours(niveau) {
    setNiveauChoisi(niveau);
    changerNiveauActuel(niveau);
    setPageActuelle("cours");
  }

  function allerAuQuiz() {
    setPageActuelle("quiz");
  }

  function quizTermine() {
    setPageActuelle("accueil");
    setNiveauChoisi(null);
    changerNiveauActuel(null);
  }

  function allerALExamen() {
    setPageActuelle("examen");
  }

  function examenTermine() {
    setPageActuelle("accueil");
  }

  function allerAuModeSurvie() {
    setPageActuelle("survie");
  }

  function retourAccueil() {
    setPageActuelle("accueil");
    setNiveauChoisi(null);
    changerNiveauActuel(null);
  }

  return (
    <div className="font-sans">
      {pageActuelle === "accueil" && (
        <Accueil
          surSelectNiveau={allerAuCours}
          surDemarrerExamen={allerALExamen}
          surDemarrerSurvie={allerAuModeSurvie}
        />
      )}

      {pageActuelle === "cours" && niveauChoisi && (
        <Cours
          niveau={niveauChoisi}
          surRetour={retourAccueil}
          surDemarrerQuiz={allerAuQuiz}
        />
      )}

      {pageActuelle === "quiz" && niveauChoisi && (
        <Quiz
          niveau={niveauChoisi}
          surTermine={quizTermine}
          surQuitter={retourAccueil}
        />
      )}

      {pageActuelle === "examen" && (
        <Examen surTermine={examenTermine} surQuitter={retourAccueil} />
      )}

      {pageActuelle === "survie" && <ModeSurvie surQuitter={retourAccueil} />}
    </div>
  );
}

export default App;
