import { useState, useEffect } from "react";
import { cours } from "../data/courses.js";
import { CoursHeader } from "./CoursHeader/CoursHeader.jsx";
import { CoursSommaire } from "./CoursSommaire/CoursSommaire.jsx";
import { CoursContenu } from "./CoursContenu/CoursContenu.jsx";
import { CoursTermine } from "./CoursTermine/CoursTermine.jsx";
import "./Cours.css";

const NOMS_NIVEAU = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  expert: "Expert",
};

export function Cours({ niveau, surRetour, surDemarrerQuiz }) {
  const contenuDuCours = cours.find((c) => c.level === niveau);
  const [sectionActuelle, setSectionActuelle] = useState(0);
  const [sectionsVues, setSectionsVues] = useState([]);

  if (!contenuDuCours) return null;

  useEffect(() => {
    if (!sectionsVues.includes(sectionActuelle)) {
      setSectionsVues((prev) => [...prev, sectionActuelle]);
    }
  }, [sectionActuelle]);

  const pourcentage =
    (sectionsVues.length / contenuDuCours.sections.length) * 100;
  const toutesVues = sectionsVues.length === contenuDuCours.sections.length;

  return (
    <div className="cours-page">
      <CoursHeader
        niveau={niveau}
        titre={contenuDuCours.title}
        duree={contenuDuCours.estimatedTime}
        pourcentage={pourcentage}
        surRetour={surRetour}
      />

      <main className="cours-main">
        <div className="cours-grille">
          <div className="cours-colonne-sommaire">
            <CoursSommaire
              sections={contenuDuCours.sections}
              sectionActuelle={sectionActuelle}
              sectionsVues={sectionsVues}
              niveau={niveau}
              onSelectSection={setSectionActuelle}
            />
          </div>

          <div className="cours-colonne-contenu">
            <CoursContenu
              section={contenuDuCours.sections[sectionActuelle]}
              indexActuel={sectionActuelle}
              total={contenuDuCours.sections.length}
              surPrecedent={() => setSectionActuelle((s) => s - 1)}
              surSuivant={() => setSectionActuelle((s) => s + 1)}
              surDemarrerQuiz={surDemarrerQuiz}
            />
          </div>
        </div>

        {toutesVues && (
          <CoursTermine
            nomNiveau={NOMS_NIVEAU[niveau]}
            surDemarrerQuiz={surDemarrerQuiz}
          />
        )}
      </main>
    </div>
  );
}
