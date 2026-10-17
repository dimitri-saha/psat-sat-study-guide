import { registerDesmosTopic } from '../registry'
import { topic as intersectionsTopic } from './intersections'
import { topic as regressionTopic } from './regression'
import { topic as tableModeTopic } from './tableMode'
import { topic as solvingWithoutAlgebraTopic } from './solvingWithoutAlgebra'

export function registerDesmosTricks() {
  registerDesmosTopic(intersectionsTopic)
  registerDesmosTopic(regressionTopic)
  registerDesmosTopic(tableModeTopic)
  registerDesmosTopic(solvingWithoutAlgebraTopic)
}
