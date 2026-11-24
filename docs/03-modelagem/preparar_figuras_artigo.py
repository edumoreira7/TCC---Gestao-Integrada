from pathlib import Path
import hashlib
import html
import json
import re
import shutil
import textwrap
import xml.etree.ElementTree as ET

BASE = Path(__file__).resolve().parent
DESTINO = BASE / 'figuras-artigo'
FONTES = DESTINO / 'fontes'
FONTES.mkdir(parents=True, exist_ok=True)
VISTAS = [
    ('01-der-pedidos-producao-expedicao', 'der-pedidos-producao-expedicao'),
    ('02-der-receitas-compras-recebimento', 'der-receitas-compras-recebimento'),
    ('03-der-reservas-cancelamento-movimentos', 'der-reservas-cancelamento-movimentos'),
    ('04-der-usuarios-perfis-etapas', 'der-acesso-acompanhamento'),
    ('05-der-reposicao-estatistica', 'reposicao-dados'),
]
manifesto = {'base': 'cda5c5b2baa5eca0936294b630426693ac5fbd4c', 'fontes': {}, 'arquivos': []}

def registrar(arquivo):
    manifesto['fontes'][arquivo.relative_to(BASE.parent.parent).as_posix()] = hashlib.sha256(arquivo.read_bytes()).hexdigest()

def relacoes(texto):
    return {linha.strip() for linha in texto.splitlines() if '--' in linha and ':' in linha}

relacoes_vistas = set()
for nome, original in VISTAS:
    fonte = BASE / 'dados' / (original + '.mmd')
    vetor = fonte.with_suffix('.svg')
    registrar(fonte)
    shutil.copyfile(fonte, FONTES / (nome + '.mmd'))
    shutil.copyfile(vetor, DESTINO / (nome + '.svg'))
    relacoes_vistas.update(relacoes(fonte.read_text(encoding='utf-8')))
    manifesto['arquivos'].append(nome)

completo = BASE / 'dados/der-gestao-integrada.mmd'
extensao = BASE / 'dados/reposicao-dados.mmd'
texto_completo = completo.read_text(encoding='utf-8')
texto_extensao = extensao.read_text(encoding='utf-8')
assert relacoes_vistas == relacoes(texto_completo) | relacoes(texto_extensao), 'Cobertura incompleta das relações do DER'
(FONTES / '00-der-completo.mmd').write_text(texto_completo.rstrip() + '\n' + texto_extensao.replace('erDiagram', '', 1).strip() + '\n', encoding='utf-8')
registrar(completo)
manifesto['arquivos'].append('00-der-completo')
entidades = {nome: corpo for nome, corpo in re.findall(r'^\s*(\w+)\s*\{\s*\n(.*?)^\s*\}', texto_completo, re.M | re.S)}
detalhes = [
    ('01a-der-pedidos', ['CLIENTE', 'PEDIDO', 'ITEM_PEDIDO', 'PRODUTO', 'ORDEM_PRODUCAO']),
    ('01b-der-itens-producao', ['ORDEM_PRODUCAO', 'ITEM_OP', 'ITEM_PEDIDO', 'PRODUTO', 'RECEITA_VERSAO']),
    ('01c-der-expedicao', ['PEDIDO', 'EXPEDICAO', 'ITEM_PEDIDO', 'ITEM_EXPEDICAO']),
    ('03a-der-reservas-cancelamento', ['ORDEM_PRODUCAO', 'INSUMO', 'RESERVA_INSUMO', 'CANCELAMENTO_OP', 'APURACAO_INSUMO', 'ITEM_OP', 'APROVEITAMENTO_PRODUTO']),
    ('03b-der-movimentos-insumos', ['INSUMO', 'MOV_INSUMO', 'ITEM_COMPRA', 'RESERVA_INSUMO', 'APURACAO_INSUMO']),
    ('03c-der-movimentos-produtos', ['PRODUTO', 'MOV_PRODUTO', 'ITEM_OP', 'APROVEITAMENTO_PRODUTO', 'ITEM_EXPEDICAO']),
]
manifesto['detalhes'] = []
for nome, nomes in detalhes:
    conjunto = set(nomes)
    linhas_relacoes = [linha for linha in texto_completo.splitlines() if '--' in linha and ':' in linha and {linha.split()[0], linha.split()[2]} <= conjunto]
    linhas = ['erDiagram'] + linhas_relacoes
    for nome_entidade in nomes:
        linhas.append(f'  {nome_entidade} {{\n{entidades[nome_entidade]}  }}')
    (FONTES / (nome+'.mmd')).write_text('\n'.join(linhas)+'\n', encoding='utf-8')
    manifesto['arquivos'].append(nome)
    manifesto['detalhes'].append(nome)

modelo = BASE / 'casos-de-uso/casos-de-uso.drawio'
registrar(modelo)
shutil.copyfile(modelo, FONTES / 'casos-de-uso-original.drawio')
celulas = list(ET.parse(modelo).iter('mxCell'))
casos = {}
associacoes = set()
atores = {}
for celula in celulas:
    identificador = celula.get('id', '')
    valor = html.unescape(re.sub('<[^>]+>', ' ', celula.get('value', '')))
    valor = ' '.join(valor.split())
    if re.fullmatch(r'CU\d+', identificador):
        casos[identificador] = valor
    if identificador.startswith('actor-label-'):
        atores['actor-' + identificador.removeprefix('actor-label-')] = valor
    if celula.get('edge') == '1':
        associacoes.add((celula.get('source'), celula.get('target')))
casos['CU21'] = 'CU21 Configurar política por insumo'
casos['CU22'] = 'CU22 Consultar reposição e resultados'
atores['actor-autorizado-pcp'] = 'Usuário interno autorizado (PCP como referência)'
associacoes.update({('actor-autorizado-pcp', 'CU21'), ('actor-autorizado-pcp', 'CU22')})
registrar(BASE / 'casos-de-uso/reposicao.mmd')
grupos = [
    ('06-casos-pedidos-planejamento', 'Pedidos e planejamento', ['actor-comercial', 'actor-pcp', 'actor-autorizado-pcp']),
    ('07-casos-operacao', 'Compras, estoques, produção e expedição', ['actor-compras', 'actor-estoque', 'actor-producao', 'actor-expedicao']),
    ('08-casos-cadastros-financeiro', 'Cadastros, acessos e valores operacionais', ['actor-interno', 'actor-financeiro']),
]

def escapar(texto):
    return html.escape(str(texto), quote=True)

def linhas_svg(texto, centro, topo, largura=54, tamanho=19, peso='normal'):
    linhas = textwrap.wrap(texto, width=largura)
    return ''.join(f'<text x="{centro}" y="{topo + indice * (tamanho + 5)}" text-anchor="middle" font-size="{tamanho}" font-weight="{peso}">{escapar(linha)}</text>' for indice, linha in enumerate(linhas))

vistos = set()
pares_vistos = set()
for nome, titulo, selecionados in grupos:
    alturas = [max(150, len([caso for ator, caso in associacoes if ator == ator_atual]) * 106 + 36) for ator_atual in selecionados]
    altura = 130 + sum(alturas)
    partes = [f'<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 1100 {altura}" width="1100" height="{altura}" font-family="Arial, sans-serif" fill="#172033">', f'<rect width="1100" height="{altura}" fill="white"/>', linhas_svg(titulo, 550, 35, 85, 24, 'bold'), f'<rect x="300" y="65" width="770" height="{altura-110}" fill="#fafcfe" stroke="#334155" stroke-width="2"/>', linhas_svg('Sistema de gestão integrada — vista funcional', 685, 91, 75, 17)]
    topo = 110
    for ator, altura_grupo in zip(selecionados, alturas):
        selecionados_casos = sorted([caso for referencia, caso in associacoes if referencia == ator], key=lambda caso: int(caso[2:]))
        centro_ator = topo + altura_grupo / 2 - 18
        partes.append(f'<g stroke="#334155" stroke-width="2.4" fill="none"><circle cx="130" cy="{centro_ator-32}" r="14"/><path d="M130 {centro_ator-18} v46 m-32 -28 h64 m-32 28 l-25 33 m25 -33 l25 33"/></g>')
        partes.append(linhas_svg(atores[ator], 130, centro_ator + 83, 25, 18))
        for indice, caso in enumerate(selecionados_casos):
            centro = topo + 50 + indice * 106
            partes.append(f'<path d="M162 {centro_ator} H260 V{centro} H380" fill="none" stroke="#64748b" stroke-width="1.6"/>')
            partes.append(f'<ellipse cx="710" cy="{centro}" rx="330" ry="44" fill="white" stroke="#334155" stroke-width="1.6"/>')
            texto_linhas = textwrap.wrap(casos[caso], width=52)
            partes.append(linhas_svg(casos[caso], 710, centro - (len(texto_linhas)-1)*12 + 6, 52, 19))
            vistos.add(caso)
            pares_vistos.add((ator, caso))
        topo += altura_grupo
    partes.append(linhas_svg('Associações sem setas. Papéis acumuláveis; permissões específicas permanecem em PD06.', 550, altura-16, 115, 14))
    partes.append('</svg>')
    (DESTINO / (nome + '.svg')).write_text('\n'.join(partes), encoding='utf-8')
    manifesto['arquivos'].append(nome)
assert vistos == set(casos), ('Casos omitidos', set(casos)-vistos)
assert pares_vistos == associacoes, ('Associações omitidas', associacoes-pares_vistos)
manifesto['casos'] = sorted(vistos)
manifesto['relacoes_der'] = len(relacoes_vistas)
manifesto['associacoes_casos'] = len(associacoes)

arquitetura = BASE.parent / '04-arquitetura/componentes.mmd'
registrar(arquitetura)
original = arquitetura.read_text(encoding='utf-8')
(FONTES / '09-arquitetura-componentes.mmd').write_text(original.replace('flowchart LR', 'flowchart TB', 1), encoding='utf-8')
manifesto['arquivos'].append('09-arquitetura-componentes')
(DESTINO / 'manifesto.json').write_text(json.dumps(manifesto, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'{len(relacoes_vistas)} relações do DER e {len(vistos)} casos de uso com todas as associações preservados.')
