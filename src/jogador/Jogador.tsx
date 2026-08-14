import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import {
  CapsuleCollider,
  RigidBody,
  useRapier,
  type RapierCollider,
  type RapierRigidBody,
} from '@react-three/rapier'
import { useJogador } from '../estado/jogador'
import {
  DEGRAU_MAX,
  GRAVIDADE,
  MEIA_ALTURA_CILINDRO,
  OFFSET_CAMERA,
  RAIO_CAPSULA,
  SPAWN,
  VEL_ACELERADA,
  VEL_ANDAR,
} from './constantes'
import { useTeclas } from './input'
import { vetorMovimento } from './teclas'

const CIMA = new THREE.Vector3(0, 1, 0)

// pré-alocados: useFrame roda 60x/s, aqui não se cria objeto
const dirFrente = new THREE.Vector3()
const dirDireita = new THREE.Vector3()
const desloc = new THREE.Vector3()

export function Jogador() {
  const corpoRef = useRef<RapierRigidBody>(null)
  const colisorRef = useRef<RapierCollider>(null)
  const velY = useRef(0)
  const teclas = useTeclas()
  const camera = useThree((s) => s.camera)
  const { world } = useRapier()
  const setTravado = useJogador((s) => s.setTravado)

  const controlador = useRef<ReturnType<typeof world.createCharacterController>>(null)
  useEffect(() => {
    const c = world.createCharacterController(0.02)
    c.enableAutostep(DEGRAU_MAX, 0.05, true)
    c.enableSnapToGround(0.3)
    controlador.current = c
    return () => {
      controlador.current = null
      world.removeCharacterController(c)
    }
  }, [world])

  useFrame((_, delta) => {
    const corpo = corpoRef.current
    const colisor = colisorRef.current
    const ctrl = controlador.current
    if (!corpo || !colisor || !ctrl) return

    // trava o passo em recuperação de aba parada: dt gigante teleporta
    const dt = Math.min(delta, 0.05)
    const { x, z, acelerado } = vetorMovimento(teclas.current)
    const vel = acelerado ? VEL_ACELERADA : VEL_ANDAR

    camera.getWorldDirection(dirFrente)
    dirFrente.y = 0
    dirFrente.normalize()
    dirDireita.crossVectors(dirFrente, CIMA) // frente × cima = direita (Y-up, mão direita)

    velY.current += GRAVIDADE * dt
    desloc
      .set(0, velY.current * dt, 0)
      .addScaledVector(dirFrente, z * vel * dt)
      .addScaledVector(dirDireita, x * vel * dt)

    ctrl.computeColliderMovement(colisor, desloc)
    const mov = ctrl.computedMovement()
    const pos = corpo.translation()
    corpo.setNextKinematicTranslation({
      x: pos.x + mov.x,
      y: pos.y + mov.y,
      z: pos.z + mov.z,
    })
    if (ctrl.computedGrounded()) velY.current = 0

    camera.position.set(pos.x + mov.x, pos.y + mov.y + OFFSET_CAMERA, pos.z + mov.z)
  })

  return (
    <>
      <PointerLockControls onLock={() => setTravado(true)} onUnlock={() => setTravado(false)} />
      <RigidBody
        ref={corpoRef}
        type="kinematicPosition"
        colliders={false}
        position={SPAWN}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider ref={colisorRef} args={[MEIA_ALTURA_CILINDRO, RAIO_CAPSULA]} />
      </RigidBody>
    </>
  )
}
