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
import { espacoEm } from '../dados/espacos'
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
  VEL_VOO,
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
  const { world, rapier } = useRapier()
  useEffect(() => {
    // canal de depuração: sondas de física nos testes automatizados
    Object.assign(window as object, { __mundo: world, __rapier: rapier })
  }, [world, rapier])
  const setTravado = useJogador((s) => s.setTravado)
  const setEspacoAtivo = useJogador((s) => s.setEspacoAtivo)
  const sandbox = useJogador((s) => s.sandbox)
  const alternarSandbox = useJogador((s) => s.alternarSandbox)
  const espacoAnterior = useRef<string | null>('saguao')

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.code === 'KeyV' && !e.repeat) alternarSandbox()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [alternarSandbox])

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

    camera.getWorldDirection(dirFrente)
    if (!sandbox) {
      dirFrente.y = 0 // no chão o olhar pra cima/baixo não muda o rumo; voando muda
      dirFrente.normalize()
    }
    dirDireita.crossVectors(dirFrente, CIMA).normalize() // frente × cima = direita (Y-up, mão direita)

    let mov: { x: number; y: number; z: number }
    if (sandbox) {
      // voo livre: sem gravidade e sem character controller — o corpo
      // cinemático é reposicionado direto, então atravessa qualquer colisor
      const vel = acelerado ? 2 * VEL_VOO : VEL_VOO
      const sobe = (teclas.current.has('Space') ? 1 : 0) - (teclas.current.has('KeyC') ? 1 : 0)
      velY.current = 0 // sair do sandbox começa a queda do zero
      mov = desloc
        .set(0, sobe * vel * dt, 0)
        .addScaledVector(dirFrente, z * vel * dt)
        .addScaledVector(dirDireita, x * vel * dt)
    } else {
      const vel = acelerado ? VEL_ACELERADA : VEL_ANDAR
      velY.current += GRAVIDADE * dt
      desloc
        .set(0, velY.current * dt, 0)
        .addScaledVector(dirFrente, z * vel * dt)
        .addScaledVector(dirDireita, x * vel * dt)
      ctrl.computeColliderMovement(colisor, desloc)
      mov = ctrl.computedMovement()
      if (ctrl.computedGrounded()) velY.current = 0
    }
    const pos = corpo.translation()
    corpo.setNextKinematicTranslation({
      x: pos.x + mov.x,
      y: pos.y + mov.y,
      z: pos.z + mov.z,
    })

    camera.position.set(pos.x + mov.x, pos.y + mov.y + OFFSET_CAMERA, pos.z + mov.z)

    const posNova = { x: pos.x + mov.x, y: pos.y + mov.y, z: pos.z + mov.z }
    const espaco = espacoEm(posNova)
    if (espaco !== espacoAnterior.current) {
      espacoAnterior.current = espaco
      setEspacoAtivo(espaco)
    }
    // canal de depuração para testes automatizados (Playwright lê via evaluate)
    ;(window as unknown as { __jogadorPos: typeof posNova }).__jogadorPos = posNova
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
