import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { ESPACOS, type Espaco } from '../dados/espacos'

function EspacoGreybox({ espaco }: { espaco: Espaco }) {
  const { scene } = useGLTF(espaco.glb)
  return <primitive object={scene} />
}

for (const e of ESPACOS) useGLTF.preload(e.glb)

export function CenaTeatro() {
  return (
    <>
      {ESPACOS.map((e) => (
        <EspacoGreybox key={e.id} espaco={e} />
      ))}
      {/* chão plano provisório da fatia 3 — sai na fatia 4 (colisão trimesh).
          includeInvisible: sem ele o rapier ignora mesh com visible=false */}
      <RigidBody type="fixed" colliders="cuboid" includeInvisible>
        <mesh position={[0, -0.11, -25]} visible={false}>
          <boxGeometry args={[60, 0.2, 90]} />
        </mesh>
      </RigidBody>
    </>
  )
}
