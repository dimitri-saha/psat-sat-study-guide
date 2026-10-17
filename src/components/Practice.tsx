import { useState } from 'react'
import type { Question } from '../content/types'
import { useProgress } from '../hooks/useProgress'
import DesmosCalculator from './DesmosCalculator'
import styles from './Practice.module.css'

export default function Practice({ subsectionKey, questions }: { subsectionKey: string; questions: Question[] }) {
  if (questions.length === 0) {
    return <p>No questions available for this subsection yet.</p>
  }

  const { record, correctCount } = useProgress(subsectionKey, questions.map(q => q.id))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [hintsShown, setHintsShown] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)

  const question = questions[index]

  function handleSubmit() {
    const correct = selected.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
    setWasCorrect(correct)
    setSubmitted(true)
    record(question.id, correct)
  }

  function handleNext() {
    setIndex(i => Math.min(i + 1, questions.length - 1))
    setSelected('')
    setHintsShown(0)
    setSubmitted(false)
    setShowWalkthrough(false)
  }

  return (
    <div className={styles.practice}>
      <p className={styles.progress}>{correctCount} / {questions.length} right so far</p>
      {question.passage && <p className={styles.passage}>{question.passage}</p>}
      <div className={styles.questionArea}>
        <div>
          <p className={styles.prompt}>{question.prompt}</p>
          {question.choices ? (
            <div className={styles.choices}>
              {question.choices.map(choice => (
                <button
                  key={choice}
                  className={selected === choice ? styles.selected : ''}
                  onClick={() => setSelected(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <input
              aria-label="Your answer"
              value={selected}
              onChange={e => setSelected(e.target.value)}
            />
          )}
          <div className={styles.actions}>
            <button onClick={() => setHintsShown(h => Math.min(h + 1, question.hints.length))}>
              Get a hint
            </button>
            <button onClick={handleSubmit} disabled={!selected}>Submit</button>
          </div>
          {hintsShown > 0 && (
            <ul className={styles.hints}>
              {question.hints.slice(0, hintsShown).map(hint => <li key={hint}>{hint}</li>)}
            </ul>
          )}
          {submitted && (
            <p className={wasCorrect ? styles.correct : styles.incorrect}>
              {wasCorrect ? 'Correct!' : `Not quite. The correct answer is ${question.correctAnswer}.`}
            </p>
          )}
          {submitted && (
            <button onClick={() => setShowWalkthrough(true)}>Show walkthrough</button>
          )}
          {showWalkthrough && (
            <ol className={styles.walkthrough}>
              {question.walkthrough.map(step => <li key={step}>{step}</li>)}
            </ol>
          )}
          {submitted && index < questions.length - 1 && (
            <button onClick={handleNext}>Next question</button>
          )}
        </div>
        {question.desmosConfig && <DesmosCalculator config={question.desmosConfig} />}
      </div>
    </div>
  )
}
