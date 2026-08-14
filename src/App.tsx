import { Suspense, lazy, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { CenaTeatro } from './cenas/CenaTeatro'
import { useJogador } from './estado/jogador'
import { ALTURA_CAMERA } from './jogador/constantes'
import { poseDebug, type PoseDebug } from './jogador/debug'
import { Jogador } from './jogador/Jogador'
import { HudDebug } from './ui/HudDebug'

function CameraDebug({ pose }: { pose: PoseDebug }) {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.position.set(...pose.cam)
    camera.lookAt(...pose.alvo)
  }, [camera, pose])
  return null
}

const DEBUG = typeof window !== 'undefined' ? poseDebug() : null

// r3f-perf só em dev: fora do bundle de produção via import dinâmico
const Perf = lazy(() => import('r3f-perf').then((m) => ({ default: m.Perf })))

export default function App() {
  const travado = useJogador((s) => s.travado)

  return (
    <>
      <Canvas camera={{ fov: 75, near: 0.1, far: 200, position: [0, ALTURA_CAMERA, 4] }}>
        <color attach="background" args={['#181820']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[8, 12, 6]} intensity={1.2} />
        {import.meta.env.DEV && (
          <Suspense fallback={null}>
            <Perf position="top-left" />
          </Suspense>
        )}
        <Suspense fallback={null}>
          <Physics>
            <CenaTeatro />
            {DEBUG ? <CameraDebug pose={DEBUG} /> : <Jogador />}
          </Physics>
        </Suspense>
      </Canvas>
      <HudDebug />
      {!travado && (
        <div className="overlay">
          <div className="overlay-caixa">
            <h1>visita-sam22 — cenário de teste</h1>
            <p>Clique para entrar</p>
            <p className="overlay-teclas">WASD anda · Shift acelera · mouse olha · ESC solta</p>
            <p className="overlay-teclas">V sandbox (voa e atravessa paredes) · Space sobe · C desce</p>
          </div>
        </div>
      )}
    </>
  )
}
