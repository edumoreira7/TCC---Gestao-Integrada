# Diagrama de classes de domínio

**Referência:** imagem oficial “WhatsApp Image 2026-10-20 at 18.04.45.jpeg”, fornecida pelo solicitante.<br>
**Revisão:** 15/11/2026 — alinhamento às decisões confirmadas do DER.<br>
**Status:** versão oficial transcrita para revisão, com ajustes de consistência documentados abaixo.

[Fonte editável no diagrams.net/draw.io](classes-dominio.drawio), com três vistas complementares do mesmo modelo. Classes repetidas entre vistas representam o mesmo conceito. Atributos são de análise; não definem tabelas, tipos técnicos nem obrigatoriedade de todos os campos.

## Pedidos, receitas, produção e expedição

![Pedidos, receitas, produção e expedição](pedidos-receitas-producao.png)

| Classe A | Multiplicidade junto a A | Relação | Multiplicidade junto a B | Classe B |
|---|---|---|---|---|
| Cliente | 1 | realiza | 0..* | Pedido |
| Pedido | 1 | contém (composição) | 1..* | ItemPedido |
| ItemPedido | 0..* | referencia | 1 | Produto |
| Pedido | 0..1 | gera no registro | 1 | OrdemProducao |
| OrdemProducao | 1 | contém (composição) | 1..* | ItemOrdemProducao |
| ItemOrdemProducao | 0..* | produz | 1 | Produto |
| Produto | 1 | versões (no máximo uma ativa) | 0..* | Receita |
| ItemOrdemProducao | 0..* | versão utilizada | 1 | Receita |
| Receita | 1 | composta por (composição) | 1..* | ItemReceita |
| ItemReceita | 0..* | utiliza | 1 | Insumo |
| Pedido | 1 | atendimento integral | 0..1 | Expedicao |
| Expedicao | 1 | contém (composição) | 1..* | ItemExpedicao |
| ItemExpedicao | 0..* | expede | 1 | Produto |

Cada pedido gera exatamente uma OP, automaticamente no registro. O `0..1` junto a Pedido permite que a OP manual não tenha pedido de origem; não torna opcional a OP do pedido. A expedição é integral e registra todos os produtos e quantidades do pedido. Produção e expedição parciais continuam fora do escopo.

Receita representa uma versão publicada: composição e rendimento imutáveis, no máximo uma ativa por produto. OP não iniciada acompanha a ativa e recalcula lotes e necessidades; OP iniciada preserva a versão usada. ItemOrdemProducao distingue solicitada, lotes e planejada. Quantidade expedida pertence ao ItemExpedicao.

## Compras e recebimentos

![Compras e recebimentos](compras-recebimentos.png)

| Classe A | Multiplicidade junto a A | Relação | Multiplicidade junto a B | Classe B |
|---|---|---|---|---|
| Fornecedor | 1 | fornece | 0..* | Compra |
| Compra | 1 | contém (composição) | 1..* | ItemCompra |
| ItemCompra | 0..* | adquire | 1 | Insumo |
| Compra | 1 | recebimento integral | 0..1 | RecebimentoInsumo |

Compra não aumenta estoque nem preço de referência. Admite um único recebimento integral, com data/hora; seus itens são os itens da compra, sem ItemRecebimento parcial. Confirmar gera todas as entradas uma única vez (RF36/RN28).

## Estoques e financeiro provisório

![Estoques e financeiro provisório](estoques-financeiro.png)

| Classe A | Multiplicidade junto a A | Relação | Multiplicidade junto a B | Classe B |
|---|---|---|---|---|
| Produto | 0..1 | histórico de produtos | 0..* | MovimentacaoEstoque |
| Insumo | 0..1 | histórico de insumos | 0..* | MovimentacaoEstoque |

**Restrição exclusiva e obrigatória:** cada MovimentacaoEstoque referencia exatamente um Produto **ou** um Insumo, nunca ambos ou nenhum. As duas multiplicidades `0..1` são complementadas pela nota `{xor}` e por esta regra. Produto e Insumo não se relacionam entre si como “item de estoque”; não há herança presumida.

`/estoqueAtual` é saldo derivado do histórico em unidade compatível, sem definir persistência. Origens: recebimento, conclusão, cancelamento ou expedição, conforme o estoque. Iniciar reserva insumos; concluir baixa insumos, encerra reservas e recebe acabados. Cancelar apura consumo/perdas sem duplicidade, libera o restante reservado e recebe produtos aproveitáveis (RF34–RF36/RN26–RN29 já documentados na branch).

RegistroFinanceiro preserva os atributos da referência oficial e permanece provisório, sem associações ou eventos automáticos presumidos. Não representa pagamentos, contas a pagar/receber ou contabilidade. Custo usa receita e preço da compra efetivamente recebida mais recentemente, pela data/hora do recebimento dos insumos, com rendimento e unidades compatíveis; preço de venda é manual. Eventos financeiros (PD05), desempate de recebimentos e conversões (PD11) permanecem pendentes.

## Ajustes em relação à imagem oficial

| Ponto | Ajuste e fundamento |
|---|---|
| Pedido → OP | `0..1` junto a Pedido e `1` junto à OP: origem manual permitida, OP única obrigatória por pedido (RF13/RN09/RN10/RN13). |
| Itens → Produto/Insumo | Cada item referencia exatamente um produto ou insumo; um cadastro pode aparecer em vários itens. Corrigidas multiplicidades ausentes ou ambíguas. |
| Produto → Receita | Associação explícita de receita de referência com rendimento (RN01/RN02); substitui o traçado ambíguo que alcançava ItemPedido. |
| Recebimento | Compra 1 → 0..1 RecebimentoInsumo integral, sem ItemRecebimento; substitui regra anterior conforme confirmação de 15/11/2026. |
| Estoques | MovimentacaoEstoque única, como na imagem, com referência exclusiva a Produto ou Insumo; removida associação ambígua entre cadastros (RN06–RN08/RN11/RN15). |
| Expedição | Associação estrutural Pedido–Expedicao com multiplicidades, em lugar de dependência tracejada; atendimento integral mantido (RN19). |
| Custo e financeiro | Preço da compra recebida mais recentemente, com fallback inicial e indisponibilidade sem preço (RN22); financeiro provisório sem vínculos inventados (RN25/PD05). |
| Detalhamentos anteriores | Reserva, composição preservada e cancelamento continuam nas regras/notas. Classes auxiliares propostas no rascunho não são mantidas como estrutura obrigatória da versão oficial. |

ItemOrdemProducao, ItemReceita, RecebimentoInsumo e RegistroFinanceiro mantêm os nomes; Receita representa a versão e ItemRecebimento foi removido. As quatro imagens anteriores foram substituídas pelas três vistas acima; há uma fonte editável. As exportações podem ser regeneradas com `python docs/03-modelagem/render_drawio.py` (Pillow e Arial ou DejaVu Sans); o renderizador valida que os textos cabem nos blocos.

## Pendências e alinhamento com o fluxo

- **PD12 — consulta ao estoque acabado:** decidir se o estoque de produtos acabados será consultado antes de dimensionar a necessidade de produção e como afetará as quantidades. Permanece a OP única obrigatória por pedido; não foi criado atendimento direto sem OP. PD09 permanece como registro histórico, sem reutilizar seu identificador.
- Estados e dados obrigatórios (PD02/PD04/PD08), permissões (PD06), financeiro (PD05), concorrência técnica (PD10), preços/unidades (PD11) e detalhes restantes de cancelamento (PD03) continuam abertos.
- Fluxo macro, RF13, RN10 e CU06 estão alinhados à geração automática no registro do pedido.
- Usuários e perfis continuam em RF32/RN24 e no catálogo funcional. A referência oficial não detalha acesso; a ausência dessas classes nesta vista não remove o requisito.

## Rastreabilidade

Base: [escopo e requisitos](../../02-requisitos/escopo-e-requisitos.md), [catálogo funcional](../../02-requisitos/atores-casos-de-uso-regras-de-negocio.md), [decisões](../../01-visao-geral/decisoes-do-projeto.md) e [fluxo macro](../fluxo-macro/README.md).

| Área | Requisitos e regras principais |
|---|---|
| Clientes, produtos, insumos e receitas | RF01–RF05; RN01–RN02 |
| Pedidos e produção | RF11–RF18, RF25–RF29, RF34–RF35; RN09–RN10, RN13, RN16–RN17, RN20–RN21, RN26–RN27, RN29 |
| Compras e recebimento | RF09–RF10, RF24, RF27, RF36; RN06, RN14–RN15, RN28 |
| Estoques e expedição | RF06–RF08, RF19–RF22; RN07–RN08, RN11, RN18–RN19 |
| Custos, preços e financeiro | RF23–RF24, RF30–RF31, RF33; RN22–RN23, RN25 |

## Alinhamento confirmado pelo grupo — 15/11/2026

Esta revisão prevalece sobre descrições históricas conflitantes. O [DER](../dados/README.md) mantém o modelo de persistência proposto.

- Recebimento único integral: uma compra admite zero ou um recebimento, sempre integral; confirmar gera todas as entradas uma única vez. Registrar a compra não altera estoque nem preço de referência.
- Lotes inteiros, inclusive OP manual: lotes = teto(solicitada / rendimento); planejada = lotes × rendimento; insumos = composição por lote × lotes. Pedido de 15 com rendimento 10 gera entrada de 20 e expedição de 15; excedente de 5 fica em estoque. Uma OP automática por pedido. PD12 (abater estoque acabado) permanece pendente; a demo não abate.
- Versões publicadas da receita têm composição e rendimento imutáveis, com no máximo uma ativa por produto. OP não iniciada acompanha a ativa e recalcula; iniciada preserva versão e quantidades.
- Preço de referência: preço da compra efetivamente recebida mais recentemente, pela data/hora do recebimento; sem recebimento, preço inicial opcional; sem preço, custo indisponível. Desempate pelo maior ID de recebimento é provisório, conforme proposta do DER. Preços históricos dos pedidos são preservados.
- Cancelamento exige motivo e apuração de cada insumo reservado, inclusive zero; consumo exclui perdas. Baixa ambos uma vez, libera a reserva restante e recebe produtos aproveitáveis vinculados à mesma OP. Não admite conclusão parcial normal ou expedição parcial. Limites provisórios: consumo + perdas até reservado; aproveitamento até planejado. Rejeitar divergências sem truncar. Justificativa: evitar saldo negativo ou entrada superior ao plano enquanto a política de exceções aguarda aprovação.
- Kanban acompanha etapas por produto da OP e não movimenta estoque; conclusão integral registra baixas e entradas. Exigir todos os cards concluídos é uma escolha demonstrativa ainda sujeita a validação.
- Frontend local acadêmico, sem backend, API, autenticação real, hospedagem ou PostgreSQL em execução. Reservas virtuais e troca de estado local demonstram regras; garantias de transação, segurança e concorrência multiusuário dependem do futuro backend. PostgreSQL permanece a escolha futura (DT01).
