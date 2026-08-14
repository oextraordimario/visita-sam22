import { describe, expect, it } from 'vitest'
import { vetorMovimento } from './teclas'

const teclas = (...codigos: string[]) => new Set(codigos)

describe('vetorMovimento', () => {
  it('parado sem tecla nenhuma', () => {
    expect(vetorMovimento(teclas())).toEqual({ x: 0, z: 0, acelerado: false })
  })

  it('frente com W e com seta', () => {
    expect(vetorMovimento(teclas('KeyW')).z).toBe(1)
    expect(vetorMovimento(teclas('ArrowUp')).z).toBe(1)
  })

  it('teclas opostas se anulam', () => {
    expect(vetorMovimento(teclas('KeyW', 'KeyS'))).toEqual({ x: 0, z: 0, acelerado: false })
    expect(vetorMovimento(teclas('KeyA', 'KeyD')).x).toBe(0)
  })

  it('diagonal é normalizada (não anda mais rápido)', () => {
    const v = vetorMovimento(teclas('KeyW', 'KeyD'))
    expect(Math.hypot(v.x, v.z)).toBeCloseTo(1)
    expect(v.x).toBeCloseTo(Math.SQRT1_2)
    expect(v.z).toBeCloseTo(Math.SQRT1_2)
  })

  it('soltar tecla muda o vetor (o Set é o estado, não o evento)', () => {
    const pressionadas = new Set(['KeyW', 'KeyD'])
    pressionadas.delete('KeyD')
    expect(vetorMovimento(pressionadas)).toEqual({ x: 0, z: 1, acelerado: false })
  })

  it('shift acelera com e sem movimento', () => {
    expect(vetorMovimento(teclas('ShiftLeft')).acelerado).toBe(true)
    expect(vetorMovimento(teclas('KeyW', 'ShiftRight')).acelerado).toBe(true)
  })

  it('conjunto vazio após perda de foco volta ao repouso', () => {
    const pressionadas = new Set(['KeyW', 'ShiftLeft'])
    pressionadas.clear()
    expect(vetorMovimento(pressionadas)).toEqual({ x: 0, z: 0, acelerado: false })
  })
})
