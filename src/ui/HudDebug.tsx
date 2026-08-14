import { ESPACOS } from '../dados/espacos'
import { useJogador } from '../estado/jogador'

// HUD da Fase 0: onde o jogador está (fps e draw calls vêm do r3f-perf em dev)
export function HudDebug() {
  const espacoAtivo = useJogador((s) => s.espacoAtivo)
  const nome = ESPACOS.find((e) => e.id === espacoAtivo)?.nome ?? '—'
  return <div className="hud-espaco">{nome}</div>
}
