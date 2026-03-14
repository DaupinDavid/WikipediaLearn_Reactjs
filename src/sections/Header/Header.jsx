import { BookOpen, Star, Trophy } from "lucide-react";
import "./Header.css";

export function Header({ totalXP, nbBadges }) {
  return (
    <header className="header-barre">
      <div className="header-contenu">
        <div className="header-logo-groupe">
          <div className="header-logo-icone">
            <BookOpen />
          </div>

          <div>
            <h1 className="header-titre">Wikipedia Learn</h1>
            <p className="header-sous-titre">Le Moyen-Âge</p>
          </div>
        </div>

        <div className="header-stats">
          <div className="header-stat-badge">
            <Star />
            <span>{totalXP} XP</span>
          </div>

          <div className="header-stat-badge">
            <Trophy />
            <span>{nbBadges} Badges</span>
          </div>
        </div>
      </div>
    </header>
  );
}
