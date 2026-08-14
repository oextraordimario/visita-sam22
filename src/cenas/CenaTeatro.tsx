import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import {
  ConvexHullCollider,
  CuboidCollider,
  RigidBody,
  TrimeshCollider,
} from '@react-three/rapier'
import { ESPACOS, type Espaco } from '../dados/espacos'

// Colisão por forma, guiada pelos extras que o gerar_greybox.py grava em cada
// objeto: caixas viram cuboides convexos (trimesh de piso prende a cápsula do
// character controller em arestas internas), o rake vira convex hull e só as
// superfícies curvas (côncavas) ficam como trimesh.
type Colisor =
  | { tipo: 'caixa'; chave: string; centro: [number, number, number]; meio: [number, number, number] }
  | { tipo: 'casco'; chave: string; verts: Float32Array }
  | { tipo: 'trimesh'; chave: string; verts: Float32Array; indices: Uint32Array }

function posicoes(mesh: THREE.Mesh): Float32Array {
  // getX/getY/getZ: os atributos do glb vêm intercalados; ler `.array` cru mistura normal e posição
  const attr = mesh.geometry.attributes.position
  const verts = new Float32Array(attr.count * 3)
  for (let i = 0; i < attr.count; i++) {
    verts[3 * i] = attr.getX(i)
    verts[3 * i + 1] = attr.getY(i)
    verts[3 * i + 2] = attr.getZ(i)
  }
  return verts
}

function extrairColisores(cena: THREE.Object3D): Colisor[] {
  const lista: Colisor[] = []
  cena.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const extras = mesh.userData as { colisao?: string; c_centro?: number[]; c_tam?: number[] }
    if (extras.colisao === 'caixa' && extras.c_centro && extras.c_tam) {
      lista.push({
        tipo: 'caixa',
        chave: mesh.uuid,
        centro: extras.c_centro as [number, number, number],
        meio: [extras.c_tam[0] / 2, extras.c_tam[1] / 2, extras.c_tam[2] / 2],
      })
      return
    }
    if (extras.colisao === 'casco') {
      lista.push({ tipo: 'casco', chave: mesh.uuid, verts: posicoes(mesh) })
      return
    }
    const idx = mesh.geometry.index
    const indices = idx
      ? new Uint32Array(idx.count)
      : new Uint32Array(Array.from({ length: mesh.geometry.attributes.position.count }, (_, i) => i))
    if (idx) for (let i = 0; i < idx.count; i++) indices[i] = idx.getX(i)
    lista.push({ tipo: 'trimesh', chave: mesh.uuid, verts: posicoes(mesh), indices })
  })
  return lista
}

function EspacoGreybox({ espaco }: { espaco: Espaco }) {
  const { scene } = useGLTF(espaco.glb)
  const colisores = useMemo(() => extrairColisores(scene), [scene])

  return (
    <>
      <primitive object={scene} />
      <RigidBody type="fixed" colliders={false}>
        {colisores.map((c) =>
          c.tipo === 'caixa' ? (
            <CuboidCollider key={c.chave} args={c.meio} position={c.centro} />
          ) : c.tipo === 'casco' ? (
            <ConvexHullCollider key={c.chave} args={[c.verts]} />
          ) : (
            <TrimeshCollider key={c.chave} args={[c.verts, c.indices]} />
          ),
        )}
      </RigidBody>
    </>
  )
}

for (const e of ESPACOS) useGLTF.preload(e.glb)

export function CenaTeatro() {
  return (
    <>
      {ESPACOS.map((e) => (
        <EspacoGreybox key={e.id} espaco={e} />
      ))}
    </>
  )
}
