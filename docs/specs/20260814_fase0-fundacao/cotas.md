# Cotas do greybox — Theatro Municipal de São Paulo

> Entregável da fatia 2 (spec §9.2). Toda medida usada no `gerar_greybox.py` nasce aqui, com fonte e grau de confiança. Graus: **[T]** documento técnico · **[O]** oficial descritivo · **[E]** estimado (com base declarada).
>
> Fontes principais:
> - **[KATCH]** Katchvartanian, S. A. *Teatro Municipal de São Paulo: histórico de projetos e análise da estrutura*. Dissertação Poli-USP, 2014. [PDF](https://www.teses.usp.br/teses/disponiveis/3/3144/tde-31122015-112953/publico/Dissertacao_Soraya.pdf)
> - **[VAZ]** Vaz, B. F. Dissertação FAU-USP, 2021 (restauro 2008-11). [PDF](https://www.teses.usp.br/teses/disponiveis/16/16133/tde-17062021-164020/publico/MEBeatrizFernandezVaz_rev.pdf)
> - **[BASE]** Base Padrão TMSP 2022 — plantas oficiais de todos os pavimentos, com áreas. [PDF](https://theatromunicipal.org.br/wp-content/uploads/2022/12/Anexo-II-Base-Padrao-TMSP.pdf)
> - **[PREF]** Descrição oficial do patrimônio, Prefeitura/FTMSP. [link](https://prefeitura.sp.gov.br/web/fundacao_theatro_municipal/w/theatro_municipal/28415)

## Licença do modelo Sketchfab (verificada via API)

Modelo "Theatro Municipal de São Paulo" de **GeoHereditas (IGc-USP)**: **CC-BY 4.0**, download permitido, uso comercial permitido, exige crédito. Exterior apenas (fotogrametria, 2 M triângulos). Crédito a usar: *"GeoHereditas / IGc-USP via Sketchfab, CC-BY 4.0"*. É referência de envelope; não entra no runtime.

## Envelope do edifício

| medida | valor | fonte |
|---|---|---|
| planta do volume construído | **86 × 42 m** | [T] KATCH (os "92 m" do [O] PREF incluem escadaria externa) |
| altura até o lanternim da cúpula | **40 m** | [T] KATCH |
| torre cênica (caixa do palco) | **32 m** | [T] KATCH |
| paredes do corpo do público | até **15 m** | [T] KATCH |
| pavimentos | 9 | [O] PREF |
| três corpos | fachada (vestíbulo+escadaria+foyer) / sala / palco+camarins | [T][O] |

## Sistema de coordenadas do greybox

Origem no centro do saguão, y=0 no piso do térreo, **−Z do saguão para o palco** (spec §2.4). Layout longitudinal adotado:

```
z +4,75 ─ fachada (entrada)
z +4,75 … −4,75   saguão (9,5 m)
z −4,75 … −12,75  caixa da escadaria (8 m); corredores laterais do térreo até z −15,2
z −12,75 … −34,75 sala (22 m; ferradura com ápice em −12,75)
z −34,75 … −59,43 palco (24,68 m)
(camarins além: fora dos 5 espaços)
```
Soma ≈ 64 m + camarins ~12 + paredes ≈ envelope de 86 m ✓.

## Cotas por espaço

### Saguão (vestíbulo do térreo)
| medida | valor | fonte |
|---|---|---|
| área em planta | 284,72 m² | [T] BASE |
| adotado no greybox | **30 × 9,5 m** (= 285 m²) | [E] partição da fachada de 42 m |
| pé-direito | **6,5 m** | [E] análogo ao bar do térreo (6,48 m [T] KATCH); sem número direto |
| vão de entrada (+Z) | 6 m central, verga a 3,5 m | [E] fotos |
| vão para a escadaria (−Z) | 12 m central | [E] largura da caixa da escadaria |

### Escadaria nobre
| medida | valor | fonte |
|---|---|---|
| composição | 1 lance central + 2 laterais em cruz, **42 degraus** ao todo, térreo → andar nobre | [T] KATCH/VAZ |
| adotado | central 21 degraus (0,16 × 0,32 m, largura 4 m) até patamar a +3,36; laterais 21 degraus de volta até **+6,72 m** | [E] espelho/piso típicos monumentais sobre os 42 documentados |
| caixa | 12 × 8 m em planta, **20 m de altura** (zenital) | [T] VAZ (altura); [E] planta |
| corredores laterais do térreo | largura **2,8 m** | [T] KATCH (corredores 2,80 m) |

### Salão nobre (foyer)
| medida | valor | fonte |
|---|---|---|
| planta | **30 × 8 m** | [T] KATCH |
| pé-direito | **12 m** | [T] KATCH |
| nível do piso | **+6,7 m** (andar nobre = chegada da escadaria) | [E] derivado dos 42 degraus |

### Sala de espetáculos
| medida | valor | fonte |
|---|---|---|
| pé-direito | **20 m** | [T] KATCH |
| plateia em planta | 300 m² | [T] BASE |
| adotado: largura interna | **25 m**; ferradura r=12,5 m com ápice em z=−12,75 | [E] envelope 42 m − corredores/estrutura; círculo da cúpula (30 m [T]) como teto do vão |
| rake da plateia | de y=0 (fundo) a **y=−1,2 m** (frente, junto ao fosso) | [E] ~6% típico |
| fosso de orquestra | profundidade **2,5 m** abaixo da frente da plateia | [T] KATCH/BASE |
| níveis (config. 1922) | frisas / 1ª ordem (camarotes) / 2ª ordem (balcão nobre) / galeria / galeria central | [T] KATCH pp. 48-52 |
| anéis no greybox | prateleiras de 2,5 m a y = 1,0 · 3,8 · **6,7** (= foyer ✓) · 9,9 · 13,0 | [E] 5 níveis documentados, passos ~3 m ([T] KATCH: pé-direito médio ~3 m) |
| camarotes de proscênio | presentes (1922!), flanqueando a boca | [T] pesquisa §5.3; volumes [E] |

### Boca de cena — o conflito documentado
| medida | valor | fonte |
|---|---|---|
| original (1911–1952) | **15,80 m** | [T] KATCH/VAZ |
| vão pós-reforma 1952-55 | 18,50 m | [T] KATCH/VAZ |
| quadro útil atual | 12,50 × 7,00 m | [T] ficha técnica TMSP |
| **adotado (greybox 1922)** | **15,80 m de largura × 7,0 m de altura** | 15,8 [T]; altura [E] mantida da ficha atual |

### Palco
| medida | valor | fonte |
|---|---|---|
| profundidade | **24,68 m** | [T] ficha técnica |
| largura interna adotada | **24 m** | [E] envelope − paredes |
| piso do palco | y=0 (≈1,2 m acima da frente da plateia) | [E] praxe |
| caixa cênica | até **32 m** | [T] KATCH |

## O que ficou sem número (assumido e revisável)

Pé-direito exato do saguão; largura real da ferradura (medir na planta do térreo do [BASE] calibrando pela boca — tarefa de Fase 1); geometria fina dos lances da escadaria. O greybox assume os valores [E] acima; a Fase 1 refina contra as plantas vetoriais do [BASE] e fotos do acervo NAP.
