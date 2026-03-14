import { Skull } from "lucide-react";
import "./CarteSurvie.css";

export function CarteSurvie({ surDemarrerSurvie }) {
  return (
    <div className="survie-carte">
      <div className="survie-crane-fond">💀</div>

      <div className="survie-contenu">
        <div className="survie-entete">
          <div className="survie-icone-fond">
            <Skull />
          </div>

          <h2 className="survie-titre">Mode Survie</h2>
          <span className="survie-badge-nouveau">NOUVEAU</span>
        </div>

        <p className="survie-description">
          50 questions mélangées. Une erreur et tout s'arrête. Testez vos
          limites et grimpez dans le classement !
        </p>

        <div className="survie-regles">
          <span>💀 Une vie</span>
          <span>⏱️ 20s / question</span>
          <span>🏆 Classement sauvegardé</span>
        </div>

        <button onClick={surDemarrerSurvie} className="survie-bouton">
          <Skull />
          Entrer en Mode Survie
        </button>
      </div>
    </div>
  );
}
