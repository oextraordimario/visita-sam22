// Convenções da spec da Fase 0 (§2.4): 1 unidade = 1 m, Y para cima.

export const ALTURA_CAMERA = 1.65
export const RAIO_CAPSULA = 0.3
export const ALTURA_CAPSULA = 1.8
// CapsuleCollider recebe a meia-altura do cilindro central (sem as calotas)
export const MEIA_ALTURA_CILINDRO = ALTURA_CAPSULA / 2 - RAIO_CAPSULA
// câmera fica acima do centro da cápsula, a 1,65 m do chão
export const OFFSET_CAMERA = ALTURA_CAMERA - ALTURA_CAPSULA / 2

export const VEL_ANDAR = 6
export const VEL_ACELERADA = 9
export const DEGRAU_MAX = 0.26 // 0,25 do critério de teste + margem numérica
export const GRAVIDADE = -9.81

export const SPAWN: [number, number, number] = [0, ALTURA_CAPSULA / 2 + 0.05, 4]
