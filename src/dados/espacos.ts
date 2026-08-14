// Manifest dos espaços navegáveis — a unidade de streaming do PRD (§6).
// Zonas em coordenadas do mundo (1 un = 1 m, origem no centro do saguão).

export type EspacoId = 'saguao' | 'escadaria' | 'foyer' | 'sala' | 'palco'

export type Espaco = {
  id: EspacoId
  nome: string
  glb: string
  /** caixa [min, max] usada para saber em que espaço o jogador está */
  zona: { min: [number, number, number]; max: [number, number, number] }
}

export const ESPACOS: Espaco[] = [
  {
    id: 'saguao',
    nome: 'Saguão',
    glb: '/assets/modelos/saguao.glb',
    zona: { min: [-15, -1, -4.75], max: [15, 7, 4.75] },
  },
  {
    id: 'escadaria',
    nome: 'Escadaria nobre',
    glb: '/assets/modelos/escadaria.glb',
    // max z −3,25 (não −4,75): a passarela de chegada ao foyer é da escadaria
    zona: { min: [-9.5, -1, -15.2], max: [9.5, 20, -3.25] },
  },
  {
    id: 'foyer',
    nome: 'Salão nobre',
    glb: '/assets/modelos/foyer.glb',
    zona: { min: [-15, 7, -3.25], max: [15, 19, 4.75] },
  },
  {
    id: 'sala',
    nome: 'Sala de espetáculos',
    glb: '/assets/modelos/sala.glb',
    zona: { min: [-13, -4.5, -34.75], max: [13, 20, -15.2] },
  },
  {
    id: 'palco',
    nome: 'Palco',
    glb: '/assets/modelos/palco.glb',
    zona: { min: [-12, -1, -59.43], max: [12, 32, -34.75] },
  },
]

/** primeiro espaço cuja zona contém o ponto (ordem do manifest desempata) */
export function espacoEm(p: { x: number; y: number; z: number }): EspacoId | null {
  for (const e of ESPACOS) {
    const { min, max } = e.zona
    if (
      p.x >= min[0] && p.x <= max[0] &&
      p.y >= min[1] && p.y <= max[1] &&
      p.z >= min[2] && p.z <= max[2]
    ) {
      return e.id
    }
  }
  return null
}
