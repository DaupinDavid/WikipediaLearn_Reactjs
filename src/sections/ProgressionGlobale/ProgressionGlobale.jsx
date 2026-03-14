import { Target } from "lucide-react";
import "./ProgressionGlobale.css";

export function ProgressionGlobale({
  pourcentageGlobal,
  scoreDebutant,
  scoreIntermediaire,
  scoreExpert,
}) {
  return (
    <div className="progression-carte">
      <h2 className="progression-titre">
        <Target />
        Votre progression
      </h2>

      <div className="progression-labels">
        <span>Progression globale</span>
        <span>{pourcentageGlobal}%</span>
      </div>

      <div className="progression-piste">
        <div
          className="progression-remplissage"
          style={{ width: `${pourcentageGlobal}%` }}
        />
      </div>

      <div className="progression-scores">
        <div className="score-cellule score-cellule--debutant">
          <div className="score-nombre score-nombre--debutant">
            {scoreDebutant}
          </div>
          <div className="score-label">Débutant</div>
        </div>

        <div className="score-cellule score-cellule--intermediaire">
          <div className="score-nombre score-nombre--intermediaire">
            {scoreIntermediaire}
          </div>
          <div className="score-label">Intermédiaire</div>
        </div>

        <div className="score-cellule score-cellule--expert">
          <div className="score-nombre score-nombre--expert">{scoreExpert}</div>
          <div className="score-label">Expert</div>
        </div>
      </div>
    </div>
  );
}
