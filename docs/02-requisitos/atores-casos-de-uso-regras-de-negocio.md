# Modelagem de atores, casos de uso e regras de negócio

## 1. Finalidade e delimitação

Este documento especifica a interação dos usuários com o sistema de Gestão Integrada de Estoque e Produção no Setor Alimentício, desenvolvido para pequenas empresas. A modelagem relaciona receitas, necessidades de insumos, compras, produção, estoque e expedição, conforme o objetivo do projeto.

**Referência de acompanhamento:** [issue #2](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/2). **Situação:** proposta para revisão pelo grupo. As decisões detalhadas neste documento são propostas de modelagem, e não requisitos já homologados.

### 1.1. Fontes e premissas

Foram considerados o [README](../../README.md), o [diagrama de visão geral](../01-visao-geral/diagrama_visao_geral.pdf) e a [apresentação parcial](../07-apresentacoes/Apresentação%20Parcial%20-%20Gestão%20Integrada.pptx). Esses materiais estabelecem a integração dos processos e o registro financeiro simplificado. O diagrama prevê acesso de clientes e fornecedores; os limites desse acesso são propostos a seguir e precisam de validação.

Para esta modelagem, “receita” significa ficha técnica de produção, e não entrada financeira. Um ator representa um papel: uma pessoa pode exercer vários papéis, conforme as permissões atribuídas. Banco de dados e módulos internos não são atores. Contabilidade fiscal, emissão de notas fiscais, integração bancária e otimização automática da produção não integram esta proposta.

## 2. Atores e responsabilidades

| Código | Ator | Responsabilidades e limites de acesso |
| --- | --- | --- |
| AT01 | Administrador | Manter usuários e permissões; habilitar e desabilitar acessos. Não recebe automaticamente permissão para executar operações de negócio. |
| AT02 | Gestor | Acompanhar necessidades de compra e produção; manter cadastros comerciais; aprovar compras e ajustes de estoque; consultar indicadores e registrar movimentos financeiros simplificados. |
| AT03 | Responsável pelas receitas | Manter produtos e fichas técnicas, quantidades, unidades e rendimento; disponibilizar versões válidas para produção. |
| AT04 | Responsável por compras | Manter fornecedores; analisar necessidades; preparar e acompanhar pedidos de compra; registrar condições e confirmações do fornecedor. |
| AT05 | Responsável pelo estoque | Cadastrar insumos; receber compras; controlar lotes, validade, saldos e reservas; solicitar ajustes e registrar perdas justificadas. |
| AT06 | Responsável pela produção | Planejar, iniciar e concluir ordens; registrar consumo efetivo, rendimento e perdas; consultar receitas e disponibilidade de insumos. |
| AT07 | Responsável pela expedição | Registrar demandas de clientes; separar produtos; registrar saída e entrega, consultando disponibilidade e validade. |
| AT08 | Fornecedor | Consultar somente pedidos destinados à sua empresa e informar disponibilidade e previsão de entrega; não alterar aprovação, recebimentos ou estoques. |
| AT09 | Cliente | Registrar solicitações e consultar somente suas demandas e entregas; não alterar estoque ou ordens de produção. |

A autenticação é uma precondição dos casos de uso protegidos. O controle de acesso segue RS01, apresentado na seção 6.

## 3. Catálogo de casos de uso

| Código | Caso de uso | Atores envolvidos | Resultado esperado |
| --- | --- | --- | --- |
| UC01 | Gerenciar acessos | AT01 | Usuários e permissões definidos e auditáveis. |
| UC02 | Manter cadastros | AT02, AT03, AT04, AT05, AT07 | Insumos, produtos, fornecedores e clientes válidos. |
| UC03 | Manter receitas e fichas técnicas | AT03 | Receita versionada com composição e rendimento. |
| UC04 | Consultar estoque e necessidades | AT02, AT04, AT05, AT06, AT07 | Saldos físicos, reservas, disponibilidade e faltas identificados. |
| UC05 | Gerenciar pedidos de compra | AT04, AT02, AT08 | Pedido aprovado e acompanhamento do fornecimento. |
| UC06 | Receber insumos | AT05 | Recebimento vinculado à compra e entrada dos lotes aceitos. |
| UC07 | Planejar ordem de produção | AT06 | Ordem com versão de receita, necessidades e reservas. |
| UC08 | Executar e concluir produção | AT06 | Consumo registrado e produtos acabados incorporados ao estoque. |
| UC09 | Registrar perdas e ajustes | AT05, AT02 | Correção autorizada, justificada e rastreável. |
| UC10 | Registrar demanda do cliente | AT09, AT07 | Demanda registrada para atendimento. |
| UC11 | Expedir produtos e registrar entrega | AT07, AT09 | Saída física vinculada à demanda e entrega acompanhada. |
| UC12 | Registrar e consultar fluxo de caixa | AT02 | Entradas e saídas efetivas registradas com origem identificável. |

## 4. Especificações dos casos de uso

Os fluxos abaixo pressupõem usuário autenticado e autorizado, conforme RS01. Dados inválidos devem ser rejeitados sem modificar saldos ou estados. O registro das alterações segue RT03; a consistência das confirmações e das operações simultâneas segue RT01 e RT02, quando aplicáveis.

### UC01 — Gerenciar acessos

- **Ator principal:** Administrador.
- **Precondições:** Usuário identificado; papéis cadastrados.
- **Fluxo principal:** Selecionar ou cadastrar usuário; atribuir papéis; confirmar a alteração.
- **Pós-condições:** Permissões atualizadas e alteração registrada.
- **Alternativas e exceções:** Impedir que a desativação do último administrador elimine a administração do sistema; negar operações sem permissão.
- **Requisitos relacionados:** RS01, RS02, RT03.

### UC02 — Manter cadastros

- **Ator principal:** Gestor e responsáveis autorizados por cada cadastro.
- **Precondições:** Dados mínimos do item ou parceiro disponíveis.
- **Fluxo principal:** Informar identificação e dados operacionais; validar unidade e duplicidade; salvar ou inativar cadastro.
- **Pós-condições:** Cadastro disponível aos processos correspondentes.
- **Alternativas e exceções:** Cadastro já utilizado deve ser inativado, preservando o histórico; unidade incompatível deve ser corrigida antes de salvar.
- **Regras de negócio relacionadas:** RN01, RN02.
- **Requisitos relacionados:** RS01, RT03.

### UC03 — Manter receitas e fichas técnicas

- **Ator principal:** Responsável pelas receitas.
- **Precondições:** Produto e insumos ativos cadastrados.
- **Fluxo principal:** Informar rendimento e unidade do produto; adicionar insumos e quantidades; validar composição; disponibilizar nova versão.
- **Pós-condições:** Versão identificada e utilizável em novas ordens.
- **Alternativas e exceções:** Composição vazia, quantidade não positiva ou conversão ausente impede disponibilização; edição de versão utilizada gera outra versão.
- **Regras de negócio relacionadas:** RN03, RN04, RN05, RN06.
- **Requisitos relacionados:** RS01, RT03.

### UC04 — Consultar estoque e necessidades

- **Ator principal:** Gestor, compras, estoque, produção e expedição.
- **Precondições:** Cadastros e movimentações disponíveis.
- **Fluxo principal:** Consultar saldos por item e lote; descontar reservas e bloqueios; calcular necessidades de uma quantidade de produção; apresentar falta de insumos.
- **Pós-condições:** Disponibilidade e sugestão de compra apresentadas sem movimentação física.
- **Alternativas e exceções:** Insumos vencidos ou bloqueados não compõem disponibilidade; entradas previstas devem aparecer separadas do saldo atual.
- **Regras de negócio relacionadas:** RN07, RN08, RN09, RN10, RN12.
- **Requisitos relacionados:** RS01.

### UC05 — Gerenciar pedidos de compra

- **Ator principal:** Compras, gestor e fornecedor.
- **Precondições:** Fornecedor ativo e necessidade identificada.
- **Fluxo principal:** Compras informa itens, quantidades, preços e previsão; gestor aprova; fornecedor consulta seu pedido e informa disponibilidade; compras acompanha atendimento.
- **Pós-condições:** Pedido aprovado aguardando recebimento ou acompanhado até encerramento.
- **Alternativas e exceções:** Gestor pode rejeitar com justificativa; alterações de itens, quantidades ou valores após aprovação exigem nova aprovação; cancelamento preserva recebimentos já realizados.
- **Regras de negócio relacionadas:** RN11, RN12, RN13, RN14.
- **Requisitos relacionados:** RS01, RT03.

### UC06 — Receber insumos

- **Ator principal:** Responsável pelo estoque.
- **Precondições:** Pedido aprovado com quantidade pendente.
- **Fluxo principal:** Conferir entrega; registrar quantidades aceitas e rejeitadas, lote, validade e custo; confirmar recebimento; atualizar estoque e pendência do pedido.
- **Pós-condições:** Somente quantidades aceitas entram no estoque; pedido fica parcial ou recebido.
- **Alternativas e exceções:** Entrega parcial mantém saldo pendente; excesso sobre quantidade aprovada é bloqueado; item recusado não gera saldo; repetição da confirmação não duplica entrada.
- **Regras de negócio relacionadas:** RN09, RN13, RN14.
- **Requisitos relacionados:** RS01, RT01, RT02, RT03.

### UC07 — Planejar ordem de produção

- **Ator principal:** Responsável pela produção.
- **Precondições:** Produto com receita válida e quantidade planejada positiva.
- **Fluxo principal:** Selecionar produto, versão e quantidade; calcular insumos; consultar disponibilidade; reservar lotes aptos; liberar ordem quando houver cobertura.
- **Pós-condições:** Ordem planejada ou liberada com reservas vinculadas.
- **Alternativas e exceções:** Falta de insumos mantém ordem planejada e gera sugestão de compra; cancelamento antes do início libera reservas.
- **Regras de negócio relacionadas:** RN04, RN07, RN15, RN16, RN17.
- **Requisitos relacionados:** RS01, RT02, RT03.

### UC08 — Executar e concluir produção

- **Ator principal:** Responsável pela produção.
- **Precondições:** Ordem liberada com insumos aptos; para concluir, ordem em produção.
- **Fluxo principal:** Revalidar reservas e iniciar; registrar consumo efetivo; registrar quantidade produzida, perdas, lote e validade; confirmar conclusão de forma integrada.
- **Pós-condições:** Consumo baixado, reservas liberadas e lote produzido disponível, com rastreabilidade.
- **Alternativas e exceções:** Consumo extra exige disponibilidade; perda ou diferença de rendimento exige justificativa; cancelamento após início preserva consumo e perdas, liberando apenas reservas não consumidas; conclusão repetida não duplica movimentos.
- **Regras de negócio relacionadas:** RN09, RN16, RN17, RN18, RN19, RN20.
- **Requisitos relacionados:** RS01, RT01, RT02, RT03.

### UC09 — Registrar perdas e ajustes

- **Ator principal:** Estoque e gestor.
- **Precondições:** Item e lote identificados; divergência ou perda documentada.
- **Fluxo principal:** Estoque informa quantidade e motivo; gestor aprova ajuste; sistema registra movimento e referência, preservando saldo anterior no histórico.
- **Pós-condições:** Saldo corrigido por movimento rastreável.
- **Alternativas e exceções:** Rejeição mantém saldo; ajuste que tornaria saldo negativo ou invalidaria reserva ativa é bloqueado até resolução da reserva.
- **Regras de negócio relacionadas:** RN08, RN10, RN21.
- **Requisitos relacionados:** RS01, RT02, RT03.

### UC10 — Registrar demanda do cliente

- **Ator principal:** Cliente ou responsável pela expedição.
- **Precondições:** Cliente e produtos ativos.
- **Fluxo principal:** Informar produtos, quantidades e previsão desejada; registrar solicitação; expedição confirma condições de atendimento.
- **Pós-condições:** Demanda registrada ou confirmada para separação.
- **Alternativas e exceções:** Falta de produto permite planejar produção; solicitação não representa expedição nem entrada de caixa; cliente consulta somente seus registros.
- **Regras de negócio relacionadas:** RN22, RN26.
- **Requisitos relacionados:** RS01, RT03.

### UC11 — Expedir produtos e registrar entrega

- **Ator principal:** Expedição; cliente na consulta de acompanhamento.
- **Precondições:** Demanda confirmada; lotes aptos com saldo disponível.
- **Fluxo principal:** Selecionar lotes e reservar para separação; conferir quantidades; confirmar saída e emitir registro de entrega; atualizar acompanhamento da entrega.
- **Pós-condições:** Estoque baixado na saída física; demanda parcial ou totalmente expedida, com entrega registrada posteriormente.
- **Alternativas e exceções:** Falta de saldo impede saída; expedição parcial mantém pendência; cancelamento antes da saída libera reserva; após saída, correção exige movimento compensatório vinculado.
- **Regras de negócio relacionadas:** RN08, RN09, RN10, RN22, RN23, RN24, RN25.
- **Requisitos relacionados:** RS01, RT01, RT02, RT03.

### UC12 — Registrar e consultar fluxo de caixa

- **Ator principal:** Gestor.
- **Precondições:** Valor, data e natureza da entrada ou saída identificados.
- **Fluxo principal:** Informar pagamento ou recebimento efetivo; vincular compra ou expedição quando aplicável; salvar; consultar fluxo por período.
- **Pós-condições:** Movimento financeiro independente do saldo físico, com origem identificada.
- **Alternativas e exceções:** Compra, produção e entrega não geram automaticamente pagamento ou recebimento; correção usa estorno vinculado; impedir duplicidade da mesma confirmação.
- **Regras de negócio relacionadas:** RN26, RN27.
- **Requisitos relacionados:** RS01, RT01, RT03.

## 5. Regras de negócio

As regras de negócio expressam condições e decisões dos processos da empresa, como disponibilidade de estoque, aprovação de compras e consumo de insumos. Requisitos de segurança (RS) e requisitos técnicos (RT) são apresentados separadamente na seção 6, pois tratam do controle de acesso e das garantias de funcionamento do sistema.

| Código | Processo | Regra proposta |
| --- | --- | --- |
| RN01 | Cadastros | Registros referenciados por operações não podem ser excluídos fisicamente; a inativação impede novos usos e preserva o histórico. |
| RN02 | Unidades | Cada item possui unidade base. Conversões de compra, receita e produção devem ser explícitas e compatíveis; não se presume equivalência entre massa, volume e unidade. |
| RN03 | Receitas | Receita válida exige produto, pelo menos um insumo e quantidades e rendimento maiores que zero. |
| RN04 | Receitas | Necessidade do insumo = quantidade na receita × quantidade planejada do produto ÷ rendimento da receita, após conversão de unidades. |
| RN05 | Receitas | A ordem conserva a versão da receita selecionada; alterações posteriores não modificam ordens existentes. |
| RN06 | Receitas | Custo estimado da receita é a soma das quantidades de insumos multiplicadas por seus custos unitários de referência. É estimativa de materiais; não inclui automaticamente mão de obra, tributos ou margem comercial. |
| RN07 | Estoque | Saldo disponível = saldo físico apto − reservas ativas. Lotes vencidos ou bloqueados não integram o saldo apto. |
| RN08 | Estoque | Movimentos e reservas não podem causar saldo físico ou disponível negativo. |
| RN09 | Estoque | Entradas e saídas identificam item, quantidade, unidade, lote, validade quando aplicável e processo de origem. Lotes vencidos ou bloqueados não podem ser consumidos na produção nem expedidos. |
| RN10 | Estoque | A seleção prioriza lotes aptos com vencimento mais próximo (FEFO); empates usam a entrada mais antiga. Desvio dessa ordem exige justificativa. |
| RN11 | Compras | Pedido exige fornecedor ativo, pelo menos um item, quantidade positiva e preço não negativo; emissão ao fornecedor depende de aprovação do gestor. |
| RN12 | Compras | Sugestão de compra considera necessidade não coberta pelo estoque disponível e pelas entradas aprovadas previstas até a data necessária. Entradas futuras nunca aumentam o saldo físico atual. |
| RN13 | Compras | Recebimento pode ser parcial. Soma das quantidades aceitas não deve ultrapassar quantidade aprovada; excesso exige revisão e aprovação prévia do pedido. |
| RN14 | Compras | Pedido cancelado não aceita novos recebimentos; cancelamento do saldo pendente não desfaz entradas já confirmadas. |
| RN15 | Produção | Quantidade planejada é positiva e a ordem referencia produto e versão válida da receita. |
| RN16 | Produção | Liberação exige reserva suficiente de insumos aptos. Início revalida lotes e reservas; falta ou vencimento impede início até recomposição. |
| RN17 | Produção | Cancelamento antes do início libera reservas. Após início, consumo e perdas já realizados são preservados; somente reservas restantes são liberadas. |
| RN18 | Produção | Conclusão registra consumo efetivo, quantidade produzida e perdas. Divergência do planejado exige justificativa; consumo adicional depende de disponibilidade. |
| RN19 | Produção | Quantidade produzida positiva gera entrada de produto acabado com lote e validade definidos; produção sem aproveitamento registra perda e não gera saldo vendável. |
| RN20 | Produção | O lote produzido deve permitir identificar ordem, versão da receita e lotes de insumos consumidos. |
| RN21 | Estoque | Ajuste exige motivo e aprovação do gestor; perdas e estornos conservam referência ao lote e à operação original. Movimentações confirmadas não são apagadas. |
| RN22 | Expedição | Demanda exige cliente ativo, produtos e quantidades positivas. Confirmação da demanda não baixa estoque; separação reserva produtos e saída física gera baixa. |
| RN23 | Expedição | Saída exige produtos aptos e quantidade não superior à pendência da demanda ou à reserva correspondente. Atendimento parcial mantém quantidade pendente. |
| RN24 | Expedição | Registro de saída identifica cliente, demanda, produtos, lotes, quantidades, responsável e data; confirmação de entrega não baixa estoque novamente. |
| RN25 | Expedição | Cancelamento anterior à saída libera reservas; após saída, eventual retorno só aumenta estoque mediante recebimento e avaliação do lote, por movimento compensatório rastreável. |
| RN26 | Financeiro | Caixa registra pagamentos e recebimentos efetivos, com valor positivo, natureza, data e origem. Pedido ou entrega não equivale automaticamente a movimentação financeira. |
| RN27 | Financeiro | Movimento confirmado é corrigido por estorno vinculado, preservando histórico; pagamentos e recebimentos parcelados podem ser registrados separadamente. |

### 5.1. Exemplo de cálculo integrado

Uma receita rende 10 unidades de produto e utiliza 2 kg de farinha. Para produzir 30 unidades, a necessidade é 2 × 30 ÷ 10 = 6 kg. Se o estoque apto contém 5 kg e 1 kg está reservado para outra ordem, há 4 kg disponíveis e faltam 2 kg. Uma compra aprovada de 2 kg, prevista antes da produção, pode cobrir a sugestão de compra, mas a ordem somente será liberada após o recebimento e a reserva desses insumos.

Esse exemplo verifica a distinção entre previsão de abastecimento, saldo físico e reserva. Perdas são registradas pelo consumo efetivo; não se aplica percentual presumido sem validação do grupo.

## 6. Requisitos de segurança e requisitos técnicos

### 6.1. Requisitos de segurança

| Código | Requisito proposto | Casos de uso relacionados |
| --- | --- | --- |
| RS01 | O sistema deve exigir autenticação e verificar as permissões em cada operação protegida. Clientes e fornecedores devem acessar somente registros vinculados a eles, inclusive nas consultas por identificador. | UC01–UC12 |
| RS02 | O sistema deve impedir a desativação ou remoção de permissões do último administrador ativo, preservando a possibilidade de administrar os acessos. | UC01 |

### 6.2. Requisitos técnicos de integridade e auditoria

| Código | Requisito proposto | Casos de uso relacionados |
| --- | --- | --- |
| RT01 | A confirmação de recebimento, produção ou expedição deve atualizar o documento de origem, o estoque e as reservas aplicáveis em uma única operação: uma falha deve impedir alterações parciais. Repetir uma confirmação de recebimento, produção, expedição ou caixa não deve duplicar seus registros ou efeitos. | UC06, UC08, UC11, UC12 |
| RT02 | Operações simultâneas de movimentação ou reserva devem verificar e atualizar a disponibilidade de forma consistente, impedindo que dois usuários utilizem o mesmo saldo e violem RN08. | UC06, UC07, UC08, UC09, UC11 |
| RT03 | Alterações de acesso e operações que modificam cadastros, receitas, pedidos, ordens, estoque, demandas ou caixa devem manter registro de autor, data, operação e referência à origem, permitindo a consulta do histórico. | UC01, UC02, UC03, UC05–UC12 |

A separação distingue a política operacional da garantia técnica: RN08 proíbe saldo negativo; RT02 estabelece que essa condição também deve ser preservada quando há operações simultâneas. A identificação dos lotes e dos processos de origem continua sendo uma necessidade de negócio; o registro de autoria e data das alterações é tratado em RT03.

## 7. Estados e integração entre processos

| Entidade | Transições previstas |
| --- | --- |
| Pedido de compra | Rascunho → aguardando aprovação → aprovado → parcialmente recebido → recebido. Rejeição retorna ao rascunho; alterações materiais exigem reaprovação; cancelamento encerra somente a parte ainda não recebida. |
| Ordem de produção | Planejada → liberada → em produção → concluída. Falta de cobertura mantém planejada; cancelamento registra o motivo e segue RN17. |
| Demanda | Registrada → confirmada → parcialmente expedida → expedida → entregue. Cada remessa possui sua própria confirmação de entrega; cancelamento encerra apenas a parte não expedida. |
| Reserva | Ativa → consumida ou liberada. Consumo parcial reduz a reserva; encerramento libera a parte não utilizada. |

O fluxo operacional é: demanda ou planejamento de produção → cálculo pela receita → verificação de disponibilidade → compra e recebimento quando necessários → reserva e produção → estoque de produto acabado → separação e expedição. O financeiro registra os eventos de caixa associados quando efetivamente ocorrerem.

## 8. Rastreabilidade e verificação

As referências de regras e requisitos em cada especificação de caso de uso, complementadas pelas tabelas da seção 6, constituem a matriz de rastreabilidade desta proposta. Os cenários seguintes orientam a validação futura, sem afirmar que o sistema já os implementa.

| Cenário | Resultado esperado | Referências |
| --- | --- | --- |
| Alterar receita depois de liberar uma ordem | Ordem mantém versão e quantidades originais. | UC03, UC07; RN05 |
| Dois usuários reservam simultaneamente o mesmo saldo | Apenas reservas compatíveis com disponibilidade são confirmadas. | UC07, UC11; RN08, RT02 |
| Receber parte de uma compra e repetir a confirmação | Entrada ocorre uma vez e pedido mantém pendência correta. | UC06; RN13, RT01 |
| Lote reservado vence antes do início da produção | Início bloqueado até substituição dos insumos. | UC08; RN09, RN16 |
| Produzir menos que o planejado | Consumo real e perdas são registrados; entra somente quantidade aproveitada. | UC08; RN18, RN19 |
| Cancelar produção já iniciada | Consumo não retorna ficticiamente ao estoque; reservas restantes são liberadas. | UC08; RN17 |
| Expedir parte de uma demanda e confirmar entrega | Baixa ocorre na saída, uma única vez; quantidade restante permanece pendente. | UC11; RN23, RN24 |
| Cliente ou fornecedor tenta consultar registro de outro parceiro | Acesso negado independentemente do identificador informado. | UC05, UC10, UC11; RS01 |
| Registrar compra sem pagamento | Estoque pode aumentar no recebimento; caixa não muda até pagamento efetivo. | UC06, UC12; RN26 |

## 9. Revisão com o grupo

A revisão coletiva é um critério do issue e permanece pendente. O documento não substitui esse encontro e não comprova concordância dos integrantes.

Pontos que exigem decisão do grupo:

1. Confirmar os papéis e a possibilidade de acumulação de responsabilidades em pequenas empresas.
2. Confirmar o acesso direto de clientes e fornecedores, previsto no esboço, e o escopo dos respectivos portais.
3. Validar aprovação de compras e ajustes, controle por lote e validade e prioridade FEFO.
4. Definir precisão e arredondamento por unidade, tratamento de perdas e origem do custo de referência.
5. Confirmar demandas de clientes, entregas parciais, devoluções e registro financeiro simplificado.
6. Validar todos os fluxos e regras, registrando alterações e eventuais exclusões de escopo.

| Registro da revisão | Preenchimento |
| --- | --- |
| Data e participantes | Pendente |
| Decisões e alterações aprovadas | Pendente |
| Divergências e responsáveis por resolução | Pendente |
| Versão aprovada pelo grupo | Pendente |

### 9.1. Correspondência com os critérios do issue

- [x] Identificar atores e suas responsabilidades: seção 2.
- [x] Listar os principais casos de uso: seções 3 e 4.
- [x] Definir regras para receitas, estoque, compras, produção e expedição: seção 5.
- [ ] Revisar o conteúdo com o grupo: preencher a seção 9 após a revisão real.
