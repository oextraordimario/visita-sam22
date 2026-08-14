// Câmera fixa de inspeção via query string, para capturas e depuração:
//   ?cam=x,y,z&alvo=x,y,z
// Com `cam` presente o Jogador não é montado e a câmera fica parada.

export type PoseDebug = { cam: [number, number, number]; alvo: [number, number, number] }

function tripla(valor: string | null): [number, number, number] | null {
  if (!valor) return null
  const n = valor.split(',').map(Number)
  if (n.length !== 3 || n.some(Number.isNaN)) return null
  return [n[0], n[1], n[2]]
}

export function poseDebug(): PoseDebug | null {
  const q = new URLSearchParams(window.location.search)
  const cam = tripla(q.get('cam'))
  if (!cam) return null
  return { cam, alvo: tripla(q.get('alvo')) ?? [0, 1.65, -20] }
}
