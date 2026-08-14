# Gera o greybox do Theatro Municipal (5 collections) a partir das cotas de
# docs/specs/20260814_fase0-fundacao/cotas.md. Fonte paramétrica do .blend.
#
# Uso: blender --background --python ferramentas/blender/gerar_greybox.py
# Salva theatro-greybox.blend e exporta um .glb cru por espaço em export/.
#
# Convenção (spec §2.4): o script trabalha em coordenadas do JOGO
# (x, y=altura, z longitudinal; -z = do saguão para o palco). A conversão
# para o espaço do Blender (Z-up) acontece só no helper _v(); o exportador
# glTF (+Y up) desfaz a conversão e o jogo recebe as coordenadas originais.

import math
import os

import bpy

RAIZ = os.path.dirname(os.path.abspath(__file__))
EXPORT = os.path.join(RAIZ, "export")

# ── cotas usadas (a fonte com grau de confiança é o cotas.md) ──────────────
SAGUAO_L, SAGUAO_P, SAGUAO_H = 30.0, 9.5, 6.5
CAIXA_ESC_L, CAIXA_ESC_H = 12.0, 20.0
CORREDOR_LARG, CORREDOR_H = 2.8, 3.0
DEGRAU_ALTO, DEGRAU_FUNDO, LANCE_LARG, N_DEGRAUS = 0.16, 0.32, 4.0, 21
NOBRE_Y = 2 * N_DEGRAUS * DEGRAU_ALTO  # 6,72 — andar nobre
FOYER_L, FOYER_P, FOYER_H = 30.0, 8.0, 12.0
SALA_LARG, SALA_H = 25.0, 20.0
RAKE_QUEDA = 1.2
FOSSO_PROF = 2.5
BOCA_LARG, BOCA_ALT = 15.8, 7.0  # boca original de 1922
PALCO_LARG, PALCO_PROF, PALCO_H = 24.0, 24.68, 32.0
NIVEIS_ANEIS = [1.0, 3.8, 6.7, 9.9, 13.0]  # frisas, 1ª ordem, balcão nobre, galeria, galeria central

# layout longitudinal (cotas.md)
Z_FACHADA = 4.75
Z_SAGUAO_FIM = -4.75
Z_ESC_FIM = -12.75
Z_CORREDOR_FIM = -15.2
Z_SALA_FIM = -34.75
Z_PALCO_FIM = Z_SALA_FIM - PALCO_PROF  # −59,43
ARCO_R = SALA_LARG / 2  # 12,5
ARCO_CENTRO_Z = Z_ESC_FIM - ARCO_R  # −25,25 (ápice da ferradura em −12,75)

CORES = {
    "saguao": (0.62, 0.55, 0.45, 1.0),
    "escadaria": (0.45, 0.55, 0.62, 1.0),
    "foyer": (0.60, 0.48, 0.55, 1.0),
    "sala": (0.58, 0.42, 0.40, 1.0),
    "palco": (0.42, 0.50, 0.42, 1.0),
    "obra": (0.85, 0.80, 0.62, 1.0),
}


def _v(x, y, z):
    """jogo (x, y-altura, z) → Blender (x, -z, y)"""
    return (x, -z, y)


def _material(nome):
    mat = bpy.data.materials.get(nome)
    if mat is None:
        mat = bpy.data.materials.new(nome)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = CORES[nome]
        bsdf.inputs["Roughness"].default_value = 0.9
    return mat


def _obj(col, nome, verts, faces, cor):
    mesh = bpy.data.meshes.new(nome)
    mesh.from_pydata([_v(*p) for p in verts], [], faces)
    mesh.validate()
    obj = bpy.data.objects.new(nome, mesh)
    obj.data.materials.append(_material(cor))
    col.objects.link(obj)
    return obj


def caixa(col, nome, centro, tam, cor):
    cx, cy, cz = centro
    sx, sy, sz = tam[0] / 2, tam[1] / 2, tam[2] / 2
    verts = [
        (cx + dx * sx, cy + dy * sy, cz + dz * sz)
        for dx in (-1, 1)
        for dy in (-1, 1)
        for dz in (-1, 1)
    ]
    faces = [
        (0, 1, 3, 2), (4, 6, 7, 5),  # x−, x+
        (0, 4, 5, 1), (2, 3, 7, 6),  # y−, y+
        (0, 2, 6, 4), (1, 5, 7, 3),  # z−, z+
    ]
    obj = _obj(col, nome, verts, faces, cor)
    # metadados de colisão (extras do glTF, em coordenadas do jogo): cuboide
    # convexo no runtime — trimesh de piso prende a cápsula em aresta interna
    obj["colisao"] = "caixa"
    obj["c_centro"] = [float(cx), float(cy), float(cz)]
    obj["c_tam"] = [float(t) for t in tam]
    return obj


def arco(col, nome, r_int, r_ext, y0, y1, ang0, ang1, cor, seg=12):
    """Segmento de anel da ferradura. Ângulo 0 = ápice (+z do centro);
    ponto = (r·sin a, ARCO_CENTRO_Z + r·cos a)."""
    verts, faces = [], []
    for i in range(seg + 1):
        a = math.radians(ang0 + (ang1 - ang0) * i / seg)
        sx, cz = math.sin(a), math.cos(a)
        for r in (r_int, r_ext):
            for y in (y0, y1):
                verts.append((r * sx, y, ARCO_CENTRO_Z + r * cz))
    # por fatia i: base b=4i → [int/y0, int/y1, ext/y0, ext/y1]
    for i in range(seg):
        b, c = 4 * i, 4 * (i + 1)
        faces += [
            (b + 0, b + 1, c + 1, c + 0),  # face interna
            (b + 2, c + 2, c + 3, b + 3),  # face externa
            (b + 1, b + 3, c + 3, c + 1),  # topo
            (b + 0, c + 0, c + 2, b + 2),  # base
        ]
    faces += [(0, 2, 3, 1), (4 * seg + 0, 4 * seg + 1, 4 * seg + 3, 4 * seg + 2)]  # tampas
    obj = _obj(col, nome, verts, faces, cor)
    obj["colisao"] = "trimesh"  # parede/prateleira curva: côncava, fica trimesh
    return obj


def prisma(col, nome, topo4, base_y, cor):
    """Sólido com face superior nos 4 pontos dados (x,y,z) e base plana em base_y."""
    verts = list(topo4) + [(x, base_y, z) for x, _, z in topo4]
    faces = [
        (0, 1, 2, 3), (7, 6, 5, 4),
        (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0),
    ]
    obj = _obj(col, nome, verts, faces, cor)
    obj["colisao"] = "casco"  # sólido convexo (rake da plateia): convex hull
    return obj


def escada(col, nome, x, y0, z0, dz, n, cor, largura=LANCE_LARG):
    """n degraus macicos a partir do nível y0, avançando dz por degrau (sinal = direção)."""
    for i in range(n):
        topo = y0 + (i + 1) * DEGRAU_ALTO
        zc = z0 + dz * (i + 0.5)
        caixa(col, f"{nome}-{i + 1:02d}", (x, (y0 + topo) / 2, zc),
              (largura, topo - y0, abs(dz)), cor)


def nova_col(nome):
    col = bpy.data.collections.new(nome)
    bpy.context.scene.collection.children.link(col)
    return col


# ═══ saguão ════════════════════════════════════════════════════════════════
def gerar_saguao():
    col = nova_col("saguao")
    mx = SAGUAO_L / 2  # 15
    caixa(col, "saguao_piso", (0, -0.1, 0), (SAGUAO_L, 0.2, SAGUAO_P), "saguao")
    caixa(col, "saguao_teto", (0, SAGUAO_H + 0.1, 0), (SAGUAO_L, 0.2, SAGUAO_P), "saguao")
    # frente (+z): vão de entrada 6 m, verga a 3,5
    caixa(col, "saguao_frente-esq", (-9, SAGUAO_H / 2, Z_FACHADA), (12, SAGUAO_H, 0.3), "saguao")
    caixa(col, "saguao_frente-dir", (9, SAGUAO_H / 2, Z_FACHADA), (12, SAGUAO_H, 0.3), "saguao")
    caixa(col, "saguao_frente-verga", (0, 5.0, Z_FACHADA), (6, 3.0, 0.3), "saguao")
    # fundo (−z): arcada de 17,9 m (escadaria + corredores), verga a 4,0
    caixa(col, "saguao_fundo-esq", (-11.975, SAGUAO_H / 2, Z_SAGUAO_FIM), (6.05, SAGUAO_H, 0.3), "saguao")
    caixa(col, "saguao_fundo-dir", (11.975, SAGUAO_H / 2, Z_SAGUAO_FIM), (6.05, SAGUAO_H, 0.3), "saguao")
    caixa(col, "saguao_fundo-verga", (0, 5.25, Z_SAGUAO_FIM), (17.9, 2.5, 0.3), "saguao")
    caixa(col, "saguao_lateral-esq", (-mx, SAGUAO_H / 2, 0), (0.3, SAGUAO_H, SAGUAO_P), "saguao")
    caixa(col, "saguao_lateral-dir", (mx, SAGUAO_H / 2, 0), (0.3, SAGUAO_H, SAGUAO_P), "saguao")

    # volumes-fantasma da exposição (catálogo transcrito: 64 pinturas + 19
    # pranchas de arquitetura nas paredes, 17 esculturas em pedestais)
    trechos = [  # (x0,z0) → (x1,z1), normal para dentro
        ((-mx + 0.2, -4.0), (-mx + 0.2, 4.0), (1, 0)),
        ((mx - 0.2, 4.0), (mx - 0.2, -4.0), (-1, 0)),
        ((-14.0, Z_FACHADA - 0.2), (-3.5, Z_FACHADA - 0.2), (0, -1)),
        ((3.5, Z_FACHADA - 0.2), (14.0, Z_FACHADA - 0.2), (0, -1)),
        ((-14.5, Z_SAGUAO_FIM + 0.2), (-9.3, Z_SAGUAO_FIM + 0.2), (0, 1)),
        ((9.3, Z_SAGUAO_FIM + 0.2), (14.5, Z_SAGUAO_FIM + 0.2), (0, 1)),
    ]
    comprimentos = [math.dist(a, b) for a, b, _ in trechos]
    total = sum(comprimentos)
    parede_itens = [("pintura", i + 1) for i in range(64)] + [("arq", i + 1) for i in range(19)]
    fila = list(parede_itens)
    for (a, b, n), comp in zip(trechos, comprimentos):
        # quadro deitado no plano da parede: largura acompanha o trecho,
        # espessura (0,08) fica no eixo da normal
        tam = (0.08, 1.1, 0.9) if n[0] != 0 else (0.9, 1.1, 0.08)
        quota = round(len(parede_itens) * comp / total / 2) * 2  # par: 2 alturas
        lote, fila = fila[:quota], fila[quota:]
        por_altura = max(1, len(lote) // 2)
        for j, (tipo, num) in enumerate(lote):
            linha, pos = divmod(j, por_altura)
            t = (pos + 0.5) / por_altura
            x = a[0] + (b[0] - a[0]) * t
            z = a[1] + (b[1] - a[1]) * t
            y = 1.7 if linha == 0 else 3.1
            caixa(col, f"obra_{tipo}_{num:02d}", (x, y, z), tam, "obra")
    for tipo, num in fila:  # sobras (arredondamento) na parede do fundo
        caixa(col, f"obra_{tipo}_{num:02d}", (0, 5.6, Z_SAGUAO_FIM + 0.2), (0.9, 1.1, 0.08), "obra")
    # esculturas: pedestais em duas fileiras centrais (1,28 m: acima da cintura,
    # abaixo do rosto — 1,6 ficava na cara do jogador)
    for i in range(17):
        linha, pos = divmod(i, 9)
        x = -12 + pos * 3.0
        z = -1.8 if linha == 0 else 1.8
        caixa(col, f"obra_esc_{i + 1:02d}", (x, 0.64, z), (0.5, 1.28, 0.5), "obra")


# ═══ escadaria (caixa + corredores do térreo) ══════════════════════════════
def gerar_escadaria():
    col = nova_col("escadaria")
    mzc = (Z_SAGUAO_FIM + Z_ESC_FIM) / 2  # −8,75
    meia = CAIXA_ESC_L / 2  # 6
    caixa(col, "escadaria_piso", (0, -0.1, mzc), (CAIXA_ESC_L, 0.2, 8), "escadaria")
    caixa(col, "escadaria_parede-esq", (-meia, CAIXA_ESC_H / 2, mzc), (0.3, CAIXA_ESC_H, 8), "escadaria")
    caixa(col, "escadaria_parede-dir", (meia, CAIXA_ESC_H / 2, mzc), (0.3, CAIXA_ESC_H, 8), "escadaria")
    caixa(col, "escadaria_parede-fundo", (0, CAIXA_ESC_H / 2, Z_ESC_FIM), (CAIXA_ESC_L, CAIXA_ESC_H, 0.3), "escadaria")
    # lance central: 21 degraus descendo em −z, do saguão ao patamar (+3,36)
    escada(col, "escadaria_central", 0, 0, -5.0, -DEGRAU_FUNDO, N_DEGRAUS, "escadaria")
    # patamar maciço no fundo da caixa
    z_pat0 = -5.0 - N_DEGRAUS * DEGRAU_FUNDO  # −11,72
    caixa(col, "escadaria_patamar", (0, N_DEGRAUS * DEGRAU_ALTO / 2, (z_pat0 + Z_ESC_FIM + 0.15) / 2),
          (CAIXA_ESC_L - 0.6, N_DEGRAUS * DEGRAU_ALTO, abs(Z_ESC_FIM - z_pat0) - 0.15), "escadaria")
    # lances laterais em cruz: sobem de volta em +z até o andar nobre
    for lado, x in (("esq", -4.0), ("dir", 4.0)):
        escada(col, f"escadaria_lateral-{lado}", x, N_DEGRAUS * DEGRAU_ALTO, z_pat0 + 0.1,
               DEGRAU_FUNDO, N_DEGRAUS, "escadaria")
    # chegada: passarela no nível nobre ligando os lances ao foyer
    caixa(col, "escadaria_chegada", (0, NOBRE_Y - 0.1, (-5.0 + -3.25) / 2),
          (CAIXA_ESC_L, 0.2, abs(-3.25 - -5.0)), "escadaria")
    # corredores laterais do térreo (saguão → sala)
    for lado, sinal in (("esq", -1), ("dir", 1)):
        xc = sinal * (meia + 0.15 + CORREDOR_LARG / 2)  # ±7,55
        zc = (Z_SAGUAO_FIM + Z_CORREDOR_FIM) / 2
        prof = abs(Z_CORREDOR_FIM - Z_SAGUAO_FIM)
        caixa(col, f"corredor-{lado}_piso", (xc, -0.1, zc), (CORREDOR_LARG, 0.2, prof), "escadaria")
        caixa(col, f"corredor-{lado}_teto", (xc, CORREDOR_H + 0.1, zc), (CORREDOR_LARG, 0.2, prof), "escadaria")
        xe = sinal * (meia + 0.3 + CORREDOR_LARG)  # parede externa ±9,1
        caixa(col, f"corredor-{lado}_parede", (xe, CORREDOR_H / 2, zc), (0.3, CORREDOR_H, prof), "escadaria")


# ═══ foyer (salão nobre) ═══════════════════════════════════════════════════
def gerar_foyer():
    col = nova_col("foyer")
    zc = (Z_FACHADA + -3.25) / 2  # 0,75
    # piso no nível exato da chegada da escadaria (6,72): 2 cm acima do teto do
    # saguão (topo em 6,7) — coplanar dava z-fighting (teto "piscava" roxo)
    y0 = NOBRE_Y
    mx = FOYER_L / 2
    caixa(col, "foyer_piso", (0, y0 - 0.1, zc), (FOYER_L, 0.2, FOYER_P), "foyer")
    caixa(col, "foyer_teto", (0, y0 + FOYER_H + 0.1, zc), (FOYER_L, 0.2, FOYER_P), "foyer")
    caixa(col, "foyer_frente", (0, y0 + FOYER_H / 2, Z_FACHADA), (FOYER_L, FOYER_H, 0.3), "foyer")
    caixa(col, "foyer_lateral-esq", (-mx, y0 + FOYER_H / 2, zc), (0.3, FOYER_H, FOYER_P), "foyer")
    caixa(col, "foyer_lateral-dir", (mx, y0 + FOYER_H / 2, zc), (0.3, FOYER_H, FOYER_P), "foyer")
    # fundo (−z): vão central de 12 m para a escadaria, 4 m de altura
    caixa(col, "foyer_fundo-esq", (-10.5, y0 + FOYER_H / 2, -3.25), (9, FOYER_H, 0.3), "foyer")
    caixa(col, "foyer_fundo-dir", (10.5, y0 + FOYER_H / 2, -3.25), (9, FOYER_H, 0.3), "foyer")
    caixa(col, "foyer_fundo-verga", (0, y0 + 4 + (FOYER_H - 4) / 2, -3.25), (12, FOYER_H - 4, 0.3), "foyer")


# ═══ sala de espetáculos ═══════════════════════════════════════════════════
def gerar_sala():
    col = nova_col("sala")
    # plateia: rampa (rake) do fundo (y 0) à frente (y −1,2)
    z_frente = -33.0
    prisma(col, "sala_plateia-rake", [
        (-ARCO_R, 0, Z_ESC_FIM), (ARCO_R, 0, Z_ESC_FIM),
        (ARCO_R, -RAKE_QUEDA, z_frente), (-ARCO_R, -RAKE_QUEDA, z_frente),
    ], -1.5, "sala")
    # fosso de orquestra
    caixa(col, "sala_fosso-piso", (0, -RAKE_QUEDA - FOSSO_PROF - 0.1, (z_frente + Z_SALA_FIM) / 2),
          (15, 0.2, abs(Z_SALA_FIM - z_frente)), "sala")
    caixa(col, "sala_fosso-parapeito", (0, -RAKE_QUEDA + 0.4, z_frente - 0.1), (15, 1.0, 0.2), "sala")
    for lado, x in (("esq", -7.6), ("dir", 7.6)):
        caixa(col, f"sala_fosso-lateral-{lado}", (x, -RAKE_QUEDA - FOSSO_PROF / 2, (z_frente + Z_SALA_FIM) / 2),
              (0.2, FOSSO_PROF, abs(Z_SALA_FIM - z_frente)), "sala")
    # ferradura: parede em 3 segmentos, com 2 vãos (corredores, ±36°±6,4°)
    vao0, vao1 = 29.6, 42.4
    for nome, a0, a1 in (("esq", -90, -vao1), ("centro", -vao0, vao0), ("dir", vao1, 90)):
        arco(col, f"sala_ferradura-{nome}", ARCO_R, ARCO_R + 0.4, -1.5, SALA_H, a0, a1, "sala")
    for nome, a0, a1 in (("esq", -vao1, -vao0), ("dir", vao0, vao1)):
        arco(col, f"sala_ferradura-verga-{nome}", ARCO_R, ARCO_R + 0.4, 2.5, SALA_H, a0, a1, "sala", seg=3)
    # paredes retas até a boca
    for lado, x in (("esq", -(ARCO_R + 0.2)), ("dir", ARCO_R + 0.2)):
        caixa(col, f"sala_parede-reta-{lado}", (x, (SALA_H - 1.5) / 2, (ARCO_CENTRO_Z + Z_SALA_FIM) / 2),
              (0.4, SALA_H + 1.5, abs(Z_SALA_FIM - ARCO_CENTRO_Z)), "sala")
    # anéis dos 5 níveis (frisas → galeria central), curvos + trechos retos
    for n, y in enumerate(NIVEIS_ANEIS, start=1):
        for nome, a0, a1 in (("esq", -90, -vao1), ("centro", -vao0, vao0), ("dir", vao1, 90)):
            if y > 2.6 and nome != "centro":
                a0, a1 = (-90, -vao0) if nome == "esq" else (vao0, 90)
            arco(col, f"sala_anel{n}-{nome}", ARCO_R - 2.5, ARCO_R, y, y + 0.3, a0, a1, "sala")
        for lado, x in (("esq", -1), ("dir", 1)):
            caixa(col, f"sala_anel{n}-reta-{lado}", (x * (ARCO_R - 1.25), y + 0.15, (ARCO_CENTRO_Z + -33.5) / 2),
                  (2.5, 0.3, abs(-33.5 - ARCO_CENTRO_Z)), "sala")
    # parede da boca (z −34,75) com abertura de 15,8 × 7 e camarotes de proscênio
    seg_l = (SALA_LARG - BOCA_LARG) / 2  # 4,6
    for lado, x in (("esq", -(BOCA_LARG + seg_l) / 2), ("dir", (BOCA_LARG + seg_l) / 2)):
        caixa(col, f"sala_boca-{lado}", (x, (SALA_H - 1.5) / 2, Z_SALA_FIM), (seg_l, SALA_H + 1.5, 0.4), "sala")
    caixa(col, "sala_boca-verga", (0, BOCA_ALT + (SALA_H - BOCA_ALT) / 2, Z_SALA_FIM),
          (BOCA_LARG, SALA_H - BOCA_ALT, 0.4), "sala")
    for lado, x in (("esq", -(BOCA_LARG / 2 + 1.3)), ("dir", BOCA_LARG / 2 + 1.3)):
        caixa(col, f"sala_proscenio-{lado}", (x, (BOCA_ALT - 1.5) / 2, Z_SALA_FIM + 0.9),
              (2.4, BOCA_ALT + 1.5, 1.6), "sala")
    caixa(col, "sala_teto", (0, SALA_H + 0.1, (Z_ESC_FIM + Z_SALA_FIM) / 2), (SALA_LARG + 1, 0.2, 22), "sala")


# ═══ palco ═════════════════════════════════════════════════════════════════
def gerar_palco():
    col = nova_col("palco")
    zc = (Z_SALA_FIM + Z_PALCO_FIM) / 2
    mx = PALCO_LARG / 2
    caixa(col, "palco_piso", (0, -0.1, zc), (PALCO_LARG, 0.2, PALCO_PROF), "palco")
    caixa(col, "palco_fundo", (0, PALCO_H / 2, Z_PALCO_FIM), (PALCO_LARG, PALCO_H, 0.4), "palco")
    caixa(col, "palco_lateral-esq", (-mx, PALCO_H / 2, zc), (0.4, PALCO_H, PALCO_PROF), "palco")
    caixa(col, "palco_lateral-dir", (mx, PALCO_H / 2, zc), (0.4, PALCO_H, PALCO_PROF), "palco")
    caixa(col, "palco_teto", (0, PALCO_H + 0.1, zc), (PALCO_LARG, 0.2, PALCO_PROF), "palco")


# ═══ execução ══════════════════════════════════════════════════════════════
def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    gerar_saguao()
    gerar_escadaria()
    gerar_foyer()
    gerar_sala()
    gerar_palco()

    os.makedirs(EXPORT, exist_ok=True)
    for col in bpy.data.collections:
        bpy.ops.object.select_all(action="DESELECT")
        for obj in col.objects:
            obj.select_set(True)
        destino = os.path.join(EXPORT, f"{col.name}.glb")
        bpy.ops.export_scene.gltf(
            filepath=destino, export_format="GLB", use_selection=True, export_extras=True
        )
        print(f"EXPORT_OK {col.name} ({len(col.objects)} objetos)")

    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(RAIZ, "theatro-greybox.blend"))
    print("BLEND_OK")


main()
