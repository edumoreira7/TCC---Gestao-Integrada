# Diagrama de classes de domínio

**Status:** rascunho para revisão na branch `docs/diagrama-classes-dominio`.

Base: RF01–RF33, RN01–RN25 e catálogo de casos de uso na main. Atributos são uma proposta mínima de análise, não um esquema de banco nem lista definitiva de dados obrigatórios. `/` indica informação derivada. Não foram incluídos métodos de infraestrutura, tabelas de junção ou controladores.

[Arquivo editável com as três vistas](classes-dominio.drawio).

## Pedidos, receitas e produção

![Pedidos, receitas e produção](pedidos-producao.png)

| Classe A | Multiplicidade junto a A | Relação | Multiplicidade junto a B | Classe B |
|---|---|---|---|---|
| Cliente | 1 | recebe | 0..* | Pedido |
| Pedido | 1 | compõe | 1..* | ItemPedido |
| ItemPedido | 0..* | refere-se | 1 | Produto |
| Pedido | 0..1 | gera automaticamente | 1 | OrdemProducao |
| OrdemProducao | 1 | compõe | 1..* | ItemOrdem |
| ItemOrdem | 0..* | produz | 1 | Produto |
| Produto | 1 | receita de referência | 1 | Receita |
| Receita | 1 | compõe | 1..* | ComponenteReceita |
| ComponenteReceita | 0..* | utiliza | 1 | Insumo |
| OrdemProducao | 1 | calcula | 0..* | NecessidadeInsumo |
| NecessidadeInsumo | 0..* | totaliza | 1 | Insumo |
| Pedido | 1 | atendido por | 0..1 | Expedicao |
| Expedicao | 1 | compõe | 1..* | ItemExpedicao |
| ItemExpedicao | 0..* | expede | 1 | Produto |

- Pedido registrado possui exatamente uma OP. OP manual não possui pedido de origem.
- Necessidade de insumo é informação calculada: 0 itens antes do dimensionamento; persistência não definida.
- Expedição integral: todos os itens do pedido; exige OP concluída e estoque suficiente. Sem entregas parciais.
- Receita de referência única; histórico da composição da OP aguarda decisão. Estados completos: PD02/PD08.

## Compras, recebimentos e estoques

![Compras, recebimentos e estoques](compras-estoques.png)

| Classe A | Multiplicidade junto a A | Relação | Multiplicidade junto a B | Classe B |
|---|---|---|---|---|
| Fornecedor | 1 | fornece | 0..* | Compra |
| Compra | 1 | compõe | 1..* | ItemCompra |
| ItemCompra | 0..* | adquire | 1 | Insumo |
| Compra | 1 | recebimentos [proposta] | 0..* | Recebimento |
| Recebimento | 1 | compõe | 1..* | ItemRecebimento |
| ItemRecebimento | 0..* | confere item | 1 | ItemCompra |
| ItemRecebimento | 0..1 | gera entrada | 1 | MovimentacaoInsumo |
| MovimentacaoInsumo | 0..* | movimenta | 1 | Insumo |
| Insumo | 1 | saldo agregado | 1 | SaldoInsumo |
| OrdemProducao | 0..1 | gera consumo na conclusão | 0..* | MovimentacaoInsumo |
| OrdemProducao | 0..1 | gera entrada na conclusão | 0..* | MovimentacaoProduto |
| Produto | 1 | movimentações | 0..* | MovimentacaoProduto |
| Produto | 1 | saldo agregado | 1 | SaldoProduto |
| Expedicao | 0..1 | gera saída | 1..* | MovimentacaoProduto |

- Compra não gera entrada de estoque; o recebimento efetivo gera as movimentações de entrada.
- Movimentação de insumo tem origem exclusiva: item recebido OU conclusão de OP. Produto: conclusão OU expedição.
- Saldo é uma visão derivada do histórico; não define tabela, serviço ou mecanismo de persistência.
- Compra → recebimentos 0..* é proposta para revisão: recebimentos parciais não estão aprovados.
- Reservas/concorrência (PD10) e consumo/perdas no cancelamento (PD03) aguardam decisão; não são modelados como aprovados.

## Acessos e valores das operações

![Acessos e valores das operações](acessos-valores.png)

| Classe A | Multiplicidade junto a A | Relação | Multiplicidade junto a B | Classe B |
|---|---|---|---|---|
| Usuario | 0..* | acumula | 0..* | Perfil |
| Perfil | 0..* | concede [PD06] | 0..* | Permissao |
| Compra | 0..1 | origem [PD05] | 0..* | RegistroValorOperacao |
| Expedicao | 0..1 | origem [PD05] | 0..* | RegistroValorOperacao |
| Produto | 1 | custo pela receita | 1 | Receita |
| Receita | 0..* | via ComponenteReceita | 1..* | Insumo |

- Usuário acumula perfis; atribuições concretas dependem de PD06. Cliente e fornecedor não são usuários externos.
- Perfil → permissão é proposta estrutural; não concede permissões específicas nem define administrador.
- Registro financeiro é conceitual: origem exclusiva compra OU venda/expedição. Eventos e automatização pendentes (PD05).
- Custo e último preço são derivados: receita, quantidades, rendimento e unidades compatíveis; critérios pendentes em PD11.
- Sem contas a pagar/receber, pagamentos bancários ou contabilidade. Não existe classe Financeiro para representar um setor.

## Decisões aguardando o solicitante

1. Reserva de insumos: na criação, no início ou decisão posterior (PD10).
2. Preservar a composição original da receita na OP ou atualizar ordens não iniciadas.
3. Cancelamento: quantidades consumidas, perdas e produtos aproveitáveis (PD03).
4. Recebimento integral ou possibilidade de vários recebimentos por compra.

As propostas identificadas não alteram requisitos aprovados. O modelo deve ser ajustado às respostas antes de ser integrado à main.

## Rastreabilidade

| Área | Requisitos |
|---|---|
| Produtos, insumos, receitas e parceiros | RF01–RF05 |
| Saldos e movimentações | RF06–RF08, RF19–RF22 |
| Compras e recebimento | RF09–RF10, RF24, RF27 |
| Pedidos, ordens e necessidades | RF11–RF18, RF25–RF29 |
| Custos, preços e valores | RF23–RF24, RF30–RF31, RF33 |
| Usuários e perfis | RF32 |
