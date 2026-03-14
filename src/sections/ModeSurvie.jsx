import { useState, useEffect, useCallback } from 'react'
import { questionsDebutant, questionsIntermediaire, questionsExpert } from '../data/questions.js'
import { useStore } from '../store/store.js'
import { SurvieIntro }    from './SurvieIntro/SurvieIntro.jsx'
import { SurvieFin }      from './SurvieFin/SurvieFin.jsx'
import { SurvieQuestion } from './SurvieQuestion/SurvieQuestion.jsx'

const NB_QUESTIONS        = 50
const TEMPS_PAR_QUESTION  = 20
const DUREE_ANIMATION     = 400
const COOLDOWN_MS         = 60_000 * 60
const SCORE_BASE          = 100
const BONUS_VITESSE       = 5

// ================================================================
// FONCTIONS UTILITAIRES
// ================================================================

// Mélange toutes les questions des 3 niveaux, en gardant 50
function melangerQuestions() {
  const toutes = [
    ...questionsDebutant.map(q => ({ ...q, level: 'debutant' })),
    ...questionsIntermediaire.map(q => ({ ...q, level: 'intermediaire' })),
    ...questionsExpert.map(q => ({ ...q, level: 'expert' })),
  ]
  return toutes
    .sort(() => Math.random() - 0.5)
    .slice(0, NB_QUESTIONS)
}

function formaterCooldown(ms) {
  const totalSecondes = Math.ceil(ms / 1000)
  const h = Math.floor(totalSecondes / 3600)
  const m = Math.floor((totalSecondes % 3600) / 60)
  const s = totalSecondes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function chargerClassement() {
  try {
    return JSON.parse(localStorage.getItem('classement-survie') || '[]')
  } catch {
    return []
  }
}

function sauvegarderClassement(entree) {
  const classement = chargerClassement()
  classement.push(entree)
  classement.sort((a, b) => b.score - a.score)
  const top10 = classement.slice(0, 10)
  localStorage.setItem('classement-survie', JSON.stringify(top10))
  return top10.findIndex(e => e === classement[0]) + 1
}

function lireCooldown() {
  const dernierJeu = localStorage.getItem('survie-dernier-jeu')
  if (!dernierJeu) return 0
  const restant = COOLDOWN_MS - (Date.now() - parseInt(dernierJeu, 10))
  return restant > 0 ? restant : 0
}

export function ModeSurvie({ surQuitter }) {
  const { ajouterXP } = useStore()
  const [phase, setPhase] = useState('intro')

  const [questions,       setQuestions]       = useState([])
  const [indexQuestion,   setIndexQuestion]   = useState(0)
  const [reponseChoisie,  setReponseChoisie]  = useState(null)
  const [tempsRestant,    setTempsRestant]    = useState(TEMPS_PAR_QUESTION)
  const [score,           setScore]           = useState(0)
  const [nbBonnes,        setNbBonnes]        = useState(0)
  const [timerActif,      setTimerActif]      = useState(false)
  const [animationActive, setAnimationActive] = useState(false)

  const [estVictoire, setEstVictoire] = useState(false)
  const [rang,        setRang]        = useState(null)
  const [classement,  setClassement]  = useState(chargerClassement)

  const [cooldown,    setCooldown]    = useState(lireCooldown)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown(lireCooldown), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  // ================================================================
  // TIMER DE JEU
  // ================================================================
  const tempsEcoule = useCallback(() => {
    if (reponseChoisie !== null || !timerActif) return
    finDePartie(score, nbBonnes, indexQuestion, false)
  }, [reponseChoisie, timerActif, score, nbBonnes, indexQuestion])

  useEffect(() => {
    if (phase !== 'jeu' || !timerActif || animationActive) return

    const minuterie = setInterval(() => {
      setTempsRestant(prev => {
        if (prev <= 1) {
          clearInterval(minuterie)
          tempsEcoule()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(minuterie)
  }, [phase, timerActif, animationActive, indexQuestion, tempsEcoule])

  // ================================================================
  // DÉMARRER LA PARTIE
  // ================================================================
  function demarrerPartie() {
    const questionsGenerees = melangerQuestions()
    setQuestions(questionsGenerees)
    setIndexQuestion(0)
    setReponseChoisie(null)
    setTempsRestant(TEMPS_PAR_QUESTION)
    setScore(0)
    setNbBonnes(0)
    lancerAnimation()
    setPhase('jeu')
  }

  // ================================================================
  // ANIMATION DE TRANSITION
  // ================================================================
  function lancerAnimation() {
    setAnimationActive(true)
    setTimerActif(false)
    setTimeout(() => {
      setAnimationActive(false)
      setTimerActif(true)
    }, DUREE_ANIMATION)
  }

  // ================================================================
  // CHOISIR UNE RÉPONSE
  // ================================================================
  function choisirReponse(index) {
    if (reponseChoisie !== null || animationActive || !timerActif) return

    setTimerActif(false)
    setReponseChoisie(index)

    const question = questions[indexQuestion]
    const correct  = index === question.correctAnswer

    if (!correct) {
      setTimeout(() => finDePartie(score, nbBonnes, indexQuestion, false), 1200)
      return
    }

    const bonus         = Math.max(0, tempsRestant) * BONUS_VITESSE
    const nouvelScore   = score + SCORE_BASE + bonus
    const nbBonnesNouv  = nbBonnes + 1

    setScore(nouvelScore)
    setNbBonnes(nbBonnesNouv)

    if (indexQuestion >= NB_QUESTIONS - 1) {
      setTimeout(() => finDePartie(nouvelScore, nbBonnesNouv, indexQuestion, true), 1200)
    } else {
      setTimeout(() => {
        setIndexQuestion(i => i + 1) 
        setReponseChoisie(null)
        setTempsRestant(TEMPS_PAR_QUESTION)
        lancerAnimation()
      }, 1200)
    }
  }

  // ================================================================
  // FIN DE LA PARTIE
  // ================================================================
  function finDePartie(scoreTotal, bonnes, derniereQuestion, victoire) {
    setTimerActif(false)
    localStorage.setItem('survie-dernier-jeu', Date.now().toString())

    const rang = sauvegarderClassement({
      nom:             'Joueur',
      score:           scoreTotal,
      questionAtteinte: derniereQuestion + 1,
      bonnesReponses:  bonnes,
      date:            new Date().toLocaleDateString('fr-FR'),
    })
    setClassement(chargerClassement())
    setRang(rang)
    setEstVictoire(victoire)
    setPhase('fin')
    ajouterXP(Math.round(scoreTotal / 10))
    setCooldown(COOLDOWN_MS)
  }

  // ================================================================
  // RENDU
  // ================================================================
  if (phase === 'intro') {
    return (
      <SurvieIntro
        surQuitter={surQuitter}
        surDemarrer={demarrerPartie}
        nbQuestions={NB_QUESTIONS}
        tempsQuestion={TEMPS_PAR_QUESTION}
      />
    )
  }

  if (phase === 'fin') {
    return (
      <SurvieFin
        estVictoire={estVictoire}
        score={score}
        nbBonnes={nbBonnes}
        rang={rang}
        indexQuestion={indexQuestion}
        cooldown={cooldown}
        classement={classement}
        surDemarrer={demarrerPartie}
        surQuitter={surQuitter}
        nbQuestions={NB_QUESTIONS}
        formaterCooldown={formaterCooldown}
      />
    )
  }

  if (questions.length === 0) return null

  return (
    <SurvieQuestion
      question={questions[indexQuestion]}
      reponseChoisie={reponseChoisie}
      animationActive={animationActive}
      timerActif={timerActif}
      tempsRestant={tempsRestant}
      score={score}
      nbBonnes={nbBonnes}
      indexQuestion={indexQuestion}
      nbQuestions={NB_QUESTIONS}
      onChoisirReponse={choisirReponse}
      surQuitter={surQuitter}
      TEMPS_PAR_QUESTION={TEMPS_PAR_QUESTION}
      DUREE_ANIMATION={DUREE_ANIMATION}
    />
  )
}
