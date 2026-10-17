# Atores, Casos de Uso e Regras de Negócio

**Versão:** 0.1<br>
**Revisão:** 13/10/2026<br>
**Status:** Proposta consolidada para revisão coletiva da Issue #2.

Este documento detalha responsabilidades e casos de uso a partir do [escopo e requisitos](escopo-e-requisitos.md), das [decisões do projeto](../01-visao-geral/decisoes-do-projeto.md) e do [fluxo macro](../03-modelagem/fluxo-macro/README.md). Os identificadores RF, RN e PD referem-se ao documento de escopo.

## 1. Atores e acesso

Os atores representam papéis funcionais internos, não pessoas distintas. Um usuário pode acumular vários perfis ou conjuntos de permissões.

| Ator de referência | Responsabilidades |
|---|---|
| Comercial | Cadastrar e consultar clientes; registrar pedidos com vários produtos e quantidades; informar preços de venda e alterar pedidos antes do início da produção. |
| PCP (Planejamento e Controle da Produção) | Criar ordens a partir de pedidos ou manualmente; consultar receitas e necessidades de insumos; identificar faltas e acionar Compras; acompanhar ordens. |
| Compras | Cadastrar e consultar fornecedores; registrar aquisições de insumos, quantidades e preços. |
| Estoque | Consultar saldos e histórico; registrar recebimento de insumos; acompanhar as movimentações da conclusão da produção e da expedição. |
| Produção | Iniciar, executar e concluir integralmente a produção; registrar informações de cancelamento, conforme regra ainda a detalhar. |
| Expedição | Registrar a expedição integral vinculada a um pedido, com destinatário, produtos, quantidades e data. |
| Financeiro | Consultar valores das operações e realizar registros básicos conforme eventos e permissões ainda a detalhar. |

Cliente e fornecedor são entidades cadastradas, não atores com acesso ao sistema. O sistema executa cálculos e movimentações decorrentes das operações; não deve aparecer como ator de si próprio no diagrama de casos de uso.

A atribuição detalhada de manutenção de produtos, insumos, receitas e acessos depende da matriz de permissões (PD06). Os papéis acima são referência funcional, não uma matriz definitiva de autorização.

## 2. Catálogo de casos de uso

| ID | Caso de uso | Ator de referência | Requisitos relacionados |
|---|---|---|---|
| CU01 | Manter insumos | A definir em PD06 | RF01 |
| CU02 | Manter produtos e fichas técnicas/receitas | A definir em PD06 | RF02, RF03 |
| CU03 | Manter fornecedores | Compras | RF04 |
| CU04 | Manter clientes | Comercial | RF05 |
| CU05 | Consultar saldos e histórico de estoque | Estoque, PCP | RF06, RF07, RF08 |
| CU06 | Registrar pedido | Comercial | RF12 |
| CU07 | Alterar pedido antes da produção | Comercial | RF25 |
| CU08 | Criar ordem a partir de pedido | PCP | RF13, RF14, RF15, RF16 |
| CU09 | Criar ordem manual | PCP | RF11, RF14, RF15, RF16 |
| CU10 | Acompanhar ordem e necessidade de reposição | PCP | RF15, RF17, RF18, RF26 |
| CU11 | Registrar compra de insumos | Compras | RF09, RF24 |
| CU12 | Registrar recebimento de insumos | Estoque | RF10, RF27 |
| CU13 | Iniciar produção | Produção | RF17, RF18, RF27 |
| CU14 | Concluir produção integral | Produção | RF19, RF20, RF28 |
| CU15 | Registrar cancelamento durante a produção | Produção; autorização a definir | RF29; detalhamento em PD03 |
| CU16 | Registrar expedição integral do pedido | Expedição | RF21, RF22 |
| CU17 | Calcular/consultar custo do produto | PCP; demais acessos a definir | RF30 |
| CU18 | Cadastrar preço de venda | Comercial | RF31 |
| CU19 | Registrar/consultar valores básicos das operações | Financeiro | RF23, RF24, RF33; eventos em PD05 |
| CU20 | Administrar perfis e permissões acumuláveis | Ator administrador a definir em PD06 | RF32 |

O catálogo não define relações UML `include`/`extend`; elas deverão ser avaliadas no diagrama de casos de uso. Consulta de receitas, cálculo de insumos, verificação de disponibilidade e movimentações automáticas integram os fluxos detalhados abaixo.

## 3. Fluxos principais

### CU06 e CU07: registrar e alterar pedido

1. Comercial associa um cliente cadastrado ao pedido.
2. Informa um ou mais produtos e suas quantidades.
3. O sistema registra o pedido.
4. Antes do início da produção, Comercial pode alterar o pedido. Se já houver ordem vinculada, os itens e o cálculo de insumos devem refletir a alteração antes de iniciar.

**Limites:** alteração após o início da produção não é permitida. Dados obrigatórios restantes e estados do pedido dependem de PD02. Todo pedido deverá gerar uma ordem de produção, mesmo com estoque acabado suficiente; atendimento direto sem ordem não faz parte do fluxo.

### CU08 e CU09: criar ordem de produção

1. PCP seleciona um pedido ou cria uma ordem manual.
2. A ordem recebe um ou mais produtos e suas quantidades; na origem por pedido, corresponde aos itens desse pedido.
3. O sistema consulta as fichas técnicas e dimensiona os insumos pelo rendimento de cada receita.
4. O sistema soma a necessidade de cada insumo, inclusive quando utilizado em vários produtos.
5. O sistema compara a necessidade total com a disponibilidade no estoque.
6. Com faltas, a ordem aguarda reposição; PCP identifica os itens e aciona Compras. Com todos os insumos disponíveis, a ordem pode seguir para início da produção.

**Resultado:** uma única ordem deverá ser criada para todo pedido, inclusive com estoque acabado suficiente. O pedido pode ainda não ter vínculo enquanto aguarda sua criação. Criar a ordem não consome insumos. Reserva de estoque e concorrência entre ordens dependem de PD10.

### CU11 e CU12: comprar e receber insumos

1. Compras registra aquisição, fornecedor, insumos, quantidades e preços.
2. O registro da compra não altera o saldo do estoque.
3. No recebimento efetivo, Estoque registra os insumos recebidos e a entrada correspondente.
4. A disponibilidade para as ordens aguardando reposição é reavaliada.
5. Somente com todos os insumos necessários disponíveis a produção poderá iniciar.

**Limites:** sem criação/envio automático de pedidos de compra. Recebimentos parciais e sua rastreabilidade não foram definidos pelo grupo e não são presumidos como aprovados neste fluxo.

### CU13 e CU14: iniciar e concluir produção

1. Produção solicita o início da ordem.
2. O sistema verifica a disponibilidade dos insumos e bloqueia o início se houver faltas.
3. Produção executa a ordem.
4. Produção registra sua conclusão integral.
5. Na conclusão, o sistema registra a baixa dos insumos e a entrada de todos os produtos acabados correspondentes.

**Limites:** sem conclusão parcial. A baixa normal ocorre somente na conclusão, nunca na criação ou no início. O mecanismo de integridade das movimentações será definido na arquitetura; as duas movimentações representam a mesma conclusão.

### CU15: cancelamento durante a produção

O registro deve incluir motivo e situação dos insumos e produtos. Produto acabado aproveitável poderá ser incorporado ao estoque. Consumo efetivo, perdas, quantidades aproveitadas, autorizações e movimentações dependem de PD03; este caso de uso ainda não possui fluxo completo aprovado.

### CU16: expedir pedido

1. Expedição seleciona o pedido e os produtos acabados correspondentes no estoque.
2. Registra destinatário, produtos, quantidades e data para atendimento integral.
3. O sistema registra a expedição vinculada ao pedido e a saída correspondente do estoque.

**Limites:** produtos passam pelo estoque antes de expedir. Não haverá expedição parcial nem atendimento direto sem ordem de produção. Transições e dados restantes dependem de PD04.

### CU17 a CU19: custos, preços e valores das operações

O custo de insumos de uma receita corresponde à soma das quantidades de cada componente multiplicadas pelo seu último preço de compra conhecido, em unidades compatíveis. O custo por unidade do produto considera o rendimento da receita. Critério temporal do preço, ausência de preço e conversões ainda dependem de PD11.

O preço de venda é cadastrado manualmente. O acompanhamento financeiro registra valores básicos das operações, sem confirmar pagamentos bancários e sem contas a pagar/receber ou contabilidade completa. Eventos, automatização e estornos dependem de PD05.

## 4. Regras de negócio e rastreabilidade

O [catálogo RN01 a RN25](escopo-e-requisitos.md#7-regras-de-negócio-iniciais) é a referência das regras de negócio. Esta visão agrupa os vínculos para revisão:

| Tema | Regras | Casos de uso |
|---|---|---|
| Receitas, rendimento e necessidade total | RN01, RN02, RN03 | CU02, CU08, CU09, CU17 |
| Origem e itens da ordem | RN09, RN10, RN13 | CU06, CU08, CU09 |
| Falta de insumos, compra e recebimento | RN04, RN05, RN06, RN14, RN15, RN16 | CU10, CU11, CU12, CU13 |
| Conclusão e movimentações de produção | RN07, RN08, RN17, RN18 | CU14 |
| Expedição vinculada e integral | RN11, RN18, RN19 | CU16 |
| Alteração e cancelamento | RN20, RN21 | CU07, CU15 |
| Custos, preços e financeiro | RN22, RN23, RN25 | CU17, CU18, CU19 |
| Responsabilidades e acesso acumulável | RN12, RN24 | CU01 a CU20, conforme PD06 |

Gestão de validade, etiquetas, FEFO, produção parcial, expedição parcial e financeiro completo não pertencem ao escopo inicial.

## 5. Revisão coletiva e Issue #2

A Issue #2 somente poderá ser considerada concluída após o grupo revisar atores, casos de uso, regras e pendências, atualizar os documentos e aprovar a contribuição correspondente. A existência deste documento não representa aprovação nem fechamento da issue.

A regra pedido versus estoque acabado foi confirmada nesta revisão: todo pedido deverá gerar uma ordem de produção. Classes e DER devem refletir essa obrigação, além da validação coletiva do fluxo. Permanecem abertas as regras de cancelamento, reserva/concorrência, estados completos, matriz de permissões, eventos financeiros e tratamento dos preços/unidades.
