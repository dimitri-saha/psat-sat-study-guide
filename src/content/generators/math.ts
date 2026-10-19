import type { DesmosConfig, Question } from '../types'
import { binomial, choicesWith, frac, pick, poly, randInt, randNonZero, shuffle } from './random'

/** A generated question before it is stamped with an id, domain and subsection. */
export type Draft = Omit<Question, 'id' | 'domain' | 'subsection'>

/** Strips spaces so a human-readable expression can be typed into Desmos as LaTeX. */
function tex(expr: string): string {
  return expr.replace(/\s+/g, '')
}

function viewAround(x: number, y: number, span = 12): DesmosConfig['bounds'] {
  return { left: x - span, right: x + span, top: y + span, bottom: y - span }
}

/** "aπ/b" style answer for a multiple of π. */
function piStr(num: number, den: number): string {
  const f = frac(num, den)
  const [n, d] = f.split('/')
  const coef = n === '1' ? '' : n === '-1' ? '-' : n
  return d ? `${coef}π/${d}` : `${coef}π`
}

/** Turns a poly() string into a continuation: "-3x + 2" → "- 3x + 2", "3x" → "+ 3x". */
function tail(expr: string): string {
  return expr.startsWith('-') ? `- ${expr.slice(1)}` : `+ ${expr}`
}

const DESMOS_GRAPH_BOTH = 'In Desmos, graph each side of the equation as its own "y =" line and click where they cross.'

// ---------------------------------------------------------------------------
// Algebra
// ---------------------------------------------------------------------------

function linearEquationsOneVariable(): Draft {
  return pick([
    (): Draft => {
      const x0 = randInt(-8, 12)
      const a = randInt(2, 6)
      const c = pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== a))
      const b = randNonZero(-9, 9)
      const d = a * (x0 + b) - c * x0
      const left = `${a}${binomial('x', b)}`
      const right = poly([[c, 'x'], [d, '']])
      const k = a - c
      return {
        difficulty: 'easy',
        prompt: `Solve for x: ${left} = ${right}`,
        correctAnswer: String(x0),
        hints: [`Distribute the ${a} across the parentheses first.`, 'Collect the x terms on one side and the constants on the other.', DESMOS_GRAPH_BOTH],
        walkthrough: [
          `Distribute: ${poly([[a, 'x'], [a * b, '']])} = ${right}`,
          `Subtract ${poly([[c, 'x']])} from both sides: ${poly([[k, 'x'], [a * b, '']])} = ${d}`,
          `${a * b < 0 ? 'Add' : 'Subtract'} ${Math.abs(a * b)} on both sides: ${poly([[k, 'x']])} = ${d - a * b}`,
          ...(k === 1 ? [] : [`Divide both sides by ${k}: x = ${x0}`]),
        ],
        desmosConfig: { expressions: [`y=${tex(left)}`, `y=${tex(right)}`], bounds: viewAround(x0, c * x0 + d, 20) },
      }
    },
    (): Draft => {
      const x0 = randInt(-6, 9)
      const p = randInt(3, 9)
      const r = randInt(1, p - 1)
      const q = randNonZero(-12, 12)
      const s = (p - r) * x0 + q
      const left = poly([[p, 'x'], [q, '']])
      const right = poly([[r, 'x'], [s, '']])
      return {
        difficulty: 'easy',
        prompt: `If ${left} = ${right}, what is the value of x?`,
        choices: choicesWith(String(x0), [frac(s + q, p - r), frac(s - q, p + r), String(-x0)], () => String(x0 + randNonZero(-5, 5))),
        correctAnswer: String(x0),
        hints: ['Move all the x terms to one side first.', 'Then move the constants to the other side and divide.', DESMOS_GRAPH_BOTH],
        walkthrough: [
          `Subtract ${poly([[r, 'x']])} from both sides: ${poly([[p - r, 'x'], [q, '']])} = ${s}`,
          `${q < 0 ? 'Add' : 'Subtract'} ${Math.abs(q)}: ${poly([[p - r, 'x']])} = ${s - q}`,
          ...(p - r === 1 ? [] : [`Divide by ${p - r}: x = ${x0}`]),
        ],
        desmosConfig: { expressions: [`y=${tex(left)}`, `y=${tex(right)}`], bounds: viewAround(x0, p * x0 + q, 20) },
      }
    },
    (): Draft => {
      const who = pick(['A plumber', 'An electrician', 'A dog walker', 'A tutor'])
      const fee = 5 * randInt(5, 18)
      const rate = 5 * randInt(6, 17)
      const hours = randInt(2, 8)
      const total = fee + rate * hours
      return {
        difficulty: 'medium',
        prompt: `${who} charges a flat fee of $${fee} plus $${rate} per hour. If one job cost a total of $${total}, how many hours did the job take?`,
        correctAnswer: String(hours),
        hints: ['Let h be the number of hours and write an equation for the total cost.', `The equation is ${fee} + ${rate}h = ${total}.`, `In Desmos, graph y = ${fee} + ${rate}x and y = ${total} and find the intersection.`],
        walkthrough: [`${fee} + ${rate}h = ${total}`, `Subtract ${fee}: ${rate}h = ${total - fee}`, `Divide by ${rate}: h = ${hours}`],
        desmosConfig: { expressions: [`y=${fee}+${rate}x`, `y=${total}`], bounds: { left: -1, right: hours + 5, top: total * 1.4, bottom: -total * 0.1 } },
      }
    },
  ])()
}

function linearEquationsTwoVariables(): Draft {
  return pick([
    (): Draft => {
      const x1 = randInt(-6, 6)
      const y1 = randInt(-8, 8)
      const x2 = pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7].map(dx => x1 + dx))
      const y2 = randInt(-8, 8)
      return {
        difficulty: 'easy',
        prompt: `A line passes through the points (${x1}, ${y1}) and (${x2}, ${y2}). What is the slope of the line?`,
        correctAnswer: frac(y2 - y1, x2 - x1),
        hints: ['Slope is rise over run: (y₂ − y₁) / (x₂ − x₁).', 'Keep the order of the points the same in the numerator and denominator.', 'In Desmos, plot both points, then type y − y₁ = m(x − x₁) and add a slider for m until the line hits the second point.'],
        walkthrough: [`Rise: ${y2} − (${y1}) = ${y2 - y1}`, `Run: ${x2} − (${x1}) = ${x2 - x1}`, `Slope = ${y2 - y1}/${x2 - x1} = ${frac(y2 - y1, x2 - x1)}`],
        desmosConfig: { expressions: [`(${x1},${y1})`, `(${x2},${y2})`, `y-${y1}=\\frac{${y2 - y1}}{${x2 - x1}}(x-${x1})`.replace(/--/g, '+')], bounds: viewAround(0, 0, 12) },
      }
    },
    (): Draft => {
      const m = randNonZero(-5, 5)
      const x1 = randNonZero(-6, 6)
      const y1 = randInt(-10, 10)
      const b = y1 - m * x1
      return {
        difficulty: 'medium',
        prompt: `In the xy-plane, a line has a slope of ${m} and passes through the point (${x1}, ${y1}). What is the y-coordinate of the line's y-intercept?`,
        correctAnswer: String(b),
        hints: ['Use slope-intercept form, y = mx + b.', `Substitute x = ${x1}, y = ${y1}, and m = ${m}, then solve for b.`, `In Desmos, type y = ${m}x + b, add a slider for b, and slide it until the line passes through (${x1}, ${y1}).`],
        walkthrough: [`${y1} = ${m}(${x1}) + b`, `${y1} = ${m * x1} + b`, `b = ${b}`],
        desmosConfig: { expressions: [`(${x1},${y1})`, `y=${m}x+b`, `b=${b}`], bounds: viewAround(0, b, 15) },
      }
    },
    (): Draft => {
      const ctx = pick([
        { thing: 'A gym membership', unit: 'month', v: 'm', fee: 'one-time sign-up fee', rateName: 'cost per month' },
        { thing: 'A phone plan', unit: 'gigabyte of data used', v: 'g', fee: 'fixed monthly charge', rateName: 'cost per gigabyte of data used' },
        { thing: 'A car rental', unit: 'mile driven', v: 'd', fee: 'flat rental fee', rateName: 'cost per mile driven' },
      ])
      const rate = randInt(3, 40)
      const fee = 5 * randInt(4, 30)
      return {
        difficulty: 'medium',
        prompt: `The total cost C, in dollars, of ${ctx.thing.toLowerCase()} is given by C = ${rate}${ctx.v} + ${fee}, where ${ctx.v} is the number of units (each ${ctx.unit}). What is the best interpretation of ${rate} in this context?`,
        choices: shuffle([`The ${ctx.rateName}`, `The ${ctx.fee}`, `The total cost for one ${ctx.unit.split(' ')[0]}`, `The maximum number of units allowed`]),
        correctAnswer: `The ${ctx.rateName}`,
        hints: ['In C = mx + b, the slope m is how much C changes when x goes up by 1.', `Ask: what happens to C when ${ctx.v} increases by 1?`, `In Desmos, graph y = ${rate}x + ${fee}. Check how much y rises each time x increases by 1.`],
        walkthrough: [`${rate} is multiplied by ${ctx.v}, so it is the slope.`, `Each additional unit adds $${rate} to the total.`, `So ${rate} is the ${ctx.rateName}; ${fee} is the ${ctx.fee}.`],
        desmosConfig: { expressions: [`y=${rate}x+${fee}`], bounds: { left: -1, right: 12, top: fee + rate * 12, bottom: -10 } },
      }
    },
    (): Draft => {
      const a = randNonZero(-9, 9)
      const b = randNonZero(-9, 9)
      const c = randNonZero(-30, 30)
      const eq = `${poly([[a, 'x'], [b, 'y']])} = ${c}`
      return {
        difficulty: 'hard',
        prompt: `The graph of ${eq} crosses the x-axis at the point (k, 0). What is the value of k?`,
        correctAnswer: frac(c, a),
        hints: ['Every point on the x-axis has y = 0.', `Substitute y = 0 into ${eq} and solve for x.`, 'In Desmos, type the equation exactly as given and click where the line crosses the x-axis.'],
        walkthrough: [`Set y = 0: ${poly([[a, 'x']])} = ${c}`, `x = ${c}/${a} = ${frac(c, a)}`],
        desmosConfig: { expressions: [tex(eq)], bounds: viewAround(c / a, 0, 12) },
      }
    },
  ])()
}

function systemsOfEquations(): Draft {
  return pick([
    (): Draft => {
      const x0 = randInt(-6, 8)
      const y0 = randInt(-6, 8)
      let a1 = 0, b1 = 0, a2 = 0, b2 = 0
      while (a1 * b2 - a2 * b1 === 0) {
        a1 = randNonZero(-6, 6); b1 = randNonZero(-6, 6); a2 = randNonZero(-6, 6); b2 = randNonZero(-6, 6)
      }
      const eq1 = `${poly([[a1, 'x'], [b1, 'y']])} = ${a1 * x0 + b1 * y0}`
      const eq2 = `${poly([[a2, 'x'], [b2, 'y']])} = ${a2 * x0 + b2 * y0}`
      const ask = pick(['x', 'y', 'x + y'] as const)
      const answer = ask === 'x' ? x0 : ask === 'y' ? y0 : x0 + y0
      return {
        difficulty: 'medium',
        prompt: `${eq1}\n${eq2}\nThe solution to the system of equations above is (x, y). What is the value of ${ask}?`,
        correctAnswer: String(answer),
        hints: ['Use elimination: scale the equations so one variable has opposite coefficients, then add.', 'Or solve one equation for a variable and substitute.', 'In Desmos, type both equations exactly as written and click the intersection point.'],
        walkthrough: [`Solving the system gives x = ${x0} and y = ${y0}.`, `Check: ${a1}(${x0}) + ${b1}(${y0}) = ${a1 * x0 + b1 * y0} ✓`, `So ${ask} = ${answer}.`],
        desmosConfig: { expressions: [tex(eq1), tex(eq2)], bounds: viewAround(x0, y0, 10) },
      }
    },
    (): Draft => {
      const a = randInt(2, 7)
      const b = randInt(2, 7)
      const c = randNonZero(-12, 12)
      const m = randInt(2, 4)
      const d = m * c + randNonZero(-5, 5)
      const eq1 = `${poly([[a, 'x'], [b, 'y']])} = ${c}`
      const eq2 = `${poly([[m * a, 'x']])} + ky = ${d}`
      return {
        difficulty: 'hard',
        prompt: `${eq1}\n${eq2}\nIn the system of equations above, k is a constant. If the system has no solution, what is the value of k?`,
        correctAnswer: String(m * b),
        hints: ['A system of two lines has no solution when the lines are parallel but not the same line.', 'Parallel lines have the same ratio of x-coefficient to y-coefficient.', 'In Desmos, type the second equation with a slider for k and slide until the lines never meet.'],
        walkthrough: [`The x-coefficient went from ${a} to ${m * a}, so it was multiplied by ${m}.`, `For parallel lines, the y-coefficient must also be multiplied by ${m}: k = ${m} × ${b} = ${m * b}.`, `The constants (${c} × ${m} = ${m * c} vs. ${d}) differ, so the lines are distinct — no solution.`],
        desmosConfig: { expressions: [tex(eq1), tex(eq2), `k=${m * b}`] },
      }
    },
    (): Draft => {
      const adultPrice = randInt(9, 18)
      const childPrice = randInt(4, adultPrice - 2)
      const adults = randInt(20, 120)
      const children = randInt(20, 120)
      const n = adults + children
      const total = adults * adultPrice + children * childPrice
      return {
        difficulty: 'medium',
        prompt: `A theater sold ${n} tickets for a total of $${total}. Adult tickets cost $${adultPrice} each and child tickets cost $${childPrice} each. How many adult tickets were sold?`,
        correctAnswer: String(adults),
        hints: ['Let a = adult tickets and c = child tickets. Write one equation for the number of tickets and one for the money.', `a + c = ${n} and ${adultPrice}a + ${childPrice}c = ${total}.`, `In Desmos, use x for adults and y for children: graph x + y = ${n} and ${adultPrice}x + ${childPrice}y = ${total}, then click the intersection.`],
        walkthrough: [`a + c = ${n}, so c = ${n} − a`, `${adultPrice}a + ${childPrice}(${n} − a) = ${total}`, `${adultPrice - childPrice}a + ${childPrice * n} = ${total}`, `${adultPrice - childPrice}a = ${total - childPrice * n}, so a = ${adults}`],
        desmosConfig: { expressions: [`x+y=${n}`, `${adultPrice}x+${childPrice}y=${total}`], bounds: { left: -10, right: n + 20, top: n + 20, bottom: -10 } },
      }
    },
  ])()
}

// ---------------------------------------------------------------------------
// Advanced Math
// ---------------------------------------------------------------------------

function equivalentExpressions(): Draft {
  const desmosCheck = 'In Desmos, graph y = (the original expression) and then each answer choice as its own y =. The equivalent one lies exactly on top of the original.'
  return pick([
    (): Draft => {
      const p = randNonZero(-9, 9)
      const q = randNonZero(-9, 9)
      const original = `${binomial('x', p)}${binomial('x', q)}`
      const correct = poly([[1, 'x^2'], [p + q, 'x'], [p * q, '']])
      return {
        difficulty: 'easy',
        prompt: `Which of the following is equivalent to ${original}?`,
        choices: choicesWith(correct, [
          poly([[1, 'x^2'], [p * q, '']]),
          poly([[1, 'x^2'], [p + q, 'x'], [-p * q, '']]),
          poly([[1, 'x^2'], [-(p + q), 'x'], [p * q, '']]),
          poly([[1, 'x^2'], [p * q, 'x'], [p + q, '']]),
        ], () => poly([[1, 'x^2'], [randNonZero(-15, 15), 'x'], [randNonZero(-40, 40), '']])),
        correctAnswer: correct,
        hints: ['Use FOIL: First, Outer, Inner, Last.', 'The middle term comes from adding the Outer and Inner products.', desmosCheck],
        walkthrough: [`First: x · x = x^2`, `Outer + Inner: ${poly([[q, 'x']])} + ${poly([[p, 'x']])} → ${poly([[p + q, 'x']])}`, `Last: (${p})(${q}) = ${p * q}`, `Result: ${correct}`],
        desmosConfig: { expressions: [`y=${tex(original)}`, `y=${tex(correct)}`] },
      }
    },
    (): Draft => {
      let p = randNonZero(-9, 9)
      let q = randNonZero(-9, 9)
      if (p > q) [p, q] = [q, p]
      const expanded = poly([[1, 'x^2'], [p + q, 'x'], [p * q, '']])
      const correct = `${binomial('x', p)}${binomial('x', q)}`
      return {
        difficulty: 'medium',
        prompt: `Which of the following is equivalent to ${expanded}?`,
        choices: choicesWith(correct, [
          `${binomial('x', -p)}${binomial('x', -q)}`,
          `${binomial('x', p)}${binomial('x', -q)}`,
          `${binomial('x', -p)}${binomial('x', q)}`,
        ], () => `${binomial('x', randNonZero(-9, 9))}${binomial('x', randNonZero(-9, 9))}`),
        correctAnswer: correct,
        hints: [`Find two numbers that multiply to ${p * q} and add to ${p + q}.`, 'Check each choice by multiplying it back out.', `In Desmos, graph y = ${expanded}. The x-intercepts tell you the factors: an intercept at x = r means (x − r) is a factor.`],
        walkthrough: [`${p} × ${q} = ${p * q} and ${p} + ${q} = ${p + q}`, `So ${expanded} = ${correct}`, `The graph crosses the x-axis at x = ${-p} and x = ${-q}, which matches.`],
        desmosConfig: { expressions: [`y=${tex(expanded)}`] },
      }
    },
    (): Draft => {
      const [a, b, c, d, e, f] = [randInt(2, 9), randNonZero(-9, 9), randNonZero(-9, 9), randInt(1, 8), randNonZero(-9, 9), randNonZero(-9, 9)]
      const first = poly([[a, 'x^2'], [b, 'x'], [c, '']])
      const second = poly([[d, 'x^2'], [e, 'x'], [f, '']])
      const correct = poly([[a - d, 'x^2'], [b - e, 'x'], [c - f, '']])
      return {
        difficulty: 'medium',
        prompt: `Which of the following is equivalent to (${first}) − (${second})?`,
        choices: choicesWith(correct, [
          poly([[a - d, 'x^2'], [b + e, 'x'], [c + f, '']]),
          poly([[a - d, 'x^2'], [b - e, 'x'], [c + f, '']]),
          poly([[a + d, 'x^2'], [b + e, 'x'], [c + f, '']]),
        ], () => poly([[a - d, 'x^2'], [randNonZero(-18, 18), 'x'], [randNonZero(-18, 18), '']])),
        correctAnswer: correct,
        hints: ['The minus sign applies to every term in the second set of parentheses.', `Rewrite as ${first} + (${poly([[-d, 'x^2'], [-e, 'x'], [-f, '']])}).`, desmosCheck],
        walkthrough: [`Distribute the negative: ${first} ${tail(poly([[-d, 'x^2'], [-e, 'x'], [-f, '']]))}`, `Combine x^2 terms: ${a} − ${d} = ${a - d}`, `Combine x terms: ${b} − (${e}) = ${b - e}`, `Combine constants: ${c} − (${f}) = ${c - f}`, `Result: ${correct}`],
        desmosConfig: { expressions: [`y=(${tex(first)})-(${tex(second)})`, `y=${tex(correct)}`] },
      }
    },
  ])()
}

function nonlinearEquationsFunctions(): Draft {
  return pick([
    (): Draft => {
      const a = randNonZero(-4, 4)
      const b = randInt(-9, 9)
      const c = randInt(-9, 9)
      const k = randNonZero(-4, 5)
      const f = poly([[a, 'x^2'], [b, 'x'], [c, '']])
      const value = a * k * k + b * k + c
      return {
        difficulty: 'easy',
        prompt: `The function f is defined by f(x) = ${f}. What is the value of f(${k})?`,
        correctAnswer: String(value),
        hints: [`Replace every x with (${k}).`, 'Square first, then multiply, then add — and watch negative signs.', `In Desmos, type f(x) = ${f} on one line and f(${k}) on the next.`],
        walkthrough: [`f(${k}) = ${a}(${k})^2 + (${b})(${k}) + (${c})`, `= ${a * k * k} + (${b * k}) + (${c})`, `= ${value}`],
        desmosConfig: { expressions: [`f(x)=${tex(f)}`, `f(${k})`] },
      }
    },
    (): Draft => {
      let r1 = randInt(-9, 9)
      let r2 = randInt(-9, 9)
      while (r1 === r2) r2 = randInt(-9, 9)
      if (r1 > r2) [r1, r2] = [r2, r1]
      const m = pick([1, 1, 2, 3])
      const eq = `${poly([[m, 'x^2'], [-m * (r1 + r2), 'x'], [m * r1 * r2, '']])} = 0`
      const ask = pick(['the greater', 'the sum of the', 'the product of the'] as const)
      const answer = ask === 'the greater' ? r2 : ask === 'the sum of the' ? r1 + r2 : r1 * r2
      return {
        difficulty: m === 1 ? 'medium' : 'hard',
        prompt: `What is ${ask} solution${ask === 'the greater' ? '' : 's'} to the equation ${eq}?`,
        correctAnswer: String(answer),
        hints: [m === 1 ? 'Factor the quadratic.' : `Divide both sides by ${m} first, then factor.`, 'Each factor set equal to zero gives one solution.', `In Desmos, graph y = ${eq.replace(' = 0', '')} and click the x-intercepts.`],
        walkthrough: [
          ...(m === 1 ? [] : [`Divide by ${m}: ${poly([[1, 'x^2'], [-(r1 + r2), 'x'], [r1 * r2, '']])} = 0`]),
          `Factor: ${binomial('x', -r1)}${binomial('x', -r2)} = 0`,
          `Solutions: x = ${r1} and x = ${r2}`,
          `So ${ask} solution${ask === 'the greater' ? '' : 's'}: ${answer}`,
        ],
        desmosConfig: { expressions: [`y=${tex(eq.replace(' = 0', ''))}`], bounds: { left: -12, right: 12, top: 20, bottom: -30 } },
      }
    },
    (): Draft => {
      const a = randInt(1, 3)
      const h = randNonZero(-5, 6)
      const k = randInt(-9, 9)
      const f = poly([[a, 'x^2'], [-2 * a * h, 'x'], [a * h * h + k, '']])
      const askMin = Math.random() < 0.5
      return {
        difficulty: 'hard',
        prompt: askMin
          ? `The function f is defined by f(x) = ${f}. What is the minimum value of f(x)?`
          : `The graph of y = ${f} is a parabola. What is the x-coordinate of its vertex?`,
        correctAnswer: String(askMin ? k : h),
        hints: ['The vertex of y = ax^2 + bx + c is at x = −b / (2a).', 'Plug that x-value back in to get the minimum y-value.', `In Desmos, graph y = ${f} and click the vertex — Desmos shows its coordinates.`],
        walkthrough: [`x = −(${-2 * a * h}) / (2 · ${a}) = ${h}`, `Substitute x = ${h} back in: f(${h}) = ${k}`, `Vertex: (${h}, ${k}), so the answer is ${askMin ? k : h}.`],
        desmosConfig: { expressions: [`y=${tex(f)}`], bounds: viewAround(h, k, 12) },
      }
    },
    (): Draft => {
      const start = randInt(2, 9) * 10
      const factor = pick([2, 3])
      const n = randInt(2, 5)
      const word = factor === 2 ? 'doubles' : 'triples'
      return {
        difficulty: 'medium',
        prompt: `A colony starts with ${start} bacteria, and its population ${word} every hour. Which function gives the population P after t hours, and what is P when t = ${n}?`,
        choices: choicesWith(`P(t) = ${start}(${factor})^t; ${start * factor ** n}`, [
          `P(t) = ${start} + ${factor}t; ${start + factor * n}`,
          `P(t) = ${start}(${factor})^t; ${start * factor * n}`,
          `P(t) = ${factor}(${start})^t; ${factor * start ** 2}`,
        ], () => `P(t) = ${start}(${factor})^t; ${start * factor ** (n + 1)}`),
        correctAnswer: `P(t) = ${start}(${factor})^t; ${start * factor ** n}`,
        hints: ['Repeated multiplication by the same number is exponential growth: P(t) = (start)(factor)^t.', `Compute ${start} × ${factor}^${n}.`, `In Desmos, type P(t) = ${start}(${factor})^t, then P(${n}).`],
        walkthrough: [`Initial value ${start}, growth factor ${factor}: P(t) = ${start}(${factor})^t`, `P(${n}) = ${start} × ${factor ** n} = ${start * factor ** n}`],
        desmosConfig: { expressions: [`P(t)=${start}\\cdot${factor}^t`, `P(${n})`] },
      }
    },
  ])()
}

// ---------------------------------------------------------------------------
// Problem-Solving and Data Analysis
// ---------------------------------------------------------------------------

function ratiosRatesProportions(): Draft {
  return pick([
    (): Draft => {
      const perCup = randInt(6, 15)
      const cups = randInt(2, 4)
      const target = randInt(5, 12)
      return {
        difficulty: 'easy',
        prompt: `A recipe uses ${cups} cups of flour to make ${cups * perCup} cookies. At this rate, how many cups of flour are needed to make ${target * perCup} cookies?`,
        correctAnswer: String(target),
        hints: ['Set up a proportion: cups / cookies = cups / cookies.', `${cups}/${cups * perCup} = x/${target * perCup}`, `In Desmos, type ${cups}/${cups * perCup} = x/${target * perCup} — Desmos draws a vertical line at the answer.`],
        walkthrough: [`Cookies per cup: ${cups * perCup} ÷ ${cups} = ${perCup}`, `Cups needed: ${target * perCup} ÷ ${perCup} = ${target}`],
        desmosConfig: { expressions: [`\\frac{${cups}}{${cups * perCup}}=\\frac{x}{${target * perCup}}`], bounds: viewAround(target, 0, 10) },
      }
    },
    (): Draft => {
      const speed = randInt(35, 70)
      const t = randInt(2, 5)
      const t2 = pick([2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== t))
      return {
        difficulty: 'easy',
        prompt: `A car travels ${speed * t} miles in ${t} hours at a constant speed. At this speed, how many miles will the car travel in ${t2} hours?`,
        correctAnswer: String(speed * t2),
        hints: ['Find the unit rate (miles per hour) first.', 'Distance = rate × time.', `In Desmos, graph y = (${speed * t}/${t})x and click the point at x = ${t2}.`],
        walkthrough: [`Rate: ${speed * t} ÷ ${t} = ${speed} miles per hour`, `Distance: ${speed} × ${t2} = ${speed * t2} miles`],
        desmosConfig: { expressions: [`y=\\frac{${speed * t}}{${t}}x`, `(${t2},${speed * t2})`], bounds: { left: -1, right: 10, top: speed * 10, bottom: -20 } },
      }
    },
    (): Draft => {
      const [p, q] = pick([[2, 3], [3, 5], [1, 4], [3, 4], [2, 5], [4, 7], [5, 3]])
      const mult = randInt(3, 15)
      const [first, second] = pick([['red', 'blue'], ['boys', 'girls'], ['fiction', 'nonfiction']])
      const things = first === 'red' ? 'marbles in a jar' : first === 'boys' ? 'students in a club' : 'books on a shelf'
      return {
        difficulty: 'medium',
        prompt: `The ratio of ${first} to ${second} among the ${things} is ${p} to ${q}. If there are ${(p + q) * mult} ${things.split(' ')[0]} in total, how many are ${second}?`,
        correctAnswer: String(q * mult),
        hints: [`A ratio of ${p}:${q} means the total is split into ${p + q} equal parts.`, `Each part is ${(p + q) * mult} ÷ ${p + q}.`, `In Desmos, graph y = ${p}x/${q} and x + y = ${(p + q) * mult}; the x-value of the intersection is the number of ${second}.`],
        walkthrough: [`Total parts: ${p} + ${q} = ${p + q}`, `One part: ${(p + q) * mult} ÷ ${p + q} = ${mult}`, `${second}: ${q} × ${mult} = ${q * mult}`],
        desmosConfig: { expressions: [`y=\\frac{${p}}{${q}}x`, `x+y=${(p + q) * mult}`], bounds: { left: -5, right: (p + q) * mult, top: (p + q) * mult, bottom: -5 } },
      }
    },
  ])()
}

function percentages(): Draft {
  return pick([
    (): Draft => {
      const p = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 120, 150])
      const n = 20 * randInt(2, 30)
      return {
        difficulty: 'easy',
        prompt: `What is ${p}% of ${n}?`,
        correctAnswer: String((p * n) / 100),
        hints: ['"Percent" means "out of 100", and "of" means multiply.', `Compute ${p / 100} × ${n}.`, `In Desmos, type ${p}% of ${n} — Desmos understands "% of".`],
        walkthrough: [`${p}% = ${p / 100}`, `${p / 100} × ${n} = ${(p * n) / 100}`],
        desmosConfig: { expressions: [`\\frac{${p}}{100}\\cdot${n}`] },
      }
    },
    (): Draft => {
      const n = 100 * randInt(1, 9)
      const up = 10 * randInt(1, 5)
      const down = 10 * randInt(1, 5)
      const answer = (n * (100 + up) * (100 - down)) / 10000
      return {
        difficulty: 'hard',
        prompt: `The price of a jacket was $${n}. The price was increased by ${up}%, and then the new price was decreased by ${down}%. What is the final price of the jacket, in dollars?`,
        choices: choicesWith(String(answer), [String((n * (100 + up - down)) / 100), String(n), String((n * (100 + down - up)) / 100)], () => String(answer + 10 * randNonZero(-5, 5))),
        correctAnswer: String(answer),
        hints: [`An increase of ${up}% means multiplying by ${(100 + up) / 100}.`, `A decrease of ${down}% means multiplying by ${(100 - down) / 100}. The percents don't simply add.`, `In Desmos, type ${n}(${(100 + up) / 100})(${(100 - down) / 100}).`],
        walkthrough: [`After increase: ${n} × ${(100 + up) / 100} = ${(n * (100 + up)) / 100}`, `After decrease: ${(n * (100 + up)) / 100} × ${(100 - down) / 100} = ${answer}`],
        desmosConfig: { expressions: [`${n}\\cdot${(100 + up) / 100}\\cdot${(100 - down) / 100}`] },
      }
    },
    (): Draft => {
      const p = 5 * randInt(1, 19)
      const whole = 20 * randInt(2, 25)
      const part = (p * whole) / 100
      return {
        difficulty: 'easy',
        prompt: `${part} is what percent of ${whole}?`,
        correctAnswer: String(p),
        hints: ['Percent = part ÷ whole × 100.', `Compute ${part} ÷ ${whole}, then multiply by 100.`, `In Desmos, type x% of ${whole} = ${part} and read off the vertical line.`],
        walkthrough: [`${part} ÷ ${whole} = ${p / 100}`, `${p / 100} × 100 = ${p}%`],
        desmosConfig: { expressions: [`\\frac{${part}}{${whole}}\\cdot100`] },
      }
    },
    (): Draft => {
      const original = 20 * randInt(2, 25)
      const off = pick([10, 15, 20, 25, 30, 40, 50, 60, 75])
      const sale = (original * (100 - off)) / 100
      return {
        difficulty: 'medium',
        prompt: `A store sells a speaker for $${sale} after a ${off}% discount. What was the original price of the speaker, in dollars?`,
        correctAnswer: String(original),
        hints: [`After a ${off}% discount, you pay ${100 - off}% of the original price.`, `So ${(100 - off) / 100} × (original) = ${sale}.`, `In Desmos, graph y = ${(100 - off) / 100}x and y = ${sale}, then click the intersection.`],
        walkthrough: [`${(100 - off) / 100} × p = ${sale}`, `p = ${sale} ÷ ${(100 - off) / 100} = ${original}`],
        desmosConfig: { expressions: [`y=${(100 - off) / 100}x`, `y=${sale}`], bounds: { left: -10, right: original * 1.5, top: original, bottom: -10 } },
      }
    },
  ])()
}

function dataAndProbability(): Draft {
  return pick([
    (): Draft => {
      const mean = randInt(12, 40)
      const known = Array.from({ length: 4 }, () => mean + randInt(-10, 10))
      const missing = 5 * mean - known.reduce((s, v) => s + v, 0)
      if (missing <= 0) return dataAndProbability()
      return {
        difficulty: 'medium',
        prompt: `The mean of five numbers is ${mean}. Four of the numbers are ${known.join(', ')}. What is the fifth number?`,
        correctAnswer: String(missing),
        hints: ['Mean = sum ÷ count, so sum = mean × count.', `The five numbers must add up to ${mean} × 5.`, `In Desmos, type mean([${known.join(', ')}, x]) = ${mean} and read off the vertical line.`],
        walkthrough: [`Total: ${mean} × 5 = ${mean * 5}`, `Known sum: ${known.join(' + ')} = ${mean * 5 - missing}`, `Fifth number: ${mean * 5} − ${mean * 5 - missing} = ${missing}`],
        desmosConfig: { expressions: [`L=[${known.join(',')},${missing}]`, '\\operatorname{mean}(L)'] },
      }
    },
    (): Draft => {
      const values = Array.from({ length: 7 }, () => randInt(1, 60))
      const sorted = [...values].sort((a, b) => a - b)
      return {
        difficulty: 'easy',
        prompt: `What is the median of the data set ${values.join(', ')}?`,
        correctAnswer: String(sorted[3]),
        hints: ['Put the values in order from least to greatest.', 'With 7 values, the median is the 4th one.', `In Desmos, type L = [${values.join(', ')}] and then median(L).`],
        walkthrough: [`Sorted: ${sorted.join(', ')}`, `The 4th value is ${sorted[3]}.`],
        desmosConfig: { expressions: [`L=[${values.join(',')}]`, '\\operatorname{median}(L)'] },
      }
    },
    (): Draft => {
      const counts = { red: randInt(2, 12), blue: randInt(2, 12), green: randInt(2, 12) }
      const total = counts.red + counts.blue + counts.green
      const color = pick(['red', 'blue', 'green'] as const)
      const not = Math.random() < 0.35
      const favorable = not ? total - counts[color] : counts[color]
      return {
        difficulty: not ? 'medium' : 'easy',
        prompt: `A bag contains ${counts.red} red, ${counts.blue} blue, and ${counts.green} green marbles. If one marble is chosen at random, what is the probability that it is ${not ? 'not ' : ''}${color}?`,
        correctAnswer: frac(favorable, total),
        hints: ['Probability = favorable outcomes ÷ total outcomes.', `There are ${total} marbles in total.`, `In Desmos, type ${favorable}/${total} to see it as a decimal and check your fraction.`],
        walkthrough: [`Total marbles: ${counts.red} + ${counts.blue} + ${counts.green} = ${total}`, `Favorable: ${favorable}`, `Probability: ${favorable}/${total} = ${frac(favorable, total)}`],
        desmosConfig: { expressions: [`\\frac{${favorable}}{${total}}`] },
      }
    },
  ])()
}

// ---------------------------------------------------------------------------
// Geometry and Trigonometry
// ---------------------------------------------------------------------------

function areaAndVolume(): Draft {
  return pick([
    (): Draft => {
      const [l, w, h] = [randInt(2, 12), randInt(2, 12), randInt(2, 12)]
      return {
        difficulty: 'easy',
        prompt: `A rectangular box has a length of ${l} inches, a width of ${w} inches, and a height of ${h} inches. What is the volume of the box, in cubic inches?`,
        correctAnswer: String(l * w * h),
        hints: ['Volume of a rectangular prism = length × width × height.', 'Multiply all three dimensions.', `Use Desmos as a calculator: type ${l}·${w}·${h}.`],
        walkthrough: [`V = ${l} × ${w} × ${h} = ${l * w * h}`],
        desmosConfig: { expressions: [`${l}\\cdot${w}\\cdot${h}`] },
      }
    },
    (): Draft => {
      const r = randInt(2, 6)
      const h = randInt(2, 10)
      const correct = `${r * r * h}π`
      return {
        difficulty: 'medium',
        prompt: `A right circular cylinder has a radius of ${r} centimeters and a height of ${h} centimeters. What is the volume of the cylinder, in cubic centimeters?`,
        choices: choicesWith(correct, [`${2 * r * h}π`, `${r * h}π`, `${2 * r * r * h}π`, `${r * r * h}`], () => `${r * r * h + randNonZero(-10, 10)}π`),
        correctAnswer: correct,
        hints: ['Volume of a cylinder = πr²h (this is on the SAT reference sheet).', `Square the radius first: ${r}² = ${r * r}.`, `In Desmos, type π·${r}^2·${h} and compare it to π times each choice's number.`],
        walkthrough: [`V = π(${r})²(${h})`, `= π(${r * r})(${h})`, `= ${correct}`],
        desmosConfig: { expressions: [`\\pi\\cdot${r}^2\\cdot${h}`, `${r * r * h}\\pi`] },
      }
    },
    (): Draft => {
      const l = randInt(5, 20)
      const w = randInt(2, l - 1)
      return {
        difficulty: 'medium',
        prompt: `A rectangle has a perimeter of ${2 * (l + w)} meters and a length of ${l} meters. What is the area of the rectangle, in square meters?`,
        correctAnswer: String(l * w),
        hints: ['Perimeter = 2(length + width). Use it to find the width.', `2(${l} + w) = ${2 * (l + w)}`, `In Desmos, graph 2(${l} + x) = ${2 * (l + w)} to see the width as a vertical line.`],
        walkthrough: [`${l} + w = ${l + w}, so w = ${w}`, `Area = ${l} × ${w} = ${l * w}`],
        desmosConfig: { expressions: [`2(${l}+x)=${2 * (l + w)}`], bounds: viewAround(w, 0, 10) },
      }
    },
    (): Draft => {
      const b = 2 * randInt(2, 10)
      const h = randInt(3, 15)
      return {
        difficulty: 'easy',
        prompt: `A triangle has a base of ${b} feet and a height of ${h} feet. What is the area of the triangle, in square feet?`,
        correctAnswer: String((b * h) / 2),
        hints: ['Area of a triangle = ½ × base × height.', `Multiply ${b} × ${h}, then halve it.`, `In Desmos, type (1/2)·${b}·${h}.`],
        walkthrough: [`A = ½ × ${b} × ${h} = ${(b * h) / 2}`],
        desmosConfig: { expressions: [`\\frac{1}{2}\\cdot${b}\\cdot${h}`] },
      }
    },
  ])()
}

function linesAnglesTriangles(): Draft {
  return pick([
    (): Draft => {
      const a = randInt(20, 100)
      const b = randInt(20, 150 - a)
      return {
        difficulty: 'easy',
        prompt: `In triangle ABC, the measure of angle A is ${a}° and the measure of angle B is ${b}°. What is the measure, in degrees, of angle C?`,
        correctAnswer: String(180 - a - b),
        hints: ['The angles in a triangle add up to 180°.', `Subtract ${a} and ${b} from 180.`, `In Desmos, type ${a} + ${b} + x = 180 to see the answer as a vertical line.`],
        walkthrough: [`${a} + ${b} + C = 180`, `C = 180 − ${a + b} = ${180 - a - b}`],
        desmosConfig: { expressions: [`${a}+${b}+x=180`], bounds: viewAround(180 - a - b, 0, 30) },
      }
    },
    (): Draft => {
      const a = pick([randInt(25, 85), randInt(95, 155)])
      const kind = pick(['same-side interior', 'alternate interior', 'corresponding'] as const)
      const answer = kind === 'same-side interior' ? 180 - a : a
      return {
        difficulty: 'medium',
        prompt: `Two parallel lines are cut by a transversal. One of the interior angles formed measures ${a}°. What is the measure, in degrees, of the ${kind} angle that pairs with it?`,
        correctAnswer: String(answer),
        hints: ['When parallel lines are cut by a transversal, every angle equals either the given angle or its supplement.', kind === 'same-side interior' ? 'Same-side interior angles are supplementary (they add to 180°).' : `${kind[0].toUpperCase()}${kind.slice(1)} angles are congruent.`, 'In Desmos, sketch it: graph y = 0, y = 4, and a slanted line through both, and compare the angles you see.'],
        walkthrough: kind === 'same-side interior' ? [`Same-side interior angles add to 180°.`, `180 − ${a} = ${answer}`] : [`${kind[0].toUpperCase()}${kind.slice(1)} angles are equal.`, `The answer is ${answer}.`],
        desmosConfig: { expressions: ['y=0', 'y=4', `y=${Math.tan((a * Math.PI) / 180).toFixed(4)}x`] },
      }
    },
    (): Draft => {
      const v = 2 * randInt(10, 70)
      return {
        difficulty: 'medium',
        prompt: `In isosceles triangle PQR, PQ = PR and the measure of angle P is ${v}°. What is the measure, in degrees, of angle Q?`,
        correctAnswer: String((180 - v) / 2),
        hints: ['The angles opposite the equal sides are equal, so angle Q = angle R.', `Angles Q and R together make 180 − ${v}.`, `In Desmos, type ${v} + 2x = 180 to see the answer as a vertical line.`],
        walkthrough: [`Q + R = 180 − ${v} = ${180 - v}`, `Q = R, so Q = ${180 - v} ÷ 2 = ${(180 - v) / 2}`],
        desmosConfig: { expressions: [`${v}+2x=180`], bounds: viewAround((180 - v) / 2, 0, 30) },
      }
    },
    (): Draft => {
      const ab = randInt(3, 12)
      const bc = randInt(3, 12)
      const k = randInt(2, 4)
      return {
        difficulty: 'medium',
        prompt: `Triangle ABC is similar to triangle DEF, where A corresponds to D, B corresponds to E, and C corresponds to F. If AB = ${ab}, BC = ${bc}, and DE = ${ab * k}, what is the length of EF?`,
        correctAnswer: String(bc * k),
        hints: ['Corresponding sides of similar triangles are proportional.', `The scale factor is DE / AB = ${ab * k}/${ab}.`, `In Desmos, type ${ab}/${bc} = ${ab * k}/x and read off the vertical line.`],
        walkthrough: [`Scale factor: ${ab * k} ÷ ${ab} = ${k}`, `EF = ${bc} × ${k} = ${bc * k}`],
        desmosConfig: { expressions: [`\\frac{${ab}}{${bc}}=\\frac{${ab * k}}{x}`], bounds: viewAround(bc * k, 0, 15) },
      }
    },
  ])()
}

const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]

function rightTriangleTrigCircles(): Draft {
  return pick([
    (): Draft => {
      const [a0, b0, c0] = pick(TRIPLES)
      const s = randInt(1, a0 === 3 ? 4 : 2)
      const [a, b, c] = [a0 * s, b0 * s, c0 * s]
      const askHyp = Math.random() < 0.5
      return {
        difficulty: askHyp ? 'easy' : 'medium',
        prompt: askHyp
          ? `A right triangle has legs of length ${a} and ${b}. What is the length of the hypotenuse?`
          : `A right triangle has a hypotenuse of length ${c} and one leg of length ${a}. What is the length of the other leg?`,
        correctAnswer: String(askHyp ? c : b),
        hints: ['Use the Pythagorean theorem: a² + b² = c², where c is the hypotenuse.', askHyp ? `Compute √(${a}² + ${b}²).` : `Compute √(${c}² − ${a}²).`, askHyp ? `In Desmos, type sqrt(${a}^2 + ${b}^2).` : `In Desmos, type sqrt(${c}^2 - ${a}^2).`],
        walkthrough: askHyp
          ? [`c² = ${a * a} + ${b * b} = ${c * c}`, `c = ${c}`]
          : [`b² = ${c * c} − ${a * a} = ${b * b}`, `b = ${b}`],
        desmosConfig: { expressions: [askHyp ? `\\sqrt{${a}^2+${b}^2}` : `\\sqrt{${c}^2-${a}^2}`] },
      }
    },
    (): Draft => {
      const [a0, b0, c0] = pick(TRIPLES)
      const s = randInt(1, 3)
      const [bc, ac, ab] = [a0 * s, b0 * s, c0 * s]
      const fn = pick(['sin', 'cos', 'tan'] as const)
      const answer = fn === 'sin' ? frac(bc, ab) : fn === 'cos' ? frac(ac, ab) : frac(bc, ac)
      return {
        difficulty: 'medium',
        prompt: `In right triangle ABC, angle C is the right angle, BC = ${bc}, AC = ${ac}, and AB = ${ab}. What is ${fn}(A)?`,
        correctAnswer: answer,
        hints: ['SOH-CAH-TOA: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent.', `From angle A, the opposite side is BC, the adjacent side is AC, and the hypotenuse is AB.`, `In Desmos, type ${fn}(arctan(${bc}/${ac})) to get a decimal, then match it to your fraction.`],
        walkthrough: [`Opposite A: BC = ${bc}; adjacent: AC = ${ac}; hypotenuse: AB = ${ab}`, `${fn}(A) = ${fn === 'sin' ? `${bc}/${ab}` : fn === 'cos' ? `${ac}/${ab}` : `${bc}/${ac}`} = ${answer}`],
        desmosConfig: { expressions: [`\\${fn}(\\arctan(\\frac{${bc}}{${ac}}))`] },
      }
    },
    (): Draft => {
      const h = randInt(-8, 8)
      const k = randInt(-8, 8)
      const r = randInt(1, 9)
      const eq = `${poly([[1, 'x^2'], [1, 'y^2'], [-2 * h, 'x'], [-2 * k, 'y'], [h * h + k * k - r * r, '']])} = 0`
      return {
        difficulty: 'hard',
        prompt: `The equation of a circle in the xy-plane is ${eq}. What is the radius of the circle?`,
        correctAnswer: String(r),
        hints: ['Complete the square for x and for y to get (x − h)² + (y − k)² = r².', 'Add the completing-the-square constants to both sides.', 'In Desmos, type the equation exactly as given and measure the circle across from its center.'],
        walkthrough: [`Group: (x² ${h ? tail(poly([[-2 * h, 'x']])) : ''}) + (y² ${k ? tail(poly([[-2 * k, 'y']])) : ''}) = ${-(h * h + k * k - r * r)}`, `Complete the square: (x − (${h}))² + (y − (${k}))² = ${-(h * h + k * k - r * r)} + ${h * h} + ${k * k} = ${r * r}`, `r² = ${r * r}, so r = ${r}`],
        desmosConfig: { expressions: [tex(eq), `(${h},${k})`], bounds: viewAround(h, k, r + 4) },
      }
    },
    (): Draft => {
      const r = randInt(2, 12)
      const deg = pick([30, 40, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270])
      const correct = piStr(r * deg, 180)
      return {
        difficulty: 'hard',
        prompt: `A circle has a radius of ${r}. What is the length of an arc of the circle that has a central angle of ${deg}°?`,
        choices: choicesWith(correct, [piStr(r * r * deg, 360), piStr(r * deg, 360), piStr(2 * r * deg, 180)], () => piStr(r * deg + 180 * randNonZero(-3, 3), 180)),
        correctAnswer: correct,
        hints: ['Arc length = (angle / 360) × circumference.', `Circumference = 2π(${r}) = ${2 * r}π.`, `In Desmos, type (${deg}/360)·2π·${r} and compare with each choice.`],
        walkthrough: [`Circumference: 2π(${r}) = ${2 * r}π`, `Fraction of the circle: ${deg}/360 = ${frac(deg, 360)}`, `Arc length: ${frac(deg, 360)} × ${2 * r}π = ${correct}`],
        desmosConfig: { expressions: [`\\frac{${deg}}{360}\\cdot2\\pi\\cdot${r}`] },
      }
    },
    (): Draft => {
      const y = randInt(5, 85)
      const fn = pick(['sin', 'cos'] as const)
      const other = fn === 'sin' ? 'cos' : 'sin'
      return {
        difficulty: 'medium',
        prompt: `If ${fn}(x°) = ${other}(${y}°) and 0 < x < 90, what is the value of x?`,
        correctAnswer: String(90 - y),
        hints: ['Sine and cosine of complementary angles are equal: sin(θ) = cos(90° − θ).', 'Complementary angles add to 90°.', `In Desmos (degree mode), graph y = ${fn}(x) and y = ${other}(${y}) and click the intersection between 0 and 90.`],
        walkthrough: [`${fn}(x°) = ${other}(${y}°) when x + ${y} = 90`, `x = ${90 - y}`],
        desmosConfig: { expressions: [`y=\\${fn}(\\frac{\\pi x}{180})`, `y=\\${other}(\\frac{${y}\\pi}{180})`], bounds: { left: 0, right: 100, top: 1.5, bottom: -0.5 } },
      }
    },
  ])()
}

export const mathGenerators: Record<string, () => Draft> = {
  'algebra/linear-equations-one-variable': linearEquationsOneVariable,
  'algebra/linear-equations-two-variables': linearEquationsTwoVariables,
  'algebra/systems-of-equations': systemsOfEquations,
  'advanced-math/equivalent-expressions': equivalentExpressions,
  'advanced-math/nonlinear-equations-functions': nonlinearEquationsFunctions,
  'problem-solving-data-analysis/ratios-rates-proportions': ratiosRatesProportions,
  'problem-solving-data-analysis/percentages': percentages,
  'problem-solving-data-analysis/data-and-probability': dataAndProbability,
  'geometry-and-trigonometry/area-and-volume': areaAndVolume,
  'geometry-and-trigonometry/lines-angles-triangles': linesAnglesTriangles,
  'geometry-and-trigonometry/right-triangle-trig-circles': rightTriangleTrigCircles,
}
