// Otimiza os .glb crus exportados do Blender (ferramentas/blender/export/)
// para public/assets/modelos/, com relatório de tamanho — spec Fase 0 §4.
import { execSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ORIGEM = resolve('ferramentas/blender/export')
const DESTINO = resolve('public/assets/modelos')

mkdirSync(DESTINO, { recursive: true })

const arquivos = readdirSync(ORIGEM).filter((a) => a.endsWith('.glb'))
if (arquivos.length === 0) {
  console.error(`nenhum .glb em ${ORIGEM} — rode primeiro o export do Blender (npm run assets)`)
  process.exit(1)
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`
let totalDepois = 0

for (const arquivo of arquivos) {
  const entrada = join(ORIGEM, arquivo)
  const saida = join(DESTINO, arquivo)
  // Sem compressão nem quantização: KHR_mesh_quantization quebra a geração de
  // colliders trimesh do rapier (ele lê o array de posições cru). O greybox é
  // minúsculo e o gzip da Vercel resolve; reavaliar quando houver asset denso.
  // --join false: fundir malhas destruiria os extras de colisão por objeto
  execSync(
    `npx gltf-transform optimize "${entrada}" "${saida}" --compress false --simplify false --join false --texture-compress false`,
    {
    stdio: ['ignore', 'ignore', 'inherit'],
  })
  const antes = statSync(entrada).size
  const depois = statSync(saida).size
  totalDepois += depois
  console.log(`${arquivo}: ${kb(antes)} → ${kb(depois)}`)
}

console.log(`total otimizado: ${kb(totalDepois)}`)
