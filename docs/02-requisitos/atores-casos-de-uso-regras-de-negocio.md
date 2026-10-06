# Modelagem de atores, casos de uso e regras de negócio

## 1. Finalidade e delimitação

Este documento descreve a interação dos usuários com o sistema de Gestão Integrada de Estoque e Produção no Setor Alimentício, destinado a pequenas e médias empresas (PMEs). A modelagem relaciona receitas, necessidades de insumos, compras, produção, estoque e expedição.

**Referências:** [issue #2](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/2), [revisão do PR #11](https://github.com/edumoreira7/TCC---Gestao-Integrada/pull/11) e [escopo e requisitos da issue #1](https://github.com/edumoreira7/TCC---Gestao-Integrada/blob/main/docs/02-requisitos/escopo-e-requisitos.md).

**Situação:** modelagem revisada conforme as decisões de escopo documentadas na issue #1 e as solicitações do PR #11. A revisão coletiva do documento permanece pendente. Os fluxos centrais detalham o escopo existente; propostas adicionais estão exclusivamente na seção 7 e não constituem requisitos aprovados.

### 1.1. Fontes e interpretação

O documento de escopo e requisitos é a referência para as decisões atuais. O [README](../../README.md), o [diagrama de visão geral](../01-visao-geral/diagrama_visao_geral.pdf) e a [apresentação parcial](../07-apresentacoes/Apresentação%20Parcial%20-%20Gestão%20Integrada.pptx) oferecem contexto preliminar. Eventuais diferenças com esses materiais devem ser interpretadas conforme o escopo consolidado.

“Receita” significa ficha técnica que relaciona produto, insumos e quantidades. Não significa entrada financeira. Clientes e fornecedores são entidades cadastradas, sem acesso direto ao sistema nesta modelagem. O fornecedor participa do cadastro de compras e pode ser identificado como destinatário de uma expedição, conforme a revisão, sem exercer papel de usuário.

## 2. Atores e responsabilidades

| Código | Ator | Responsabilidades |
| --- | --- | --- |
| AT01 | Administrador | Representa a responsabilidade pela administração do sistema. As operações específicas de gestão de usuários e permissões dependem da definição dos perfis de acesso. |
| AT02 | Usuário responsável pela gestão operacional | Manter cadastros e receitas; consultar estoques; registrar compras e recebimentos, pedidos, ordens de produção, expedições e movimentações financeiras básicas. |

Os atores representam responsabilidades gerais de interação. Não estabelecem tipos definitivos de usuário nem uma matriz de permissões. Uma pessoa pode acumular funções, conforme a organização da PME.

| Papel funcional do usuário operacional | Responsabilidade no processo |
| --- | --- |
| Compras | Identificar necessidades e registrar compras de insumos. |
| Estoque | Registrar recebimentos e consultar saldos e histórico de movimentações. |
| Produção | Manter receitas, criar e acompanhar ordens e registrar sua conclusão. |
| Expedição | Registrar destinatário, produtos, quantidades e data da saída. |

Esses papéis descrevem atividades, sem estabelecer perfis de acesso separados. Clientes, fornecedores, módulos internos e banco de dados não são atores diretos dos casos de uso descritos a seguir.

## 3. Catálogo de casos de uso

| Código | Caso de uso | Ator | Referências do escopo |
| --- | --- | --- | --- |
| UC01 | Manter e consultar cadastros | AT02 | RF01–RF05 |
| UC02 | Manter receitas | AT02 | RF03; RN01 |
| UC03 | Consultar estoques e movimentações | AT02 | RF06–RF08 |
| UC04 | Registrar compra de insumos | AT02 | RF09 |
| UC05 | Registrar recebimento de compra | AT02 | RF10; RN06 |
| UC06 | Registrar pedido de cliente | AT02 | RF12 |
| UC07 | Criar ordem de produção e calcular necessidades | AT02 | RF11, RF13–RF17; RN02–RN05, RN09–RN10 |
| UC08 | Iniciar e acompanhar produção | AT02 | RF17–RF18; RN05 |
| UC09 | Concluir ordem de produção | AT02 | RF19–RF20; RN07–RN08 |
| UC10 | Registrar expedição | AT02 | RF21–RF22; RN11 |
| UC11 | Registrar movimentação financeira básica | AT02 | RF23–RF24 |

Os identificadores RN e RF remetem ao documento de escopo da issue #1. As regras RN01–RN11 são reproduzidas na seção 5 com o mesmo significado. A administração de acessos será detalhada após a definição dos perfis e permissões, conforme a seção 7.

## 4. Especificações dos casos de uso

### UC01 — Manter e consultar cadastros

- **Precondições:** informações do insumo, produto, fornecedor ou cliente disponíveis.
- **Fluxo principal:** o usuário informa os dados do cadastro; registra as informações; consulta os registros necessários à operação.
- **Pós-condições:** cadastro disponível para uso nos processos correspondentes.
- **Pontos pendentes:** campos obrigatórios, critérios de alteração, inativação e exclusão.
- **Referências:** RF01–RF05.

### UC02 — Manter receitas

- **Precondições:** produto e insumos cadastrados.
- **Fluxo principal:** o usuário seleciona o produto; informa os insumos e as quantidades necessárias para sua produção; registra a receita.
- **Pós-condições:** composição disponível para calcular necessidades de produção.
- **Pontos pendentes:** representação do rendimento, conversões de unidades, precisão dos cálculos e tratamento de alterações da receita.
- **Referências:** RF03; RN01.

### UC03 — Consultar estoques e movimentações

- **Precondições:** itens e registros de estoque disponíveis.
- **Fluxo principal:** o usuário seleciona insumos ou produtos acabados; consulta suas quantidades disponíveis e o histórico das movimentações decorrentes de compras, produção e expedição.
- **Pós-condições:** informações apresentadas sem movimentação de estoque.
- **Referências:** RF06–RF08.

### UC04 — Registrar compra de insumos

- **Precondições:** necessidade de compra identificada e insumos e fornecedor cadastrados.
- **Fluxo principal:** o usuário identifica a necessidade, com apoio das informações de estoque e insuficiências de produção; informa os dados da compra; registra os insumos adquiridos.
- **Pós-condições:** compra registrada para posterior recebimento. O registro da compra não representa entrada de insumos no estoque.
- **Limites:** não há criação ou envio automático de pedidos de compra. Aprovação obrigatória, reaprovação e participação direta do fornecedor não são etapas deste fluxo.
- **Referências:** RF09; decisão DC03 do documento de escopo.

### UC05 — Registrar recebimento de compra

- **Precondições:** compra registrada e insumos recebidos.
- **Fluxo principal:** o usuário localiza a compra; registra o recebimento dos insumos; o sistema registra a entrada correspondente no estoque.
- **Pós-condições:** recebimento registrado e saldo de insumos atualizado.
- **Pontos pendentes:** tratamento de divergências e recebimentos parciais. Essas situações não são consideradas funcionalidades definidas nesta etapa.
- **Referências:** RF10; RN06.

### UC06 — Registrar pedido de cliente

- **Precondições:** cliente e produtos cadastrados.
- **Fluxo principal:** o usuário operacional identifica o cliente; informa um ou mais produtos e suas quantidades; registra o pedido.
- **Pós-condições:** pedido disponível para criação de uma ordem de produção.
- **Pontos pendentes:** demais dados obrigatórios, estados, alterações, cancelamentos e vínculo com a expedição.
- **Referências:** RF12; RN10 para a criação da ordem a partir do pedido.

### UC07 — Criar ordem de produção e calcular necessidades

- **Precondições:** produtos e receitas cadastrados; pedido registrado quando essa for a origem.
- **Fluxo principal:** o usuário cria uma ordem manualmente, informando os produtos e quantidades, ou seleciona um pedido de cliente; o sistema reúne os produtos em uma única ordem e calcula as necessidades de insumos pelas receitas; compara as necessidades com o estoque; informa eventuais insuficiências; registra a ordem.
- **Alternativa:** a insuficiência não impede criar a ordem. A ordem permanece aguardando reposição e não pode iniciar até que todos os insumos necessários estejam disponíveis.
- **Pós-condições:** ordem criada, com origem e necessidades identificadas. Um pedido com vários produtos gera uma única ordem, sem desdobramento em uma ordem por produto.
- **Referências:** RF11, RF13–RF17; RN02–RN05, RN09–RN10.

### UC08 — Iniciar e acompanhar produção

- **Precondições:** ordem criada e disponibilidade suficiente de todos os insumos necessários para iniciar.
- **Fluxo principal:** o usuário consulta a ordem; verifica a disponibilidade; registra o início quando a condição estiver atendida; acompanha seu estado.
- **Alternativa:** se houver falta de insumos, a ordem permanece aguardando reposição.
- **Pós-condições:** produção iniciada e acompanhamento disponível. O início não registra baixa de insumos nem entrada de produtos acabados.
- **Pontos pendentes:** catálogo completo de estados e transições da ordem.
- **Referências:** RF17–RF18; RN05, RN07–RN08.

### UC09 — Concluir ordem de produção

- **Precondições:** ordem em produção e dados da produção disponíveis para conclusão.
- **Fluxo principal:** o usuário registra a conclusão; o sistema registra, nesse momento, o consumo dos insumos utilizados e a entrada dos produtos acabados correspondentes aos itens da ordem.
- **Pós-condições:** ordem concluída; estoque de insumos e de produtos acabados atualizado. Nenhum consumo da ordem é registrado antecipadamente durante seu início ou acompanhamento.
- **Pontos pendentes:** perdas, diferenças de rendimento, alterações de quantidade, cancelamentos e falhas durante a produção. A estratégia técnica para garantir consistência na conclusão também depende de detalhamento.
- **Referências:** RF19–RF20; RN07–RN08.

### UC10 — Registrar expedição

- **Precondições:** destinatário identificado e produtos acabados registrados no estoque.
- **Fluxo principal:** o usuário informa destinatário, produto, quantidade e data da saída; registra a expedição; o sistema registra a saída correspondente no estoque de produtos acabados.
- **Pós-condições:** expedição e movimentação de saída registradas.
- **Limites:** o destinatário não acessa o sistema. Não há acompanhamento de transporte ou confirmação de entrega neste caso de uso.
- **Pontos pendentes:** vínculo com pedidos, validações de quantidade, saídas parciais, devoluções e cancelamentos.
- **Referências:** RF21–RF22; RN11; decisão DC05 do documento de escopo.

### UC11 — Registrar movimentação financeira básica

- **Precondições:** informações da entrada ou saída financeira disponíveis.
- **Fluxo principal:** o usuário registra uma entrada ou saída financeira básica relacionada aos processos do sistema.
- **Pós-condições:** movimentação financeira registrada.
- **Pontos pendentes:** eventos que originam registros, campos obrigatórios, registros manuais ou automáticos e tratamento de correções.
- **Referências:** RF23–RF24; decisão DC04 e pendência PD05 do documento de escopo.

## 5. Regras de negócio alinhadas ao escopo

Os identificadores abaixo preservam a correspondência com as regras iniciais da issue #1. Novas regras somente devem integrar esta seção após definição pelo grupo.

| Código | Processo | Regra |
| --- | --- | --- |
| RN01 | Receitas | Uma receita relaciona um produto aos insumos e às quantidades necessárias para sua produção. |
| RN02 | Produção | A necessidade de cada insumo é calculada pelas receitas dos produtos incluídos na ordem e pelas quantidades solicitadas. |
| RN03 | Estoque | O sistema informa quando a quantidade disponível de um ou mais insumos é inferior à necessária para a ordem. |
| RN04 | Produção | A ordem pode ser criada mesmo quando houver insuficiência de insumos. |
| RN05 | Produção | A ordem com insuficiência permanece aguardando reposição e não pode iniciar enquanto os insumos necessários não estiverem disponíveis. |
| RN06 | Compras | O recebimento dos insumos adquiridos gera a entrada correspondente no estoque de insumos. |
| RN07 | Produção | O consumo dos insumos é registrado somente na conclusão da ordem de produção. |
| RN08 | Produção | A entrada dos produtos acabados no estoque é registrada na conclusão da ordem de produção. |
| RN09 | Produção | A ordem pode ter origem manual ou estar vinculada a um pedido de cliente. |
| RN10 | Pedidos | Um pedido de cliente gera uma única ordem de produção, mesmo quando contém vários produtos. |
| RN11 | Expedição | A expedição gera a saída da quantidade correspondente do estoque de produtos acabados. |

O fluxo de compras é delimitado por RF09, RF10 e DC03: o usuário identifica a necessidade, registra a compra e registra o recebimento; o recebimento gera entrada no estoque. Não se acrescentam condições de aprovação ou modalidades de recebimento ainda não definidas.

### 5.1. Exemplo de integração com vários produtos

Considere um pedido de 10 unidades do produto A e 5 unidades do produto B. Uma unidade de A exige 0,2 kg de farinha e uma unidade de B exige 0,1 kg. O pedido gera uma única ordem contendo ambos os produtos. A necessidade total de farinha é (10 × 0,2) + (5 × 0,1) = 2,5 kg.

Se houver 2 kg disponíveis, o sistema informa a insuficiência de 0,5 kg e mantém a ordem aguardando reposição. O usuário registra a compra e, após o recebimento, o estoque aumenta. Com os insumos necessários disponíveis, a produção pode iniciar, sem baixa nesse momento. Na conclusão da ordem, são registrados o consumo correspondente e a entrada dos produtos acabados.

O exemplo utiliza quantidades por unidade para ilustrar RN02. Não define uma política de rendimento, conversão, perdas ou reservas.

## 6. Rastreabilidade e cenários de validação

| Cenário | Resultado esperado | Referências |
| --- | --- | --- |
| Registrar compra sem recebimento | Compra registrada, sem entrada de insumos antes do recebimento. | UC04–UC05; RF09–RF10; RN06 |
| Registrar recebimento de compra | Entrada correspondente no estoque de insumos. | UC05; RN06 |
| Registrar pedido com dois produtos e gerar produção | Uma única ordem contém os produtos e suas quantidades. | UC06–UC07; RN09–RN10 |
| Criar ordem sem insumos suficientes | Ordem criada, insuficiência informada e início impedido até reposição. | UC07–UC08; RN03–RN05 |
| Calcular insumo compartilhado por vários produtos | Necessidade consolidada considera todos os produtos da ordem. | UC07; RN02 |
| Iniciar produção com insumos suficientes | Início registrado sem consumo ou entrada de produtos. | UC08; RN07–RN08 |
| Concluir produção | Consumo e entrada de produtos registrados na conclusão. | UC09; RN07–RN08 |
| Registrar expedição | Destinatário, produto, quantidade e data registrados; estoque de produtos reduzido pela saída. | UC10; RF21–RF22; RN11 |
| Registrar entrada ou saída financeira básica | Movimentação financeira registrada conforme o escopo básico. | UC11; RF23–RF24 |

Os cenários orientam a avaliação futura com dados sintéticos. Não representam testes já executados nem comprovam implementação. Estados completos de pedidos e ordens não são fixados aqui, pois permanecem pendentes no documento de escopo.

## 7. Propostas e pontos pendentes

Os itens abaixo não são regras homologadas, precondições obrigatórias dos fluxos centrais nem critérios de implementação já acordados. Sua inclusão depende de discussão com o grupo e o orientador.

| Tema | Questão a definir |
| --- | --- |
| Perfis e permissões | Definir perfis efetivos, operações do administrador e níveis de permissão. Os papéis funcionais da seção 2 não constituem uma matriz de acesso aprovada. |
| Acesso externo | Decidir se haverá futuramente acesso de clientes ou fornecedores. Os casos de uso atuais são executados por usuários internos. |
| Receitas | Avaliar versionamento e tratamento de alterações em receitas utilizadas por ordens; definir rendimento, unidades, conversões, precisão e custos. |
| Reservas | Avaliar necessidade de reservar insumos ou produtos e definir como isso afetaria a disponibilidade de estoque. |
| Compras | Avaliar aprovação, reaprovação, recebimentos parciais e tratamento de divergências, sem incorporá-los ao fluxo atual. |
| Lotes | Avaliar eventual identificação de lotes para rastreabilidade; não constitui controle já definido. |
| Ajustes e perdas | Definir necessidade e tratamento de ajustes de estoque, perdas, consumo diferente do previsto e diferenças de rendimento. |
| Cancelamentos e alterações | Definir regras de pedidos, compras e ordens, inclusive falhas durante a produção e correções após a conclusão. |
| Pedidos e expedição | Definir campos e estados dos pedidos, relação com a expedição, saídas parciais, devoluções e validações de saldo. |
| Financeiro | Definir quais eventos geram registros, quais lançamentos são manuais ou automáticos e como tratar correções. |
| Estados da produção | Definir todos os estados e transições, preservando a espera por reposição e os movimentos de estoque somente na conclusão. |
| Segurança | Especificar autenticação, autorização e critérios verificáveis após definir os perfis de usuário. |
| Integridade técnica | Detalhar consistência de operações, tratamento de falhas, prevenção de duplicidade e concorrência, sem pressupor uma solução técnica nesta etapa. |
| Auditoria | Avaliar registro detalhado de autoria e alterações. O histórico de movimentações de estoque já previsto em RF08 permanece no escopo. |
| Avaliação | Definir critérios mensuráveis para requisitos não funcionais e metodologia de validação com o orientador. |

A separação mantém as decisões dos processos nas RN e as propostas de segurança e integridade nesta seção, sem estabelecer requisitos RS ou RT como já aprovados.

## 8. Revisão com o grupo

A revisão coletiva é um critério da issue #2 e permanece pendente. As solicitações do PR #11 foram incorporadas, mas isso não substitui a aprovação coletiva desta versão.

| Registro | Situação |
| --- | --- |
| Data e participantes da revisão coletiva | Pendente |
| Aprovação dos atores e dos casos de uso | Pendente |
| Decisões sobre os temas da seção 7 | Pendente |
| Alterações acordadas e versão aprovada | Pendente |

### 8.1. Correspondência com os critérios da issue #2

- [x] Identificar os atores e suas responsabilidades: seção 2.
- [x] Listar os principais casos de uso: seções 3 e 4.
- [x] Definir regras para receitas, estoque, compras, produção e expedição: seção 5, com referência às regras e requisitos da issue #1.
- [ ] Revisar o conteúdo com o grupo: preencher o registro acima após a revisão real.
