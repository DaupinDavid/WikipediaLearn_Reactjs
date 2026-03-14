import "./GrilleNiveaux.css";

function statutDuNiveau(id, niveauxTermines, niveauActuel, peutAcceder) {
  // Ordre de priorité des vérifications :
  if (niveauxTermines.includes(id))
    return { texte: "Complété", classe: "niveau-statut-badge--complete" };
  if (niveauActuel === id)
    return { texte: "En cours", classe: "niveau-statut-badge--en-cours" };
  if (peutAcceder(id))
    return { texte: "Disponible", classe: "niveau-statut-badge--disponible" };
  // Valeur par défaut si aucune condition ci-dessus n'est vraie :
  return { texte: "Verrouillé", classe: "niveau-statut-badge--verrouille" };
}

// ================================================================
// COMPOSANT PRINCIPAL
// ================================================================
export function GrilleNiveaux({
  niveaux,
  progression,
  peutAccederNiveau,
  scoreNiveau,
  surSelectNiveau,
}) {
  return (
    <div className="grille-niveaux">
      {niveaux.map((niveau) => {
        const statut = statutDuNiveau(
          niveau.id,
          progression.niveauxTermines,
          progression.niveauActuel,
          peutAccederNiveau,
        );
        const estBloque = !peutAccederNiveau(niveau.id);
        const score = scoreNiveau(niveau.id);

        return (
          <div
            key={niveau.id}
            className={`niveau-carte ${estBloque ? "niveau-carte--bloque" : "niveau-carte--accessible"}`}
            style={{ backgroundColor: niveau.couleurFond }}
            onClick={() => !estBloque && surSelectNiveau(niveau.id)}
          >
            <div className="niveau-statut">
              <span className={`niveau-statut-badge ${statut.classe}`}>
                {statut.texte}
              </span>
            </div>

            <div className="niveau-contenu">
              <div className="niveau-icone">{niveau.icone}</div>

              <h3 className="niveau-nom" style={{ color: niveau.couleur }}>
                {niveau.nom}
              </h3>

              <p className="niveau-description">{niveau.description}</p>

              <div className="niveau-infos">
                <span>
                  {score > 0 ? `${score}/20 questions` : "20 questions"}
                </span>
                <span>45s/question</span>
              </div>

              {score > 0 && (
                <div className="niveau-progression-piste">
                  <div
                    className="niveau-progression-remplissage"
                    style={{ width: `${(score / 20) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {estBloque && (
              <div className="niveau-overlay">
                <div className="niveau-overlay-texte">
                  🔒 Terminez le niveau précédent
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
