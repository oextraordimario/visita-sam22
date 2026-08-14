import { useEffect, useRef } from 'react'

// Estado das teclas físicas pressionadas, por trás de uma interface única —
// o controlador lê o Set, nunca o DOM (spec §5: input não casa com teclado).
export function useTeclas() {
  const pressionadas = useRef(new Set<string>())

  useEffect(() => {
    const desce = (e: KeyboardEvent) => pressionadas.current.add(e.code)
    const sobe = (e: KeyboardEvent) => pressionadas.current.delete(e.code)
    // perder o foco (alt-tab, ESC do pointer lock) solta tudo — senão o
    // jogador continua andando sozinho com keyup que nunca chegou
    const limpa = () => pressionadas.current.clear()

    window.addEventListener('keydown', desce)
    window.addEventListener('keyup', sobe)
    window.addEventListener('blur', limpa)
    return () => {
      window.removeEventListener('keydown', desce)
      window.removeEventListener('keyup', sobe)
      window.removeEventListener('blur', limpa)
    }
  }, [])

  return pressionadas
}
