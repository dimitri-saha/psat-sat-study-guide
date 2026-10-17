import type { DesmosTopic } from '../types'

export const topic: DesmosTopic = {
  slug: 'regression',
  title: 'Using Regression for Data Analysis Questions',
  summary: 'Fit a line to a set of data points to answer trend and prediction questions.',
  body: "When a question gives you several data points and asks for a 'line of best fit' or asks you to predict a value, you can plot the points in Desmos and visually fit a line through them, then read off the slope and intercept, or estimate a value by eye. A line close to the pattern of a scattered set of points can often rule out two or three answer choices immediately, even without computing the exact regression line by hand.",
  tips: [
    'Plot each given data point individually as an ordered pair, like (1, 2), before trying to fit a line.',
    'A rough line through the "middle" of the scattered points is usually enough to eliminate answer choices that are clearly too steep or too shallow.',
    'If answer choices give specific equations, graph each one against your plotted points to see which fits best.',
  ],
  desmosConfig: { expressions: ['(1,2)', '(2,4)', '(3,5)', '(4,9)', 'y=2.2x-0.5'], bounds: { left: -1, right: 6, top: 10, bottom: -1 } },
}
