import { create } from 'zustand'

type EstadoJogador = {
  /** pointer lock ativo — controla o overlay de instruções */
  travado: boolean
  setTravado: (v: boolean) => void
}

export const useJogador = create<EstadoJogador>((set) => ({
  travado: false,
  setTravado: (v) => set({ travado: v }),
}))
