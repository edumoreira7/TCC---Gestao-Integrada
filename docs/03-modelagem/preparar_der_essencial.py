from pathlib import Path
import hashlib
import json
import re

BASE = Path(__file__).resolve().parent
DESTINO = BASE / 'der-artigo-essencial'
FONTES = DESTINO / 'fontes'
FONTES.mkdir(parents=True, exist_ok=True)
origens = [BASE / 'dados/der-gestao-integrada.mmd', BASE / 'dados/reposicao-dados.mmd']
texto = '\n'.join(arquivo.read_text(encoding='utf-8') for arquivo in origens)
relacoes = [linha.strip() for linha in texto.splitlines() if '--' in linha and ':' in linha]
entidades = {nome: corpo for nome, corpo in re.findall(r'^\s*(\w+)\s*\{\s*\n(.*?)^\s*\}', texto, re.M | re.S)}
nome_geral = '00-der-geral-entidades'
rotulos = {
    'CLIENTE': 'Cliente', 'PEDIDO': 'Pedido', 'ITEM_PEDIDO': 'Item do pedido',
    'PRODUTO': 'Produto', 'ORDEM_PRODUCAO': 'Ordem de produção', 'ITEM_OP': 'Item da OP',
    'RECEITA_VERSAO': 'Versão de receita', 'ITEM_RECEITA': 'Item da receita', 'INSUMO': 'Insumo',
    'EXPEDICAO': 'Expedição', 'ITEM_EXPEDICAO': 'Item da expedição',
    'FORNECEDOR': 'Fornecedor', 'COMPRA': 'Compra', 'ITEM_COMPRA': 'Item da compra',
    'RECEBIMENTO': 'Recebimento', 'RESERVA_INSUMO': 'Reserva de insumo',
    'CANCELAMENTO_OP': 'Cancelamento da OP', 'APURACAO_INSUMO': 'Apuração de insumo',
    'APROVEITAMENTO_PRODUTO': 'Aproveitamento de produto',
    'MOV_INSUMO': 'Movimento de insumo', 'MOV_PRODUTO': 'Movimento de produto',
    'USUARIO': 'Usuário', 'PERFIL': 'Perfil', 'USUARIO_PERFIL': 'Usuário por perfil',
    'ETAPA_OP': 'Etapa da OP', 'CONFIG_REPOSICAO': 'Configuração de reposição',
    'SERIE_CONSUMO': 'Série de consumo', 'CONSUMO_PERIODO': 'Consumo por período',
    'CALCULO_REPOSICAO': 'Cálculo de reposição',
}
nucleo = {'CLIENTE','PEDIDO','ITEM_PEDIDO','PRODUTO','ORDEM_PRODUCAO','ITEM_OP','RECEITA_VERSAO','ITEM_RECEITA','INSUMO','RESERVA_INSUMO','MOV_INSUMO','MOV_PRODUTO','ETAPA_OP'}
relacoes_nucleo = [linha for linha in relacoes if {linha.split()[0],linha.split()[2]} <= nucleo]
geral = ['erDiagram'] + [f'  {entidade}["{rotulo}"]' for entidade, rotulo in rotulos.items() if entidade in nucleo] + [linha.split(':', 1)[0] + ': " "' for linha in relacoes_nucleo]
(FONTES / (nome_geral + '.mmd')).write_text('\n'.join(geral)+'\n', encoding='utf-8')
(FONTES / 'referencia-modelo-completo.mmd').write_text('erDiagram\n'+texto.replace('erDiagram','',2).strip()+'\n', encoding='utf-8')
recortes = {
    '01-pedido-e-producao': {
        'CLIENTE': ['id', 'nome'],
        'PEDIDO': ['id', 'cliente_id', 'status'],
        'ITEM_PEDIDO': ['id', 'pedido_id', 'produto_id', 'quantidade'],
        'PRODUTO': ['id', 'nome'],
        'ORDEM_PRODUCAO': ['id', 'pedido_id', 'status'],
        'ITEM_OP': ['id', 'op_id', 'produto_id', 'item_pedido_id', 'receita_versao_id', 'quantidade_solicitada', 'lotes_planejados'],
    },
    '02-produto-receita-e-materia-prima': {
        'PRODUTO': ['id', 'nome'],
        'RECEITA_VERSAO': ['id', 'produto_id', 'versao', 'rendimento', 'ativa'],
        'ITEM_RECEITA': ['receita_versao_id', 'insumo_id', 'quantidade_padrao'],
        'INSUMO': ['id', 'nome', 'unidade_padrao'],
    },
    '03-reserva-e-consumo-de-materia-prima': {
        'ORDEM_PRODUCAO': ['id', 'pedido_id', 'status'],
        'RESERVA_INSUMO': ['id', 'op_id', 'insumo_id', 'quantidade_reservada'],
        'INSUMO': ['id', 'nome', 'unidade_padrao'],
        'MOV_INSUMO': ['id', 'insumo_id', 'reserva_id', 'tipo', 'quantidade'],
    },
    '04-producao-etapas-e-produtos-acabados': {
        'ORDEM_PRODUCAO': ['id', 'pedido_id', 'status'],
        'ITEM_OP': ['id', 'op_id', 'produto_id', 'quantidade_solicitada', 'lotes_planejados'],
        'PRODUTO': ['id', 'nome'],
        'ETAPA_OP': ['id', 'item_op_id', 'titulo', 'ordem', 'situacao'],
        'MOV_PRODUTO': ['id', 'produto_id', 'item_op_id', 'tipo', 'quantidade'],
    },
}
for nome, selecao in recortes.items():
    conjunto = set(selecao)
    linhas = ['erDiagram'] + [linha for linha in relacoes if {linha.split()[0], linha.split()[2]} <= conjunto]
    for entidade, campos in selecao.items():
        linhas.append('  '+entidade+' {')
        encontrados = set()
        for linha in entidades[entidade].splitlines():
            partes = linha.split()
            if len(partes) > 1 and partes[1] in campos:
                linhas.append(linha)
                encontrados.add(partes[1])
        assert encontrados == set(campos), (entidade, campos, encontrados)
        linhas.append('  }')
    (FONTES / (nome+'.mmd')).write_text('\n'.join(linhas)+'\n', encoding='utf-8')
manifesto = {
    'base': 'b39d9a36b28f191c4de299986039a8f9a9dd8167',
    'arquivos': [nome_geral] + list(recortes),
    'renderizar': [nome_geral] + list(recortes),
    'entidades_geral': sorted(nucleo),
    'relacoes_geral': len(relacoes_nucleo),
    'relacoes_modelo_completo': len(relacoes),
    'rotulos_geral': {nome: rotulos[nome] for nome in nucleo},
    'fontes': {arquivo.relative_to(BASE.parent.parent).as_posix(): hashlib.sha256(arquivo.read_bytes()).hexdigest() for arquivo in origens},
    'aviso': 'Visão geral sem atributos e recortes com atributos essenciais; não substituem o modelo lógico completo.'
}
(DESTINO/'manifesto.json').write_text(json.dumps(manifesto, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(f'Geral: {len(nucleo)} entidades e {len(relacoes_nucleo)} relações; quatro recortes essenciais.')
