// Tradução de teclas físicas (KeyboardEvent.code) em intenção de movimento.
// Lógica pura, sem DOM — é o que o vitest cobre.

export type VetorMovimento = {
  /** direita positivo, esquerda negativo, normalizado com z */
  x: number
  /** frente positivo, trás negativo, normalizado com x */
  z: number
  acelerado: boolean
}

const FRENTE = ['KeyW', 'ArrowUp']
const TRAS = ['KeyS', 'ArrowDown']
const ESQUERDA = ['KeyA', 'ArrowLeft']
const DIREITA = ['KeyD', 'ArrowRight']
const ACELERA = ['ShiftLeft', 'ShiftRight']

const alguma = (codigos: string[], pressionadas: ReadonlySet<string>) =>
  codigos.some((c) => pressionadas.has(c))

export function vetorMovimento(pressionadas: ReadonlySet<string>): VetorMovimento {
  const x = (alguma(DIREITA, pressionadas) ? 1 : 0) - (alguma(ESQUERDA, pressionadas) ? 1 : 0)
  const z = (alguma(FRENTE, pressionadas) ? 1 : 0) - (alguma(TRAS, pressionadas) ? 1 : 0)
  const acelerado = alguma(ACELERA, pressionadas)
  const norma = Math.hypot(x, z)
  if (norma === 0) return { x: 0, z: 0, acelerado }
  return { x: x / norma, z: z / norma, acelerado }
}
