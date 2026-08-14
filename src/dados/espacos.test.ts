import { describe, expect, it } from 'vitest'
import { ESPACOS, espacoEm } from './espacos'

describe('manifest de espaços', () => {
  it('ids únicos e glb apontando para a pasta de modelos', () => {
    const ids = ESPACOS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of ESPACOS) {
      expect(e.glb).toMatch(/^\/assets\/modelos\/[a-z-]+\.glb$/)
      expect(e.nome.length).toBeGreaterThan(0)
    }
  })

  it('toda zona tem min < max nos três eixos', () => {
    for (const e of ESPACOS) {
      for (let eixo = 0; eixo < 3; eixo++) {
        expect(e.zona.min[eixo]).toBeLessThan(e.zona.max[eixo])
      }
    }
  })

  it('pontos de referência caem no espaço certo', () => {
    expect(espacoEm({ x: 0, y: 0.9, z: 3 })).toBe('saguao') // spawn
    expect(espacoEm({ x: 0, y: 2, z: -8 })).toBe('escadaria') // lance central
    expect(espacoEm({ x: 7.55, y: 1, z: -10 })).toBe('escadaria') // corredor
    expect(espacoEm({ x: 0, y: 7.6, z: 0.75 })).toBe('foyer') // sobre o saguão
    expect(espacoEm({ x: 0, y: 0.4, z: -25 })).toBe('sala') // plateia
    expect(espacoEm({ x: 0, y: 0.9, z: -45 })).toBe('palco')
    expect(espacoEm({ x: 0, y: 50, z: 0 })).toBeNull() // fora de tudo
  })
})
