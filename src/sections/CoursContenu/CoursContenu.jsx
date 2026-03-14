import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import "./CoursContenu.css";

export function CoursContenu({
  section,
  indexActuel,
  total,
  surPrecedent,
  surSuivant,
  surDemarrerQuiz,
}) {
  const estPremiere = indexActuel === 0;
  const estDerniere = indexActuel === total - 1;

  return (
    <div className="contenu-carte">
      <div className="contenu-corps">
        <div className="contenu-compteur">
          Section {indexActuel + 1} sur {total}
        </div>

        <h2 className="contenu-titre">{section.title}</h2>

        <div>
          {section.content.split("\n\n").map((paragraphe, idx) => (
            <p key={idx} className="contenu-paragraphe">
              {paragraphe}
            </p>
          ))}
        </div>

        <div className="contenu-nav">
          <button
            onClick={surPrecedent}
            disabled={estPremiere}
            className="contenu-bouton-nav"
          >
            <ChevronLeft />
            Précédent
          </button>

          {estDerniere ? (
            <button onClick={surDemarrerQuiz} className="contenu-bouton-quiz">
              <Play />
              Commencer le quiz
            </button>
          ) : (
            <button onClick={surSuivant} className="contenu-bouton-nav">
              Suivant
              <ChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
