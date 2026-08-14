import { RigidBody } from '@react-three/rapier'

// Cenário de calibração da fatia 1 (spec §9.1): chão, paredes para deslizar,
// escada de degraus reais, o degrau de 0,25 que DEVE subir e o bloco de 0,50
// que DEVE barrar. Cores sólidas por elemento = debug visual de graça.

type CaixaProps = {
  posicao: [number, number, number]
  tamanho: [number, number, number]
  cor: string
}

function Caixa({ posicao, tamanho, cor }: CaixaProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={posicao}>
      <mesh>
        <boxGeometry args={tamanho} />
        <meshStandardMaterial color={cor} />
      </mesh>
    </RigidBody>
  )
}

const ALTURA_DEGRAU = 0.18
const PROFUNDIDADE_DEGRAU = 0.3

export function CenarioTeste() {
  return (
    <>
      {/* chão 40×40, face superior em y=0 */}
      <Caixa posicao={[0, -0.1, 0]} tamanho={[40, 0.2, 40]} cor="#5a5a62" />

      {/* paredes para testar o deslizamento */}
      <Caixa posicao={[-8, 1.5, -2]} tamanho={[0.3, 3, 16]} cor="#8a8a92" />
      <Caixa posicao={[0, 1.5, 8]} tamanho={[16.3, 3, 0.3]} cor="#8a8a92" />

      {/* escada de 3 degraus reais (0,18 m) subindo para -z, com patamar */}
      {[0, 1, 2].map((i) => (
        <Caixa
          key={i}
          posicao={[-4, (i + 0.5) * ALTURA_DEGRAU, -3 - i * PROFUNDIDADE_DEGRAU]}
          tamanho={[2, (i + 1) * ALTURA_DEGRAU, PROFUNDIDADE_DEGRAU]}
          cor="#4a7fb5"
        />
      ))}
      <Caixa posicao={[-4, (3 * ALTURA_DEGRAU) / 2, -4.9]} tamanho={[2, 3 * ALTURA_DEGRAU, 2]} cor="#4a7fb5" />

      {/* degrau único de 0,25 — o autostep TEM que subir */}
      <Caixa posicao={[0, 0.125, -4]} tamanho={[2, 0.25, 1]} cor="#4f9d63" />

      {/* bloco de 0,50 — o autostep TEM que barrar */}
      <Caixa posicao={[4, 0.25, -4]} tamanho={[2, 0.5, 1]} cor="#b5524a" />
    </>
  )
}
