import { useState } from 'react'
import type { Question } from '../content/types'
import { useProgress } from '../hooks/useProgress'
import DesmosCalculator from './DesmosCalculator'
import ProgressBar from './ProgressBar'
import styles from './Practice.module.css'

const CHOICE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function Practice({ subsectionKey, questions }: { subsectionKey: string; questions: Question[] }) {
  const { record, correctCount } = useProgress(subsectionKey, questions.map(q => q.id))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [hintsShown, setHintsShown] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)

  if (questions.length === 0) {
    return <p>No questions available for this subsection yet.</p>
  }

  const question = questions[index]

  function handleSubmit() {
    // Submit is disabled while selected === null, so selected is guaranteed
    // to be a string (possibly empty) by the time this runs.
    const correct = selected !== null && selected.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
    setWasCorrect(correct)
    setSubmitted(true)
    record(question.id, correct)
  }

  function handleNext() {
    setIndex(i => Math.min(i + 1, questions.length - 1))
    setSelected(null)
    setHintsShown(0)
    setSubmitted(false)
    setShowWalkthrough(false)
  }

  return (
    <div className={styles.practice}>
      <div className={styles.head}>
        <span className={styles.questionCount}>Question {index + 1} of {questions.length}</span>
        <ProgressBar correct={correctCount} total={questions.length} suffix="right so far" />
      </div>

      {question.passage && <p className={styles.passage}>{question.passage}</p>}

      <div className={styles.questionArea}>
        <div className={styles.questionColumn}>
          <p className={styles.prompt}>{question.prompt}</p>

          {question.choices ? (
            <div className={styles.choices}>
              {question.choices.map((choice, i) => {
                const isSelected = selected === choice
                const showResult = submitted
                const isCorrectChoice = choice === question.correctAnswer
                return (
                  <button
                    key={choice}
                    type="button"
                    className={[
                      styles.choice,
                      isSelected ? styles.selected : '',
                      showResult && isCorrectChoice ? styles.choiceCorrect : '',
                      showResult && isSelected && !isCorrectChoice ? styles.choiceIncorrect : '',
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
              value={selected ?? ''}
              onChange={e => setSelected(e.target.value)}
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
            <button type="button" className={styles.walkthroughButton} onClick={() => setShowWalkthrough(true)}>
              Show walkthrough
            </button>
          )}

          {showWalkthrough && (
            <ol className={styles.walkthrough}>
              {question.walkthrough.map(step => <li key={step}>{step}</li>)}
            </ol>
          )}

          {submitted && index < questions.length - 1 && (
            <button type="button" className={styles.nextButton} onClick={handleNext}>
              Next question
            </button>
          )}
        </div>
        {question.desmosConfig && (
          <div className={styles.desmosSlot}>
            <DesmosCalculator config={question.desmosConfig} />
          </div>
        )}
      </div>
    </div>
  )
}
