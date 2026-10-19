import { useEffect, useState } from 'react'
import type { DesmosConfig, Question } from '../content/types'
import { useProgress } from '../hooks/useProgress'
import { isAnswerCorrect } from '../lib/answers'
import DesmosCalculator from './DesmosCalculator'
import ProgressBar from './ProgressBar'
import styles from './Practice.module.css'

const CHOICE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

interface PracticeProps {
  subsectionKey: string
  questions: Question[]
  /** Produces a fresh question; when present, practice never runs out. */
  generate?: () => Question
  /** Shows a blank Desmos calculator beside every question (math sections). */
  showCalculator?: boolean
}

export default function Practice({ subsectionKey, questions, generate, showCalculator = false }: PracticeProps) {
  const { record, correctCount } = useProgress(subsectionKey, questions.map(q => q.id))
  const [queue, setQueue] = useState<Question[]>(() => (questions.length === 0 && generate ? [generate()] : questions))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [hintsShown, setHintsShown] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const [desmosReveal, setDesmosReveal] = useState<DesmosConfig | undefined>(undefined)
  const [marked, setMarked] = useState<Set<string>>(() => new Set())
  const [calculatorOpen, setCalculatorOpen] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [timerHidden, setTimerHidden] = useState(false)
  const [session, setSession] = useState({ answered: 0, correct: 0 })

  useEffect(() => {
    if (submitted) return
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [submitted, index])

  if (queue.length === 0) {
    return <p>No questions available for this subsection yet.</p>
  }

  const question = queue[index]
  const isGenerated = !questions.includes(question)
  const hasNext = index < queue.length - 1 || Boolean(generate)
  const isMarked = marked.has(question.id)

  function handleSubmit() {
    // Submit is disabled while selected === null, so selected is guaranteed
    // to be a string (possibly empty) by the time this runs.
    const correct = selected !== null && (question.choices
      ? selected === question.correctAnswer
      : isAnswerCorrect(selected, question.correctAnswer))
    setWasCorrect(correct)
    setSubmitted(true)
    setSession(s => ({ answered: s.answered + 1, correct: s.correct + (correct ? 1 : 0) }))
    // Generated questions are one-offs, so only the fixed question set is saved as progress.
    if (!isGenerated) record(question.id, correct)
  }

  function handleNext() {
    if (index === queue.length - 1 && generate) setQueue(q => [...q, generate()])
    setIndex(i => i + 1)
    setSelected(null)
    setHintsShown(0)
    setSubmitted(false)
    setShowWalkthrough(false)
    setDesmosReveal(undefined)
    setSeconds(0)
  }

  function toggleMarked() {
    setMarked(prev => {
      const next = new Set(prev)
      if (next.has(question.id)) next.delete(question.id)
      else next.add(question.id)
      return next
    })
  }

  const questionColumn = (
    <div className={styles.questionColumn}>
      <div className={styles.questionBar}>
        <span className={styles.questionNumber}>{index + 1}</span>
        <button
          type="button"
          className={isMarked ? styles.markActive : styles.mark}
          onClick={toggleMarked}
          aria-pressed={isMarked}
        >
          <span aria-hidden="true">{isMarked ? '★' : '☆'}</span> Mark for review
        </button>
        <span className={styles[question.difficulty]}>{question.difficulty}</span>
      </div>

      {question.passage && <p className={styles.passage}>{question.passage}</p>}

      <p className={styles.prompt}>{question.prompt}</p>

      {question.choices ? (
        <div className={styles.choices}>
          {question.choices.map((choice, i) => {
            const isSelected = selected === choice
            const isCorrectChoice = choice === question.correctAnswer
            return (
              <button
                key={choice}
                type="button"
                className={[
                  styles.choice,
                  isSelected ? styles.selected : '',
                  submitted && isCorrectChoice ? styles.choiceCorrect : '',
                  submitted && isSelected && !isCorrectChoice ? styles.choiceIncorrect : '',
                ].filter(Boolean).join(' ')}
                onClick={() => !submitted && setSelected(choice)}
                disabled={submitted}
              >
                <span className={styles.bubble} aria-hidden="true">{CHOICE_LETTERS[i] ?? i + 1}</span>
                <span className={styles.choiceText}>{choice === '' ? '(no punctuation)' : choice}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <input
          className={styles.gridInput}
          aria-label="Your answer"
          placeholder="Type your answer"
          value={selected ?? ''}
          onChange={e => setSelected(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && selected !== null && !submitted && handleSubmit()}
          disabled={submitted}
        />
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.hintButton}
          onClick={() => setHintsShown(h => Math.min(h + 1, question.hints.length))}
          disabled={hintsShown >= question.hints.length}
        >
          Get a hint
        </button>
        <button type="button" className={styles.submitButton} onClick={handleSubmit} disabled={selected === null || submitted}>
          Submit
        </button>
      </div>

      {hintsShown > 0 && (
        <ul className={styles.hints}>
          {question.hints.slice(0, hintsShown).map(hint => <li key={hint}>{hint}</li>)}
        </ul>
      )}

      {submitted && (
        <p className={wasCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}>
          {wasCorrect ? 'Correct!' : `Not quite. The correct answer is ${question.correctAnswer}.`}
        </p>
      )}

      {submitted && (
        <div className={styles.afterActions}>
          <button type="button" className={styles.walkthroughButton} onClick={() => setShowWalkthrough(true)}>
            Show walkthrough
          </button>
          {showCalculator && question.desmosConfig && (
            <button
              type="button"
              className={styles.walkthroughButton}
              onClick={() => {
                setCalculatorOpen(true)
                setDesmosReveal(question.desmosConfig)
              }}
            >
              Show the Desmos solution
            </button>
          )}
        </div>
      )}

      {showWalkthrough && (
        <ol className={styles.walkthrough}>
          {question.walkthrough.map(step => <li key={step}>{step}</li>)}
        </ol>
      )}

      {submitted && hasNext && (
        <button type="button" className={styles.nextButton} onClick={handleNext}>
          Next question →
        </button>
      )}
    </div>
  )

  return (
    <div className={showCalculator ? `${styles.practice} ${styles.wide}` : styles.practice}>
      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.questionCount}>
            {generate ? `Question ${index + 1}` : `Question ${index + 1} of ${queue.length}`}
          </span>
          {generate && <span className={styles.unlimited}>Unlimited practice</span>}
          {marked.size > 0 && <span className={styles.markedCount}>★ {marked.size} marked</span>}
        </div>
        <div className={styles.headRight}>
          <span className={styles.timer} aria-label="Time on this question">
            {timerHidden ? '—:——' : formatTime(seconds)}
          </span>
          <button type="button" className={styles.smallButton} onClick={() => setTimerHidden(h => !h)}>
            {timerHidden ? 'Show' : 'Hide'}
          </button>
          {showCalculator && (
            <button type="button" className={styles.smallButton} onClick={() => setCalculatorOpen(o => !o)}>
              {calculatorOpen ? 'Hide calculator' : 'Calculator'}
            </button>
          )}
        </div>
      </div>

      <div className={styles.progressRow}>
        {questions.length > 0 && <ProgressBar correct={correctCount} total={questions.length} suffix="core questions right" />}
        {session.answered > 0 && (
          <span className={styles.sessionStat}>This session: {session.correct}/{session.answered}</span>
        )}
      </div>

      {showCalculator ? (
        <div className={calculatorOpen ? styles.split : styles.splitClosed}>
          {calculatorOpen && (
            <div className={styles.desmosPane}>
              {/* Keyed by question so every question starts with a blank calculator. */}
              <DesmosCalculator key={question.id} config={desmosReveal} tall />
              <p className={styles.desmosNote}>Type the equations yourself. The calculator clears for each new question.</p>
            </div>
          )}
          {questionColumn}
        </div>
      ) : (
        questionColumn
      )}
    </div>
  )
}
