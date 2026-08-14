// Roda o Blender headless para gerar o greybox e exportar os .glb crus.
// O caminho do executável pode ser sobrescrito com a env BLENDER_EXE.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const BLENDER =
  process.env.BLENDER_EXE ?? 'C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe'

if (!existsSync(BLENDER)) {
  console.error(`Blender não encontrado em "${BLENDER}" — defina a env BLENDER_EXE`)
  process.exit(1)
}

const script = resolve('ferramentas/blender/gerar_greybox.py')
const saida = execFileSync(BLENDER, ['--background', '--python', script], { encoding: 'utf8' })

const oks = saida.split('\n').filter((l) => l.startsWith('EXPORT_OK') || l.startsWith('BLEND_OK'))
console.log(oks.join('\n'))
if (!saida.includes('BLEND_OK') || oks.length < 6) {
  console.error('export incompleto — saída completa do Blender:')
  console.error(saida)
  process.exit(1)
}
