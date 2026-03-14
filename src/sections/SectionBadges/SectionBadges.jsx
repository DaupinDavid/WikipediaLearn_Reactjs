import { Trophy } from "lucide-react";
import "./SectionBadges.css";

export function SectionBadges({ badges, onBadgeClick }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="badges-carte">
      <h2 className="badges-titre">
        <Trophy />
        Vos badges ({badges.length})
      </h2>

      <div className="badges-liste">
        {badges.map((badge) => (
          <button
            key={badge.id}
            onClick={() => onBadgeClick(badge)}
            className="badge-bouton"
          >
            <span className="badge-icone">{badge.icone}</span>
            <span className="badge-nom">{badge.nom}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
