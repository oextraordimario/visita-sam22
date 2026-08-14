# PRD — visita-sam22

> **Produto:** experiência 3D em primeira pessoa, rodando no navegador, que reconstitui a Semana de Arte Moderna de 1922 dentro do Theatro Municipal de São Paulo.
> **Status:** v0.3 (14/08/2026) — todas as decisões de fundação tomadas (resumo em §11). Base histórica em [`pesquisa-sam-1922.md`](./pesquisa-sam-1922.md) e catálogo transcrito em [`catalogo-obras/README.md`](./catalogo-obras/README.md).

---

## 1. Visão

O visitante entra no Theatro Municipal na noite de fevereiro de 1922 e **vive a Semana de Arte Moderna em vez de ler sobre ela**: caminha pelo saguão entre as ~100 obras da exposição, sobe a escadaria onde Mário de Andrade leu sob deboche, senta na plateia para ouvir Villa-Lobos ser vaiado, e presencia a declamação de "Os Sapos" na noite mais barulhenta da história do teatro.

Diferencial em relação a tours virtuais existentes (o Theatro tem um tour 360° oficial): aqui não é o teatro de hoje, é **o teatro de 1922 com o evento acontecendo** — com público, som, reação e contexto. E com honestidade histórica: o produto assume o que é documentado e o que é reconstituição interpretativa (não existem fotos da montagem da exposição), e desmonta mitos em vez de repeti-los (Tarsila não estava lá; o chinelo era um calo).

## 2. Objetivos e não-objetivos

**Objetivos**
1. Tornar a SAM compreensível e memorável através de presença espacial — "eu estava lá".
2. Rigor histórico auditável: cada obra, fala e cena com ficha de fonte; mitos sinalizados como mitos.
3. Rodar em navegador comum (desktop primeiro), sem instalação, com carregamento tolerável em conexão brasileira mediana.
4. Servir como material de apoio para professores de literatura/artes (a SAM é conteúdo fixo de ENEM e vestibulares).

**Não-objetivos (v1)**
- Multiplayer.
- VR/WebXR (arquitetura não deve impedir no futuro, mas não é meta).
- Reconstituir a cidade ao redor do teatro (no máximo uma fachada/entrada cenográfica).
- Fotorrealismo de produção AAA.
- Vozes gravadas ou sintetizadas para as declamações — na v1, texto na tela (ver §4.3).
- Localização — a v1 é **somente PT-BR**; EN, ES e FR em versões posteriores (ver §9).

## 3. Público-alvo

- **Primário:** estudantes de ensino médio e vestibulandos (a SAM cai em prova; professores buscam material vivo). Coerente com a estratégia de direitos escolhida (§7): **projeto educacional, sem fins lucrativos**.
- **Secundário:** público geral interessado em cultura brasileira; visitantes do site do Theatro.
- Implicações: desktop-first mas com fallback mobile decente (estudante usa celular), linguagem acessível, sessões de 15–40 min.

## 4. A experiência

### 4.1 Estrutura: dois modos

**Modo Visita Livre (o "museu")**
- O jogador circula livremente pelo teatro com a exposição montada no saguão.
- Cada obra é interativa: aproximar-se abre uma ficha (artista, título, ano, onde está hoje, status de documentação — "consta do catálogo" vs. "atribuição incerta").
- Personagens-chave presentes como figuras posicionadas (Mário, Oswald, Anita, Di Cavalcanti, Villa-Lobos…), cada um com um "medalhão" biográfico e, quando em domínio público, trechos de seus textos.
- Espaços navegáveis: **saguão/vestíbulo (exposição), escadaria nobre, salão nobre (foyer), sala de espetáculos, palco**.

**Modo As Três Noites (o "evento")**
- Três cenas dirigidas, uma por noite, vividas da plateia (com liberdade de olhar/andar limitada à sala):
  1. **13/02** — abertura de Graça Aranha, Satie/Poulenc, Villa-Lobos de câmara. Plateia tensa mas contida.
  2. **15/02** — a noite das vaias: conferência de Menotti, "Os Sapos" declamado sob latidos e relinchos, Oswald lendo *Os Condenados*, e — no intervalo — o jogador sai ao saguão e encontra **Mário de Andrade lendo na escadaria** cercado de deboche.
  3. **17/02** — festival Villa-Lobos com plateia rala; o episódio do chinelo, com a revelação posterior (calo) contada ao jogador.
- Cada noite dura ~5–10 min de cena com beats interativos (escolher para onde olhar, aproximar-se, reagir), não cutscene passiva.

**Camada "mito vs. fato"** (transversal): em momentos-chave, um toggle/painel "O que realmente sabemos" — ex.: ao ouvir a lenda dos tomates, o painel mostra o status anedótico; ao ver a exposição, avisa que a expografia é reconstituição interpretativa.

### 4.2 Controles

- Desktop: WASD + mouse (pointer lock), E/clique para interagir, ESC para menu. Padrão de walking sim.
- Mobile (fallback): joystick virtual + arrastar para olhar, ou navegação por teleporte entre pontos de interesse.
- Acessibilidade: legendas em tudo que é falado/cantado, opção de alto contraste na UI, navegação alternativa sem motion (teleporte) para quem enjoa.

### 4.3 Áudio

- **Música:** peça central da experiência. Ver §7 (direitos): Satie, Debussy e Blanchet são livres; **Villa-Lobos está protegido até 1º/01/2030** (licença via Academia Brasileira de Música, ou adiar essa camada, ou gravação licenciada).
- **Declamações:** na **v1, texto na tela** (tipografia de época, sincronizada com a cena e o áudio ambiente) — sem vozes gravadas nem TTS; outras possibilidades (atores, TTS de alta qualidade) ficam para depois da v1. Textos em DP (Mário, Oswald, Graça Aranha, Ronald de Carvalho) podem ser exibidos integralmente. "Os Sapos" (Bandeira, protegido até 2039): pela estratégia de citação educacional (§7), usar **trechos curtos como citação** com crédito e contexto didático — não o poema integral.
- **Ambiente:** multidão, vaias, latidos/relinchos (documentados!), burburinho de foyer — design de som próprio, sem problema de direitos.

## 5. Conteúdo (escopo v1)

| Item | Quantidade | Fonte |
|---|---|---|
| Espaços do teatro | 5 (saguão, escadaria, salão nobre, sala, palco) | pesquisa §5 |
| Obras na exposição | **100 itens de catálogo, todos com título conhecido** (transcrição completa em [`catalogo-obras/README.md`](./catalogo-obras/README.md)); fichas ricas para as ~15–20 obras com imagem/paradeiro conhecidos, fichas mínimas (título + artista + "paradeiro desconhecido") para as demais | pesquisa §4 |
| Personagens nomeados | ~15–20 | pesquisa §7 |
| Cenas dirigidas | 3 noites | pesquisa §3 |
| Fichas mito vs. fato | ~8 | pesquisa §9 |
| Peças musicais | 4–6 em DP na v1 (Satie, Debussy, Blanchet) + plano Villa-Lobos | pesquisa §6.2 |

## 6. Abordagem técnica

**Stack definida:**

- **Motor:** Three.js via **React Three Fiber** (+ drei, rapier para colisão). Justificativa: web-nativo, bundle controlável, ecossistema forte para walking sims, UI em React para fichas/menus. Alternativas consideradas: Unity WebGL (pesado, ~30-50 MB de player, pior em mobile), PlayCanvas (editor bom, lock-in), Godot web (export ainda pesado), Babylon.js (viável, ecossistema menor para esse perfil).
- **Assets:** glTF + Draco/meshopt; texturas KTX2. Modelagem própria em Blender. **Ponto de partida:** modelo do exterior no Sketchfab (GeoHereditas/USP, download gratuito — verificar licença exata) + plantas/fotos do acervo NAP + tour 360° oficial como referência do interior.
- **Streaming de cena:** carregar por espaço (saguão primeiro, sala sob demanda); alvo < 25 MB para a primeira interação.
- **Áudio:** Web Audio API com áudio posicional; Howler ou nativo.
- **Deploy:** site estático (Vercel), sem backend na v1. Analytics PostHog (já integrado ao ambiente do projeto).
- **Performance alvo:** 60 fps em notebook integrado (Iris Xe), 30 fps em celular mediano; orçamento de ~150k triângulos visíveis por cena, lightmaps assados (o teatro é iluminação elétrica de 1922 — quente, tungstênio, ótimo para baked).

### 6.1 Direção de arte

**Decisão: estilizado.** Low-poly rico / estética pictórica com paleta de época (tungstênio de 1922, veludo, dourado — sugeridos por cor e forma, não por PBR fiel). Honesto quanto ao caráter interpretativo da reconstituição, viável para time pequeno, performa bem em qualquer máquina e envelhece bem. As obras da exposição aparecem como reproduções emolduradas dentro do mundo estilizado (nas condições do §7). Próximo passo: 2–3 concepts do saguão para calibrar o grau de estilização.

## 7. O problema central: direitos autorais

O maior risco do projeto não é técnico. Resumo (detalhe na pesquisa §6):

| Camada | Livre hoje | Protegido |
|---|---|---|
| Textos | Mário, Oswald, Graça Aranha, Ronald de Carvalho | **"Os Sapos"** (2039), Guilherme de Almeida (2040), Menotti (2059) |
| Música | Satie, Debussy, Blanchet | **Villa-Lobos (2030, ABM)**, Poulenc (2034) |
| Artes visuais | **Brecheret (desde 2026!)**, Garcia Moya; Przyrembel em 2027 | **Anita Malfatti (2035), Di Cavalcanti — inclusive o cartaz — (2047)**, Zina Aita, Rego Monteiro, Graz etc. |
| Teatro (arquitetura) | Livre (Ramos de Azevedo † 1928) | — |

**Estratégia definida: DP + citação educacional (art. 46 da Lei 9.610).**
- O projeto assume caráter **educacional e sem fins lucrativos** (consequência: nada de venda, anúncio ou paywall).
- **Livre, uso integral:** Brecheret, Garcia Moya, textos de Mário/Oswald/Graça Aranha/Ronald de Carvalho, Satie/Debussy/Blanchet, e a arquitetura do teatro.
- **Protegido, uso como citação didática:** reproduções das pinturas em resolução limitada, sempre com crédito, ficha completa e link para o acervo oficial; trechos curtos de "Os Sapos" e das canções, não as obras integrais. Cada uso registrado numa **planilha de proveniência** (obra, titular, fundamento de uso) para auditabilidade.
- **Música de Villa-Lobos:** o art. 46 não cobre execução integral das peças — na v1, usar **trechos curtos** contextualizados ou representar as cenas musicais com o programa/reações; a camada completa entra em **1º/01/2030** (DP) ou antes, se surgir licença via ABM/parceria.
- Risco residual assumido: baixo-moderado. Se surgir parceria institucional (Theatro, Itaú Cultural, MASP…), migrar itens da coluna "citação" para licença formal.
- **Parcerias institucionais:** a busca ativa (Theatro/NAP, museus, institutos) começa **só depois de um protótipo apresentável** (fim da Fase 1) — chegar com algo jogável em mãos, não com promessa.

## 8. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Direitos autorais (obras visuais + Villa-Lobos + Bandeira) | Alto | §7; decidir antes de produzir assets |
| Modelagem do interior do teatro é cara (ornamentação eclética) | Alto | Direção de arte estilizada; ornamento por texturas/normal maps, não geometria; reuso de módulos (camarotes repetidos) |
| Não há fotos da exposição de 1922 → críticas de historiadores | Médio | Assumir explicitamente como interpretação; consultoria/revisão histórica; camada mito vs. fato |
| Performance web com ~100 obras + sala de 1.500 lugares | Médio | Streaming por espaço, instancing agressivo (cadeiras/camarotes), LOD, baked lighting |
| Escopo de áudio (declamações + música + multidão) | Médio | Priorizar 2ª noite (a icônica); TTS de qualidade ou gravação com atores conforme orçamento |
| Divergências historiográficas (nº de obras, Goeldi etc.) | Baixo | Fichas com grau de confiança; seguir catálogo/Aracy Amaral como fonte primária |

## 9. Roadmap proposto (fases, sem datas)

1. **Fase 0 — Fundação:** ~~transcrever o catálogo~~ ✅ (feito — [`catalogo-obras/README.md`](./catalogo-obras/README.md)); definir direção de arte com concepts; greybox do teatro (5 espaços) com controlador FPS andável no navegador. *Critério: andar do saguão à plateia com 60 fps.*
2. **Fase 1 — O Museu:** saguão com exposição completa (fichas), escadaria e foyer, iluminação assada, personagens estáticos com medalhões. *Entregável: Visita Livre publicável como beta — e o protótipo apresentável que abre a busca por parcerias institucionais (§7).*
3. **Fase 2 — A Noite das Vaias:** cena dirigida do 15/02 completa (conferência, "Os Sapos" conforme decisão de direitos, Mário na escadaria, áudio de multidão; declamações como texto na tela — §4.3). A técnica da multidão da plateia (impostores 2D estilizados vs. malhas instanciadas, e quantos NPCs) **é decidida aqui, com os dados dos primeiros testes de performance da Fase 1**. *É a fatia vertical que prova o produto.*
4. **Fase 3 — As outras noites:** 13/02 e 17/02, música conforme estratégia de direitos.
5. **Fase 4 — Polimento e lançamento (v1, só PT-BR):** mobile, acessibilidade, material para professores, distribuição.
6. **Pós-v1:** localização **EN, ES e FR**; reavaliar vozes para as declamações (atores ou TTS); camada Villa-Lobos completa em 2030 (§7).

## 10. Métricas de sucesso (hipótese)

- ≥ 60% dos visitantes completam a cena da 2ª noite.
- Tempo médio de sessão ≥ 12 min.
- ≥ 30% abrem pelo menos 5 fichas de obra.
- Uso real em sala de aula (nº de professores que adotam — canal a definir).

## 11. Decisões tomadas (14/08/2026)

| Tema | Decisão |
|---|---|
| Conteúdo protegido | **DP + citação educacional (art. 46)**; projeto sem fins lucrativos (§7) |
| Direção de arte | **Estilizada** (§6.1) |
| Escopo v1 | **Museu primeiro** (Visita Livre), depois as noites começando pela de 15/02 |
| Stack | **Three.js + React Three Fiber** (§6) |
| Declamações | **Texto na tela na v1** (§4.3); vozes reavaliadas pós-v1 |
| Idiomas | **Só PT-BR na v1**; EN, ES e FR em versões posteriores (§9) |
| Parcerias institucionais | Buscar **só depois do protótipo apresentável** (fim da Fase 1) (§7, §9) |
| Multidão da plateia | Técnica e quantidade decididas na Fase 2, **após os primeiros testes de performance** (§9) |
