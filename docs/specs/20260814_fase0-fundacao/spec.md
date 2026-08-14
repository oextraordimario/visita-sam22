# Spec — Fase 0: fundação técnica e greybox andável

**Data:** 2026-08-14
**Status:** **PROPOSTA** — aguardando execução. As decisões de rumo estão na §12.
**Base:** [PRD v0.3](../../PRD.md) (§6 abordagem técnica, §9 roadmap) e [pesquisa §5](../../pesquisa-sam-1922.md) (o Theatro em 1922).
**Escopo herdado do PRD:** "definir direção de arte com concepts; greybox do teatro (5 espaços) com controlador FPS andável no navegador. *Critério: andar do saguão à plateia com 60 fps.*"

Esta é a primeira spec do projeto; além da Fase 0, ela **fixa o padrão de projeto** (stack, convenções, pipeline de assets) que as próximas fases herdam. Specs futuras seguem este formato, em `docs/specs/AAAAMMDD_nome/spec.md`.

---

## 0. O pedido

Sair do repositório vazio para um esqueleto onde tudo que vem depois (exposição, fichas, cenas dirigidas) é conteúdo, não infraestrutura. Concretamente, ao fim da Fase 0:

1. `npm run dev` abre no navegador um **greybox dos 5 espaços** do Theatro Municipal (saguão, escadaria nobre, salão nobre, sala de espetáculos, palco) em escala real documentada;
2. o visitante **anda em primeira pessoa** (WASD + mouse, pointer lock), sobe a escadaria, entra na sala e chega à plateia — sem atravessar parede nem cair do mundo;
3. isso roda a **60 fps em GPU integrada** (Iris Xe como referência), medido e não presumido;
4. o deploy na Vercel funciona a cada push;
5. existe um documento de **direção de arte** com concepts que calibram "estilizado" (decisão do PRD §6.1) antes de qualquer asset definitivo.

## 1. O que existe hoje (medido, não suposto)

### 1.1 O repositório

Zero código. `main` tem `README.md` (2 linhas), `docs/` (PRD, pesquisa, catálogo transcrito) e nada mais — nem `package.json`, nem `.gitignore`, nem CI. Tudo desta spec é aditivo; nada a migrar, nada a quebrar. É também a única janela em que definir convenção custa zero.

### 1.2 O que a pesquisa dá de dimensão (e o que falta)

**Medidas confirmadas** (ficha técnica oficial do TMSP, PDF):

| elemento | medida |
|---|---|
| boca de cena | 12,50 m (L) × 7,00 m (A) |
| profundidade de palco | 24,68 m |
| urdimento | 25 m |
| proscênio curvo | 4 m |
| sala | ferradura à italiana, ~1.523–1.580 lugares (frisas, camarotes, balcões, galeria) |

**Sem medida confirmada:** saguão, escadaria nobre e salão nobre. O que existe para derivá-las: o modelo 3D do **exterior** no Sketchfab (GeoHereditas/USP, download gratuito — licença exata **não verificada ainda**), que dá o envelope do edifício; o tour virtual 360° oficial; as ~6.000 fotos do acervo NAP; e a organização em quatro corpos (fachada com vestíbulo/escadaria → sala → palco → camarins) documentada na pesquisa §5.1. A fatia 2 (§9) transforma isso em cotas escritas — **estimadas e assumidas como estimadas**, com fonte por cota.

**Diferença 1922 documentada e que o greybox já respeita:** camarotes de proscênio existem, órgão não (pesquisa §5.3). É mais barato nascer certo do que remodelar a boca de cena depois.

### 1.3 Restrições que o PRD já fixou (não se rediscutem aqui)

Three.js + React Three Fiber; assets glTF+Draco/meshopt e texturas KTX2; streaming por espaço com alvo de < 25 MB até a primeira interação; deploy estático na Vercel; direção de arte estilizada; orçamento de ~150k triângulos visíveis por cena; 60 fps em notebook integrado.

---

## 2. Scaffold e convenções (o padrão de projeto)

### 2.1 Ferramentas

| camada | escolha | por quê |
|---|---|---|
| bundler/dev server | **Vite** | site estático sem SSR; Next só traria peso de framework de rotas para um app de uma página (decisão D1, §12) |
| linguagem | **TypeScript, `strict`** | cena 3D é um grafo de objetos tipáveis; erro de unidade/props é o bug mais barato de pegar em compile (D2) |
| 3D | `three` + `@react-three/fiber` + `@react-three/drei` | PRD §6 |
| física/colisão | `@react-three/rapier` | character controller pronto com autostep (escadaria) e snap-to-ground (D6, §5) |
| estado | `zustand` | mínimo viável; um store por domínio (jogador, espaço ativo, config) |
| qualidade | ESLint + Prettier + `tsc --noEmit`, agregados em `npm run check` | roda no build da Vercel: push que não compila não deploya |
| testes | `vitest` para lógica pura | render 3D não se testa por unidade; o critério de fps se mede no navegador (§10) |

Versões exatas se pinam na implementação (fatia 1), não aqui.

### 2.2 Layout do repositório

```
src/
  jogador/       # controlador FPS, câmera, input
  cenas/         # um módulo por espaço: saguao, escadaria, foyer, sala, palco
  estado/        # stores zustand
  ui/            # HUD, menus, telas (React puro, fora do canvas)
  dados/         # manifests e (futuro) fichas de obras
public/assets/
  modelos/       # .glb otimizados (saída do pipeline, §4)
  texturas/      # .ktx2
docs/specs/      # specs como esta
ferramentas/     # scripts de pipeline (gltf-transform etc.)
```

### 2.3 Convenções de código

- **Domínio em PT-BR, plataforma em inglês** — `jogador`, `espacoAtivo`, `IrParaEspaco`; mas `useFrame`, `RigidBody` como as libs mandam. Consistente com o padrão dos outros projetos do autor (D3).
- Arquivos `kebab-case.ts`; componentes React `PascalCase.tsx`; um componente exportado por arquivo de componente.
- Comentários e mensagens de commit em PT-BR.
- Sem abstração especulativa: a primeira versão de qualquer sistema é a mais burra que passa no critério da fatia.

### 2.4 Unidades e eixos (a convenção mais cara de errar)

- **1 unidade = 1 metro.** Sempre. Cota estimada carrega comentário com a fonte.
- **Y para cima** (padrão glTF/three). O Blender exporta convertendo sozinho.
- **Origem do mundo:** centro do saguão, no nível do piso térreo (y=0).
- **−Z é o eixo longitudinal do teatro**, apontando do saguão para o palco. Andar "para dentro" é andar em −Z.
- Alturas de referência do jogador: câmera a **1,65 m**; cápsula r=0,30 m, altura 1,80 m; caminhada 2,0 m/s, passo acelerado (Shift) 4,0 m/s.

---

## 3. O greybox — onde nasce e como é

### 3.1 As três formas de fazer blockout, e por que Blender ganha

| # | como | veredito |
|---|---|---|
| A | geometria em código (boxes/extrusões no R3F) | **não**: a ferradura da sala, os 4 lances da escadaria e os balcões viram trigonometria em JSX; iterar cota vira editar número cego |
| B | **blockout no Blender → glTF** | **sim**: cota se edita vendo; e o pipeline de export/otimização nasce agora, idêntico ao que os assets finais usarão — a Fase 1 troca o conteúdo, não o cano |
| C | importar plantas CAD | não existem plantas vetoriais disponíveis (§1.2) |

### 3.2 Um arquivo-fonte, cinco cenas exportadas

- `ferramentas/blender/theatro-greybox.blend` — **fonte única**, versionada no repo (greybox é leve; se passar de ~50 MB, migra para LFS — registrar quando acontecer).
- Uma **Collection** por espaço, exportada para `public/assets/modelos/<espaco>.glb` (5 arquivos). O corte por espaço é a unidade de streaming do PRD; a Fase 0 pode até carregar os cinco juntos (greybox soma poucos MB), mas o **manifest por espaço já existe** (`src/dados/espacos.ts`: id, glb, ponto de spawn, portais).
- Malha de colisão = a própria malha do greybox (é tudo caixa e rampa). Quando os assets finais chegarem, colisão vira malha separada simplificada — o manifest já prevê o campo.
- Nomenclatura de objetos no Blender: `<espaco>_<coisa>` (`sala_balcao-1`, `escadaria_lance-2`) — é o que aparece no inspetor e nos logs.

### 3.3 O que cada espaço precisa ter (e nada além)

| espaço | conteúdo mínimo do greybox |
|---|---|
| saguão | piso, paredes, pé-direito, vãos de porta (entrada e acessos à escadaria); **volumes-fantasma nas posições das ~100 obras** (caixas numeradas 1–19/1–17/1–64 conforme o catálogo transcrito) — de graça agora, e vira o gabarito da expografia da Fase 1 |
| escadaria | lances e patamares com **degraus reais** (não rampa disfarçada: é o teste do autostep), guarda-corpo como parede baixa |
| salão nobre | piso, paredes, vãos |
| sala | ferradura: plateia com rake (piso inclinado), frisas/camarotes como prateleiras (sem cadeiras), balcões e galeria, **camarotes de proscênio presentes** |
| palco | proscênio curvo de 4 m, boca 12,5×7, caixa cênica na profundidade real |

Sem cadeiras, sem ornamento, sem material além de cinza com **cor sólida por espaço** (debug de "onde estou" de graça).

---

## 4. Pipeline de assets

`ferramentas/otimizar-glb.mjs` (roda `gltf-transform`): dedup → prune → draco (ou meshopt — medir os dois na fatia 3 e fixar um) → relatório de tamanho por arquivo. Chamado por `npm run assets`, que é pré-requisito documentado do build. Texturas ainda não existem na Fase 0; quando existirem, entra o passo KTX2 no mesmo script. O `.blend` é fonte; o `.glb` otimizado é artefato **commitado** (deploy estático não roda Blender).

---

## 5. O controlador FPS

- `PointerLockControls` (drei) para o mouse; input WASD lido por listener próprio (não `KeyboardControls` da drei — o mapa de teclas vai crescer com interação/UI e fica em `src/jogador/teclas.ts`).
- Corpo: cápsula cinemática com o **`KinematicCharacterController` do rapier** — `autostep` (degrau ≤ 0,25 m) para a escadaria, `snapToGround` para não "voar" descendo, `slideEnabled` nas paredes. Gravidade fixa; sem pulo (não faz sentido no produto e elimina uma classe de bugs).
- Alternativa descartada: `ecctrl` (pmndrs) — resolve terceira pessoa e traz física dinâmica que não precisamos; o controller cinemático do rapier é o caminho estreito (D6).
- Spawn e portais vêm do manifest (§3.2). Na Fase 0, "portal" é só um trigger que troca o `espacoAtivo` no store (para o HUD de debug dizer onde o jogador está) — sem porta, sem loading.
- Fallback mobile e acessibilidade (teleporte) ficam para a Fase 4, como no PRD; mas o input já nasce atrás de uma interface (`src/jogador/input.ts`) para não casar o controlador com teclado.

---

## 6. Renderização e orçamento de performance

- **WebGL2** via renderer padrão do three (D5). WebGPU se reavalia quando houver ganho concreto a medir; a Fase 0 não pode depender de driver novo em notebook de estudante.
- Luz na Fase 0: uma ambiente + uma direcional, **sem sombras dinâmicas**. Iluminação de verdade (baked, tungstênio 1922) é assunto da Fase 1 com os assets reais.
- `@react-three/postprocessing` fica **fora** da Fase 0.
- Orçamento do greybox (folga proposital sobre o teto de 150k do PRD): **≤ 60k triângulos** somando os 5 espaços, **≤ 100 draw calls** na pior vista (da plateia, olhando a ferradura).
- Instrumentação: `r3f-perf` só em dev (atrás de `import.meta.env.DEV`); contadores de draw call/triângulo visíveis no HUD de debug.

---

## 7. Deploy e CI

- Vercel, projeto `visita-sam22`, build `npm run check && npm run build` — o typecheck barrando deploy **é** o CI da Fase 0; GitHub Actions só se aparecer necessidade que a Vercel não cobre.
- Preview deployment por branch/PR (padrão Vercel), produção na `main`.
- PostHog (PRD §6) **não entra na Fase 0** — instrumentar greybox é medir ninguém; entra na Fase 1 junto do primeiro conteúdo público.

---

## 8. Direção de arte (a fatia não-código)

Entregável: `docs/direcao-de-arte.md` + 2–3 concepts do **saguão com a exposição** (o espaço que define o produto), gerados/curados o suficiente para decidir:

1. o **grau** de estilização (low-poly facetado ↔ pintura/gouache com contorno) — "estilizado" do PRD ainda é um intervalo, não um ponto;
2. paleta de época (tungstênio quente, veludo, mármore) e como ela sobrevive à decisão de tema claro/escuro da UI;
3. como uma **reprodução fiel emoldurada** convive com o mundo estilizado sem parecer bug — é a promessa do PRD §6.1 e ninguém ainda a viu.

O documento registra o que foi rejeitado e por quê (mesmo formato das decisões desta spec). Sem asset de produção nesta fase.

---

## 9. Ordem de implementação (cada fatia sozinha em pé)

1. **Scaffold andável** — Vite+TS+R3F, controlador FPS completo (§5) andando num chão-caixa com duas paredes e três degraus de teste; `npm run check`; deploy na Vercel funcionando. *Critério: URL pública onde se anda e se sobe degrau.*
2. **Cotas** — `docs/specs/20260814_fase0-fundacao/cotas.md`: tabela de dimensões por espaço com fonte por cota (ficha técnica / derivada do envelope Sketchfab / estimada por foto), + verificação da **licença do modelo Sketchfab** antes de usá-lo até como referência de envelope. *Critério: toda medida que a fatia 3 usa existe aqui primeiro.*
3. **Greybox no Blender** — os 5 espaços (§3.3), export + pipeline `npm run assets` (§4), carregado estático no app. Sem colisão fina ainda: chão plano provisório. *Critério: os 5 espaços visíveis e com escala crível contra a câmera a 1,65 m.*
4. **Colisão e circulação** — colisão pelas malhas do greybox, spawn no saguão, autostep calibrado na escadaria real, portais/`espacoAtivo`, HUD de debug (espaço atual, fps, draw calls). *Critério: o percurso saguão → escadaria → sala → plateia sem atravessar nada e sem engasgo.*
5. **Medição do critério da fase** — protocolo da §10 executado na Iris Xe; se falhar, otimizar até passar (o orçamento da §6 dá margem de sobra — falhar aqui indica bug, não peso). *Critério: o número do PRD, medido e registrado no fim desta spec.*
6. **Direção de arte** (§8) — paralela às fatias 2–5, não bloqueia nem é bloqueada. *Critério: decisão de estilo registrada com concepts.*

## 10. Plano de teste

**`vitest`** (lógica pura, nasce na fatia 1 e cresce): mapa de teclas → vetor de movimento (combinações, soltar tecla, foco perdido); manifest de espaços (todo espaço tem glb, spawn e portais válidos; portais apontam para ids existentes); utilitários de unidade.

**No navegador, por fatia** (checklist manual, é um jogo): pointer lock entra e sai limpo (ESC); degrau de 0,25 sobe, parede de 0,5 barra; descer a escadaria sem descolar do chão; colidir de raspão com quina de camarote não prende o jogador; recarregar a página no meio do percurso não quebra o spawn.

**O critério da fase** (fatia 5): build de produção (`npm run build && vite preview`), Iris Xe, janela 1080p: percorrer saguão → plateia 3×, gravando com o profiler do Chrome. Passa se **p95 do frame time ≤ 16,6 ms** no percurso inteiro. Registrar também o total transferido (alvo da fase: **≤ 5 MB** — greybox tem que ficar muito abaixo dos 25 MB do PRD, senão o orçamento da Fase 1 já nasceu estourado).

## 11. Riscos

| risco | tamanho | resposta |
|---|---|---|
| cotas estimadas erradas → retrabalho de greybox | médio, esperado | fatia 2 separa estimar de modelar; cota tem fonte; `.blend` é fonte única — corrigir cota é mexer num lugar |
| escadaria × character controller (autostep) é o clássico lugar onde FPS web engasga | médio | degraus reais desde a fatia 1 (os três degraus de teste existem antes do teatro); calibração é critério da fatia 4 |
| licença do modelo Sketchfab não permitir o uso pretendido | baixo | verificação é tarefa explícita da fatia 2, **antes** de qualquer derivação |
| ferradura da sala estourar draw calls mesmo em greybox | baixo | orçamento §6 medido no HUD desde a fatia 4; camarote é módulo repetido → instância |
| "estilizado" virar discussão infinita sem referência concreta | baixo | fatia 6 força a decisão com concepts datados e registro do que foi rejeitado |

## 12. Decisões registradas (não são perguntas)

**D1 — Vite, não Next.** O produto é um app 3D de página única com deploy estático; SSR/rotas de servidor não compram nada aqui e o dev server do Vite é o mais curto caminho até o canvas. Se um dia houver páginas de conteúdo indexáveis (fichas fora do 3D), a decisão se rediscute com esse fato na mesa.

**D2 — TypeScript estrito.** O custo é pagar tipos na fronteira das libs (todas tipadas); o ganho é a classe inteira de bugs de props/unidades morta em compile. Num projeto de um dev com IA, o compilador é o segundo revisor.

**D3 — Domínio em PT-BR.** O produto, a pesquisa e o autor operam em PT-BR; o precedente do raspador_eventos funciona. Termos de plataforma ficam em inglês — `jogadorStore` sim, `playerStore` não, `useFrame` como é.

**D4 — Greybox no Blender, não em código** (§3.1). O argumento decisivo não é conforto: é que o pipeline Blender→glTF→otimização→app nasce na Fase 0 idêntico ao definitivo, então a Fase 1 troca conteúdo sem trocar cano.

**D5 — WebGL2 agora.** O público-alvo inclui notebook de estudante; WebGPU entra quando tiver ganho medido num benefício que WebGL2 não entrega, não por novidade.

**D6 — Colisão cinemática (rapier KinematicCharacterController), sem física dinâmica e sem pulo.** Walking sim não precisa de corpo dinâmico, e cada grau de liberdade a menos é uma classe de bug a menos no lugar mais sensível do produto (o corpo do jogador).

## 13. Fora de escopo (Fase 0 não toca)

- Obras, fichas, personagens, áudio, NPCs, texto na tela — Fase 1+.
- Iluminação baked, materiais finais, pós-processamento.
- Mobile, acessibilidade de locomoção (teleporte), i18n — Fase 4 / pós-v1.
- PostHog (entra na Fase 1).
- Estrutura de dados das fichas de obra (o manifest de espaços da §3.2 não tenta antecipá-la).

---

*(§14 — "O que a execução mudou" — será escrita quando a fase rodar, no padrão da spec de referência.)*
