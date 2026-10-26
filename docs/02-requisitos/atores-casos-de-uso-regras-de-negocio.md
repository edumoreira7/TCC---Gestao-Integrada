# Atores, Casos de Uso e Regras de Negócio

**Versão:** 0.3<br>
**Revisão:** 20/10/2026<br>
**Status:** Base consolidada; revisão do grupo confirmada pelo solicitante. Detalhamentos pendentes não são considerados aprovados.

Este documento detalha responsabilidades e casos de uso a partir do [escopo e requisitos](escopo-e-requisitos.md), das [decisões do projeto](../01-visao-geral/decisoes-do-projeto.md) e do [fluxo macro](../03-modelagem/fluxo-macro/README.md). Os identificadores RF, RN e PD referem-se ao documento de escopo.

## 1. Atores e acesso

Os atores representam papéis funcionais internos, não pessoas distintas. Um usuário pode acumular vários perfis ou conjuntos de permissões.

| Ator de referência | Responsabilidades |
|---|---|
| Comercial | Cadastrar e consultar clientes; registrar pedidos com vários produtos e quantidades; informar preços de venda e alterar pedidos antes do início da produção. |
| PCP (Planejamento e Controle da Produção) | Criar ordens manualmente e acompanhar as geradas automaticamente pelos pedidos; consultar receitas e necessidades de insumos; identificar faltas e acionar Compras; acompanhar ordens. |
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
| CU01 | Gerenciar insumos | A definir em PD06 | RF01 |
| CU02 | Gerenciar produtos e fichas técnicas/receitas | A definir em PD06 | RF02, RF03 |
| CU03 | Gerenciar fornecedores | Compras | RF04 |
| CU04 | Gerenciar clientes | Comercial | RF05 |
| CU05 | Consultar saldos e histórico de estoque | Estoque, PCP | RF06, RF07, RF08 |
| CU06 | Registrar pedido | Comercial | RF12, RF13, RF14, RF15, RF16 |
| CU07 | Alterar pedido antes da produção | Comercial | RF25 |
| CU09 | Criar ordem manual | PCP | RF11, RF14, RF15, RF16 |
| CU10 | Acompanhar ordem e necessidade de reposição | PCP | RF15, RF17, RF18, RF26 |
| CU11 | Registrar compra de insumos | Compras | RF09, RF24 |
| CU12 | Registrar recebimento de insumos | Estoque | RF10, RF27 |
| CU13 | Iniciar produção | Produção | RF17, RF18, RF27 |
| CU14 | Concluir produção integral | Produção | RF19, RF20, RF28 |
| CU15 | Registrar cancelamento durante a produção | Produção; autorização a definir | RF29; detalhamento em PD03 |
| CU16 | Registrar expedição integral do pedido | Expedição | RF21, RF22 |
| CU17 | Consultar custo do produto | Financeiro; demais acessos a definir | RF30 |
| CU18 | Gerenciar preço de venda | Comercial | RF31 |
| CU19 | Registrar/consultar valores básicos das operações | Financeiro | RF23, RF24, RF33; eventos em PD05 |
| CU20 | Gerenciar perfis e permissões acumuláveis | Ator administrador a definir em PD06 | RF32 |

O [diagrama de casos de uso](../03-modelagem/casos-de-uso/README.md) representa CU01 a CU20, exceto CU08, e suas associações aos papéis de referência. Não são utilizadas relações UML `include`/`extend`: os cálculos, verificações e movimentações automáticas permanecem como passos internos dos fluxos abaixo. CU08 foi incorporado ao fluxo de CU06: a geração da ordem é automática no registro do pedido (RF13/RN10). O identificador foi descontinuado e não será reutilizado; os demais IDs foram preservados.

Para CU01, CU02 e CU20, o diagrama usa a categoria genérica **Usuário interno autorizado**, sem criar um novo perfil nem atribuir permissões definitivas. A responsabilidade específica depende de PD06.

## 3. Fluxos principais

### CU06 e CU07: registrar e alterar pedido

1. Comercial associa um cliente cadastrado ao pedido.
2. Informa um ou mais produtos e suas quantidades.
3. O sistema registra o pedido e gera automaticamente uma única ordem com todos os seus produtos e quantidades, consultando receitas, somando necessidades e verificando a disponibilidade de insumos. Havendo faltas, a ordem aguarda reposição.
4. Antes do início da produção, Comercial pode alterar o pedido. Os itens e o cálculo de insumos devem refletir a alteração antes de iniciar.

**Limites:** alteração após o início da produção não é permitida. Dados obrigatórios restantes e estados do pedido dependem de PD02. Todo pedido deverá gerar uma ordem de produção, mesmo com estoque acabado suficiente; atendimento direto sem ordem não faz parte do fluxo.

### CU09: criar ordem de produção manual

1. PCP solicita uma ordem manual, sem pedido de origem.
2. A ordem recebe um ou mais produtos e suas quantidades.
3. O sistema consulta as fichas técnicas e dimensiona os insumos pelo rendimento de cada receita.
4. O sistema soma a necessidade de cada insumo, inclusive quando utilizado em vários produtos.
5. O sistema compara a necessidade total com a disponibilidade no estoque.
6. Com faltas, a ordem aguarda reposição; PCP identifica os itens e aciona Compras. Com todos os insumos disponíveis, a ordem pode seguir para início da produção.

**Resultado:** a ordem manual é independente de pedido. Em CU06, uma única ordem é gerada automaticamente para todo pedido, inclusive com estoque acabado suficiente. Criar a ordem não consome insumos. A reserva ocorre no início da produção; o mecanismo técnico de concorrência permanece em PD10. A composição usada fica preservada na OP.

### CU11 e CU12: comprar e receber insumos

1. Compras registra aquisição, fornecedor, insumos, quantidades e preços.
2. O registro da compra não altera o saldo do estoque.
3. No recebimento efetivo, Estoque registra os insumos recebidos e a entrada correspondente.
4. A disponibilidade para as ordens aguardando reposição é reavaliada.
5. Somente com todos os insumos necessários disponíveis a produção poderá iniciar.

**Limites:** sem criação/envio automático de pedidos de compra. Recebimentos parciais são permitidos: cada recebimento referencia os itens da compra, respeita o saldo pendente e movimenta somente o efetivamente recebido.

### CU13 e CU14: iniciar e concluir produção

1. Produção solicita o início da ordem.
2. O sistema verifica e reserva os insumos ao iniciar, considerando reservas ativas de outras ordens; bloqueia o início se houver faltas.
3. Produção executa a ordem.
4. Produção registra sua conclusão integral.
5. Na conclusão, o sistema registra a baixa dos insumos, encerra a reserva e dá entrada em todos os produtos acabados correspondentes.

**Limites:** sem conclusão parcial. A baixa normal ocorre somente na conclusão, nunca na criação ou no início. O mecanismo de integridade das movimentações será definido na arquitetura; as duas movimentações representam a mesma conclusão.

### CU15: cancelamento durante a produção

1. Produção informa o motivo e apura, por insumo, consumo e perdas em quantidades separadas, sem sobreposição.
2. Informa os produtos e quantidades aproveitáveis.
3. O sistema baixa uma única vez o consumo e as perdas, libera a reserva não utilizada e dá entrada nos produtos aproveitáveis.

Autorizações e tratamento de outras falhas seguem em PD03. O cancelamento é um encerramento excepcional; a conclusão normal continua integral. Ver RF29, RF34–RF36 e RN26–RN29.

### CU16: expedir pedido

**Pré-condição do caminho principal:** pedido vinculado à ordem de produção concluída e produtos acabados disponíveis para atendimento integral. O vínculo com a ordem, por si só, não substitui as etapas de produção e entrada no estoque representadas no macrofluxo.

1. Expedição seleciona o pedido e os produtos acabados correspondentes no estoque.
2. Registra destinatário, produtos, quantidades e data para atendimento integral.
3. O sistema registra a expedição vinculada ao pedido e a saída correspondente do estoque.

**Limites:** produtos passam pelo estoque antes de expedir. Não haverá expedição parcial nem atendimento direto sem ordem de produção. Transições e dados restantes dependem de PD04.

### CU17 a CU19: custos, preços e valores das operações

O custo de insumos de uma receita corresponde à soma das quantidades de cada componente multiplicadas pelo seu último preço de compra conhecido, em unidades compatíveis. O custo por unidade do produto considera o rendimento da receita. Critério temporal do preço, ausência de preço e conversões ainda dependem de PD11.

O preço de venda é cadastrado manualmente. O acompanhamento financeiro registra valores básicos das operações, sem confirmar pagamentos bancários e sem contas a pagar/receber ou contabilidade completa. Eventos, automatização e estornos dependem de PD05.

### Demais interações do catálogo

Gerenciar engloba cadastrar, consultar, editar e inativar quando aplicável, preservando o histórico e os vínculos. CU01 a CU04 gerenciam os respectivos cadastros; CU02 inclui composição e rendimento da receita. CU05 consulta saldos e histórico. CU10 apresenta o estado da ordem e as faltas calculadas, permitindo ao PCP acionar Compras sem emissão automática de pedidos a fornecedores.

Em CU17, o usuário seleciona um produto e o sistema consulta a receita e os últimos preços de compra conhecidos para apresentar o custo; entradas sem preço ou unidade compatível não devem produzir custo zero implícito. Em CU18, Comercial informa o preço de venda manualmente. CU19 registra/consulta valores básicos, com eventos e automatização ainda em PD05. CU20 representa a administração de acessos acumuláveis; seu fluxo de concessão e suas autorizações dependem de PD06.

Essas descrições completam a visão funcional sem presumir exclusão física de registros, regras de aprovação ou soluções técnicas não definidas.

## 4. Regras de negócio e rastreabilidade

O [catálogo RN01 a RN25](escopo-e-requisitos.md#7-regras-de-negócio-iniciais) é a referência das regras de negócio. Esta visão agrupa os vínculos para revisão:

| Tema | Regras | Casos de uso |
|---|---|---|
| Receitas, rendimento e necessidade total | RN01, RN02, RN03 | CU02, CU06, CU09, CU17 |
| Origem e itens da ordem | RN09, RN10, RN13 | CU06, CU09 |
| Falta de insumos, compra e recebimento | RN04, RN05, RN06, RN14, RN15, RN16 | CU10, CU11, CU12, CU13 |
| Conclusão e movimentações de produção | RN07, RN08, RN17, RN18 | CU14 |
| Expedição vinculada e integral | RN11, RN18, RN19 | CU16 |
| Alteração e cancelamento | RN20, RN21 | CU07, CU15 |
| Custos, preços e financeiro | RN22, RN23, RN25 | CU17, CU18, CU19 |
| Responsabilidades e acesso acumulável | RN12, RN24 | CU01 a CU20, conforme PD06 |

Gestão de validade, etiquetas, FEFO, produção parcial, expedição parcial e financeiro completo não pertencem ao escopo inicial.

## 5. Revisão coletiva e Issue #2

Em 17/10/2026, o solicitante confirmou que a revisão do grupo sobre a base consolidada no [PR #13](https://github.com/edumoreira7/TCC---Gestao-Integrada/pull/13) já ocorreu. A data da reunião e a lista de participantes não foram informadas; não são presumidas neste registro. O PR #13 foi integrado à `main` em 17/10/2026.

| Critério da Issue #2 | Evidência |
|---|---|
| Atores e responsabilidades | Seção 1. |
| Principais casos de uso | Catálogo CU01 a CU20 e fluxos da seção 3. |
| Regras de receitas, estoque, compras, produção e expedição | RN01 a RN25 e rastreabilidade da seção 4. |
| Revisão com o grupo | Confirmação explícita do solicitante em 17/10/2026 sobre a base do PR #13. |

O encerramento da Issue #2 registra a conclusão dessa modelagem funcional. Não representa implementação, encerramento da Issue #3 nem aprovação dos detalhamentos que continuam identificados por PD.

A regra pedido versus estoque acabado foi confirmada nesta revisão: todo pedido deverá gerar uma ordem de produção. Classes e DER devem refletir essa obrigação, além da validação coletiva do fluxo. Permanecem abertas as regras de cancelamento, reserva/concorrência, estados completos, matriz de permissões, eventos financeiros e tratamento dos preços/unidades.
