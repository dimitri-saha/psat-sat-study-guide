import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as avLesson, questions as avQuestions } from './areaAndVolume'
import { lesson as latLesson, questions as latQuestions } from './linesAnglesTriangles'
import { lesson as rtcLesson, questions as rtcQuestions } from './rightTriangleTrigCircles'

export function registerGeometryAndTrigonometry(): DomainMeta {
  registerContent('geometry-and-trigonometry', 'area-and-volume', avLesson, avQuestions)
  registerContent('geometry-and-trigonometry', 'lines-angles-triangles', latLesson, latQuestions)
  registerContent('geometry-and-trigonometry', 'right-triangle-trig-circles', rtcLesson, rtcQuestions)
  return {
    slug: 'geometry-and-trigonometry',
    title: 'Geometry and Trigonometry',
    subsections: [
      { slug: 'area-and-volume', title: 'Area and Volume' },
      { slug: 'lines-angles-triangles', title: 'Lines, Angles, and Triangles' },
      { slug: 'right-triangle-trig-circles', title: 'Right Triangle Trig and Circles' },
    ],
  }
}
