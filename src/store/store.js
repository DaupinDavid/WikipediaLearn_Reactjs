import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ----------------------------------------------------------------
// LISTE DES BADGES
// Chaque badge a un id unique, un nom, une description et une icône
// ----------------------------------------------------------------
export const BADGES_DISPONIBLES = {
  NIVEAU_DEBUTANT: {
    id: 'debutant-complete',
    nom: 'Apprenti Historien',
    description: 'Vous avez terminé le niveau Débutant !',
    icone: '🌱'
  },
  NIVEAU_INTERMEDIAIRE: {
    id: 'intermediaire-complete',
    nom: 'Érudit Médiéval',
    description: 'Vous avez terminé le niveau Intermédiaire !',
    icone: '📚'
  },
  NIVEAU_EXPERT: {
    id: 'expert-complete',
    nom: 'Maître du Moyen-Âge',
    description: 'Vous avez terminé le niveau Expert !',
    icone: '👑'
  },
  SCORE_PARFAIT: {
    id: 'score-parfait',
    nom: 'Score Parfait',
    description: 'Vous avez obtenu 20/20 à un quiz !',
    icone: '⭐'
  },
  RAPIDITE: {
    id: 'rapidite',
    nom: 'Éclair',
    description: 'Vous avez terminé un quiz en moins de 10 minutes !',
    icone: '⚡'
  },
  EXAMEN_REUSSI: {
    id: 'examen-reussi',
    nom: 'Diplômé',
    description: "Vous avez réussi l'examen final !",
    icone: '🎓'
  },
  TOUS_NIVEAUX: {
    id: 'tous-niveaux',
    nom: 'Explorateur Complet',
    description: 'Vous avez terminé tous les niveaux !',
    icone: '🏆'
  }
}

// ----------------------------------------------------------------
// PROGRESSION VIDE DE DÉPART
// ----------------------------------------------------------------
const progressionDeDepart = {
  niveauActuel: null,
  niveauxTermines: [],       
  totalXP: 0,
  badges: [],
  resultatsQuiz: {            /
    debutant: [],
    intermediaire: [],
    expert: []
  },
  resultatsExamen: []
}

// ----------------------------------------------------------------
// CRÉATION DU STORE
// ----------------------------------------------------------------
export const useStore = create(
  persist(
    (set, get) => ({
      progression: progressionDeDepart,

      // --------------------------------------------------------
      // AJOUTER DES XP
      // --------------------------------------------------------
      ajouterXP: (montant) => {
        set((etat) => ({
          progression: {
            ...etat.progression,
            totalXP: etat.progression.totalXP + montant
          }
        }))
      },

      // --------------------------------------------------------
      // TERMINER UN NIVEAU
      // --------------------------------------------------------
      terminerNiveau: (niveau) => {
        set((etat) => {
          const niveauxTermines = [...etat.progression.niveauxTermines]

          if (!niveauxTermines.includes(niveau)) {
            niveauxTermines.push(niveau)
          }

          const tousTermines = ['debutant', 'intermediaire', 'expert']
            .every(n => niveauxTermines.includes(n))

          const badges = [...etat.progression.badges]

          if (niveau === 'debutant' && !badges.find(b => b.id === BADGES_DISPONIBLES.NIVEAU_DEBUTANT.id)) {
            badges.push({ ...BADGES_DISPONIBLES.NIVEAU_DEBUTANT, debloqueA: new Date() })
          }
          if (niveau === 'intermediaire' && !badges.find(b => b.id === BADGES_DISPONIBLES.NIVEAU_INTERMEDIAIRE.id)) {
            badges.push({ ...BADGES_DISPONIBLES.NIVEAU_INTERMEDIAIRE, debloqueA: new Date() })
          }
          if (niveau === 'expert' && !badges.find(b => b.id === BADGES_DISPONIBLES.NIVEAU_EXPERT.id)) {
            badges.push({ ...BADGES_DISPONIBLES.NIVEAU_EXPERT, debloqueA: new Date() })
          }

          if (tousTermines && !badges.find(b => b.id === BADGES_DISPONIBLES.TOUS_NIVEAUX.id)) {
            badges.push({ ...BADGES_DISPONIBLES.TOUS_NIVEAUX, debloqueA: new Date() })
          }

          return {
            progression: {
              ...etat.progression,
              niveauxTermines,
              badges
            }
          }
        })
      },

      // --------------------------------------------------------
      // AJOUTER UN BADGE MANUELLEMENT
      // --------------------------------------------------------
      ajouterBadge: (badge) => {
        set((etat) => {
          if (etat.progression.badges.find(b => b.id === badge.id)) return etat
          return {
            progression: {
              ...etat.progression,
              badges: [...etat.progression.badges, badge]
            }
          }
        })
      },

      // --------------------------------------------------------
      // SAUVEGARDER LES RÉSULTATS D'UN QUIZ
      // --------------------------------------------------------
      sauvegarderResultatsQuiz: (niveau, resultats) => {
        set((etat) => {
          const nbBonnes = resultats.filter(r => r.correct).length
          const tempsTotal = resultats.reduce((total, r) => total + r.tempsPasse, 0)
          const badges = [...etat.progression.badges]

          // Badge score parfait (20/20)
          if (nbBonnes === 20 && !badges.find(b => b.id === BADGES_DISPONIBLES.SCORE_PARFAIT.id)) {
            badges.push({ ...BADGES_DISPONIBLES.SCORE_PARFAIT, debloqueA: new Date() })
          }

          // Badge rapidité (quiz terminé en moins de 10 minutes)
          if (tempsTotal < 600 && !badges.find(b => b.id === BADGES_DISPONIBLES.RAPIDITE.id)) {
            badges.push({ ...BADGES_DISPONIBLES.RAPIDITE, debloqueA: new Date() })
          }

          return {
            progression: {
              ...etat.progression,
              resultatsQuiz: {
                ...etat.progression.resultatsQuiz,
                [niveau]: resultats 
              },
              badges
            }
          }
        })
      },

      // --------------------------------------------------------
      // SAUVEGARDER LES RÉSULTATS D'UNE SÉRIE D'EXAMEN
      // --------------------------------------------------------
      sauvegarderResultatsExamen: (resultat) => {
        set((etat) => {
          const resultatsExamen = [...etat.progression.resultatsExamen, resultat]
          const badges = [...etat.progression.badges]

          if (resultatsExamen.length >= 3 && !badges.find(b => b.id === BADGES_DISPONIBLES.EXAMEN_REUSSI.id)) {
            badges.push({ ...BADGES_DISPONIBLES.EXAMEN_REUSSI, debloqueA: new Date() })
          }

          return {
            progression: {
              ...etat.progression,
              resultatsExamen,
              badges
            }
          }
        })
      },

      // --------------------------------------------------------
      // CHANGER LE NIVEAU ACTUEL
      // --------------------------------------------------------
      changerNiveauActuel: (niveau) => {
        set((etat) => ({
          progression: { ...etat.progression, niveauActuel: niveau }
        }))
      },

      // --------------------------------------------------------
      // REMETTRE À ZÉRO
      // --------------------------------------------------------
      reinitialiser: () => {
        set({ progression: progressionDeDepart })
      },

      // --------------------------------------------------------
      // PEUT ACCÉDER À UN NIVEAU ? (lecture seule)
      // Débutant → toujours accessible
      // Intermédiaire → seulement si Débutant est terminé
      // Expert → seulement si Intermédiaire est terminé
      // --------------------------------------------------------
      peutAccederNiveau: (niveau) => {
        const { niveauxTermines } = get().progression
        if (niveau === 'debutant')      return true
        if (niveau === 'intermediaire') return niveauxTermines.includes('debutant')
        if (niveau === 'expert')        return niveauxTermines.includes('intermediaire')
        return false
      },

      // --------------------------------------------------------
      // SCORE D'UN NIVEAU (lecture seule)
      // --------------------------------------------------------
      scoreNiveau: (niveau) => {
        const resultats = get().progression.resultatsQuiz[niveau]
        if (!resultats || resultats.length === 0) return 0
        return resultats.filter(r => r.correct).length
      }

    }),
    {
      name: 'wikipedia-learn-sauvegarde',
      partialize: (etat) => ({ progression: etat.progression })
    }
  )
)
