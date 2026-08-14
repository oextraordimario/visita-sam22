import { create } from 'zustand'
import type { EspacoId } from '../dados/espacos'

type EstadoJogador = {
  /** pointer lock ativo — controla o overlay de instruções */
  travado: boolean
  setTravado: (v: boolean) => void
  /** espaço do teatro em que o jogador está (zonas do manifest) */
  espacoAtivo: EspacoId | null
  setEspacoAtivo: (e: EspacoId | null) => void
}

export const useJogador = create<EstadoJogador>((set) => ({
  travado: false,
  setTravado: (v) => set({ travado: v }),
  espacoAtivo: 'saguao',
  setEspacoAtivo: (e) => set({ espacoAtivo: e }),
}))
