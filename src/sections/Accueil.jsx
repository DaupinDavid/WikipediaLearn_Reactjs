import { useState } from "react";
import { useStore } from "../store/store.js";
import { NIVEAUX } from "../types/index.js";
import { RotateCcw } from "lucide-react";
import { Header } from "./Header/Header.jsx";
import { ProgressionGlobale } from "./ProgressionGlobale/ProgressionGlobale.jsx";
import { GrilleNiveaux } from "./GrilleNiveaux/GrilleNiveaux.jsx";
import { CarteSurvie } from "./CarteSurvie/CarteSurvie.jsx";
import { CarteExamen } from "./CarteExamen/CarteExamen.jsx";
import { SectionBadges } from "./SectionBadges/SectionBadges.jsx";
import { ModalesAccueil } from "./ModalesAccueil/ModalesAccueil.jsx";
import "./Accueil.css";

export function Accueil({
  surSelectNiveau,
  surDemarrerExamen,
  surDemarrerSurvie,
}) {
  const { progression, peutAccederNiveau, scoreNiveau, reinitialiser } =
    useStore();
  const [confirmerReinit, setConfirmerReinit] = useState(false);
  const [badgeEnDetail, setBadgeEnDetail] = useState(null);
  const examenDebloque = progression.niveauxTermines.length === 3;
  const pourcentageGlobal = Math.round(
    (progression.niveauxTermines.length / 3) * 100,
  );

  return (
    <div className="accueil-page">
      <Header
        totalXP={progression.totalXP}
        nbBadges={progression.badges.length}
      />

      <main className="accueil-main">
        <ProgressionGlobale
          pourcentageGlobal={pourcentageGlobal}
          scoreDebutant={scoreNiveau("debutant")}
          scoreIntermediaire={scoreNiveau("intermediaire")}
          scoreExpert={scoreNiveau("expert")}
        />

        <GrilleNiveaux
          niveaux={NIVEAUX}
          progression={progression}
          peutAccederNiveau={peutAccederNiveau}
          scoreNiveau={scoreNiveau}
          surSelectNiveau={surSelectNiveau}
        />

        <CarteSurvie surDemarrerSurvie={surDemarrerSurvie} />

        <CarteExamen
          examenDebloque={examenDebloque}
          surDemarrerExamen={surDemarrerExamen}
        />

        <SectionBadges
          badges={progression.badges}
          onBadgeClick={setBadgeEnDetail}
        />

        <div className="accueil-reinit-zone">
          <button
            onClick={() => setConfirmerReinit(true)}
            className="accueil-reinit-bouton"
          >
            <RotateCcw className="accueil-reinit-icone" />
            Réinitialiser ma progression
          </button>
        </div>
      </main>

      <ModalesAccueil
        confirmerReinit={confirmerReinit}
        badgeEnDetail={badgeEnDetail}
        onAnnulerReinit={() => setConfirmerReinit(false)}
        onConfirmerReinit={() => {
          reinitialiser();
          setConfirmerReinit(false);
        }}
        onFermerBadge={() => setBadgeEnDetail(null)}
      />
    </div>
  );
}
