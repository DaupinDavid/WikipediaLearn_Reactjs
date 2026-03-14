import './ModalesAccueil.css'

export function ModalesAccueil({ confirmerReinit, badgeEnDetail, onAnnulerReinit, onConfirmerReinit, onFermerBadge }) {
  return (
    <>
      {confirmerReinit && (
        <div className="modale-fond">
          <div className="modale-fenetre modale-fenetre--reinit">
            <h3 className="modale-reinit-titre">Réinitialiser ?</h3>
            <p className="modale-reinit-texte">
              Êtes-vous sûr de vouloir effacer toute votre progression ?
              Cette action est irréversible.
            </p>

            <div className="modale-boutons">
              <button onClick={onAnnulerReinit} className="modale-bouton-annuler">
                Annuler
              </button>
              <button onClick={onConfirmerReinit} className="modale-bouton-confirmer">
                Oui, réinitialiser
              </button>
            </div>

          </div>
        </div>
      )}

      {badgeEnDetail && (
        <div className="modale-fond" onClick={onFermerBadge}>
          <div
            className="modale-fenetre modale-fenetre--badge"
            onClick={e => e.stopPropagation()}
          >

            <div className="modale-badge-centre">
              <span className="modale-badge-icone">{badgeEnDetail.icone}</span>
              <h3 className="modale-badge-nom">{badgeEnDetail.nom}</h3>
              <p className="modale-badge-description">{badgeEnDetail.description}</p>
            </div>

            <p className="modale-badge-date">
              Débloqué le {new Date(badgeEnDetail.debloqueA).toLocaleDateString('fr-FR')}

            </p>

            <button onClick={onFermerBadge} className="modale-bouton-fermer">
              Fermer
            </button>

          </div>
        </div>
      )}

    </>
  )
}
