# Escopo e Requisitos do Sistema

**Projeto:** Gestão Integrada de Estoque e Produção no Setor Alimentício: uma abordagem baseada em receitas e necessidades de insumo<br>
**Versão:** 0.5<br>
**Etapa:** TCC1 — Levantamento de requisitos e análise<br>
**Status:** Base consolidada; revisão coletiva informada pelo solicitante em 17/10/2026; detalhamentos pendentes identificados abaixo<br>
**Revisão:** 20/10/2026

---

## 1. Contextualização

Pequenas e médias empresas (PMEs) do setor alimentício precisam coordenar processos relacionados à aquisição de insumos, definição de receitas, produção de alimentos, controle de estoque e expedição de produtos acabados.

O projeto propõe o desenvolvimento de um sistema que integre esses processos, permitindo relacionar os insumos necessários para a produção aos registros de compras, às ordens de produção e às movimentações dos estoques de insumos e produtos acabados.

A proposta possui escopo delimitado e não pretende desenvolver um ERP de abrangência geral ou reproduzir todas as funcionalidades de sistemas comerciais consolidados.

---

## 2. Objetivo geral

Desenvolver um sistema integrado de apoio à gestão de estoque e produção para pequenas e médias empresas do setor alimentício, relacionando receitas, necessidades de insumos, compras, ordens de produção, estoque de produtos acabados e expedição.

---

## 3. Público-alvo

O sistema é destinado a pequenas e médias empresas do setor alimentício que realizam processos de produção a partir de receitas e necessitam controlar os insumos utilizados e os produtos acabados.

### Decisão confirmada

O público-alvo inclui pequenas e médias empresas do setor alimentício, sem restringir a proposta exclusivamente a restaurantes.

### Ponto pendente

Ainda deverá ser definido se um perfil específico de estabelecimento, como padaria, confeitaria ou pequena indústria alimentícia, será utilizado como referência nos cenários de uso e validação.

---

## 4. Escopo funcional

### 4.1. Cadastros

O sistema deverá permitir o cadastro e a consulta das principais informações necessárias aos processos de estoque e produção, incluindo:

- Insumos;
- Produtos acabados;
- Receitas;
- Fornecedores;
- Clientes.

Cada produto deverá possuir uma ficha técnica/receita. A receita relaciona um ou mais insumos, suas quantidades e unidades de medida, além da quantidade de produto resultante (rendimento), para dimensionar produção e custo.

Clientes e fornecedores são entidades cadastradas e não acessam o sistema.

---

### 4.2. Estoque

O sistema deverá controlar os estoques de insumos e produtos acabados.

Deverá ser possível consultar as quantidades disponíveis e acompanhar movimentações decorrentes de recebimento de compras, conclusão de produção e expedição. Registrar uma compra não gera entrada no estoque.

O histórico dessas movimentações deverá permanecer disponível para consulta.

---

### 4.3. Compras

O sistema deverá permitir o registro de compras de insumos e o recebimento dos itens adquiridos.

Ao criar uma ordem de produção, o sistema deverá calcular a quantidade de insumos necessária com base nas receitas dos produtos e nas quantidades solicitadas.

Caso algum insumo esteja disponível em quantidade inferior à necessária, o sistema deverá informar a insuficiência ao usuário.

O sistema calcula e informa as faltas. O PCP identifica a necessidade de reposição e aciona Compras, que registra a aquisição, quantidades e preços dos insumos.

A entrada no estoque ocorre somente no recebimento efetivo pelo Estoque. Depois da entrada, a disponibilidade dos insumos necessários à ordem deverá ser reavaliada.

Não está prevista a criação ou o envio automático de pedidos de compra aos fornecedores.

---

### 4.4. Produção

O sistema deverá permitir a criação e o acompanhamento de ordens de produção.

Uma ordem poderá ser criada de duas formas:

1. Manualmente por um usuário;
2. A partir de um pedido de cliente.

Quando a ordem for criada manualmente, o usuário deverá informar os produtos e as respectivas quantidades que serão produzidas.

Uma ordem contém um ou mais produtos. Quando tiver origem em um pedido, estará vinculada somente a esse pedido. Cada pedido poderá estar associado a no máximo uma ordem de produção, mesmo quando possuir mais de um produto.

Todo pedido deverá gerar uma ordem de produção, inclusive quando houver produtos acabados suficientes em estoque. Não haverá atendimento direto sem ordem. A ordem é gerada automaticamente no registro do pedido.

A ordem de produção poderá ser criada mesmo quando não houver quantidade suficiente de todos os insumos necessários.

Nessa situação, a ordem deverá permanecer aguardando reposição e não poderá iniciar enquanto os insumos necessários não estiverem disponíveis.

O consumo dos insumos será registrado somente na conclusão da ordem de produção.

No mesmo momento, deverá ser registrada a entrada dos produtos acabados correspondentes no estoque.

A conclusão será integral, sem produção parcial na primeira versão. Produtos acabados passam sempre pelo estoque antes da expedição.

No cancelamento durante a produção, será obrigatório registrar o motivo e a situação dos produtos e insumos. Consumo e perdas serão baixados sem duplicidade; o saldo reservado não utilizado será liberado e os produtos aproveitáveis terão entrada no estoque. Autorizações e falhas permanecem em PD03.

---

### 4.5. Pedidos de clientes

O Comercial deverá registrar pedidos vinculados a clientes cadastrados, contendo um ou mais produtos e suas quantidades. O cliente não possui acesso ao sistema.

Todo pedido deverá gerar uma única ordem de produção antes de seu atendimento, mesmo com estoque acabado suficiente.

### Decisão confirmada

Todo pedido deverá gerar uma única ordem para seus produtos, mesmo quando houver produtos acabados suficientes em estoque. O pedido poderá ser alterado até antes do início da produção. Alterações deverão refletir na ordem vinculada e no recálculo dos insumos antes de iniciar.

### Pontos pendentes

Ainda deverão ser definidos:

- Dados obrigatórios de um pedido;
- Estados possíveis de um pedido;
- Tratamento detalhado de cancelamentos;

---

### 4.6. Expedição

O sistema deverá permitir registrar a expedição vinculada a um pedido e a saída dos produtos acabados correspondentes. Não haverá expedição parcial inicialmente.

O registro deverá conter, no mínimo:

- Destinatário;
- Produto;
- Quantidade;
- Data da saída.

A expedição deverá gerar a movimentação correspondente de saída no estoque de produtos acabados.

Não estão previstos, na primeira versão:

- Roteirização;
- Rastreamento de entregas;
- Controle de frota;
- Integração com transportadoras;
- Expedição parcial.

---

### 4.7. Controle financeiro básico

O sistema deverá permitir registrar e consultar os valores básicos das operações de compra e venda/expedição, sem tratar o registro como confirmação de pagamento ou recebimento bancário.

As compras registram os preços dos insumos. O custo do produto será calculado pela receita e pelo último preço de compra conhecido de cada insumo, considerando quantidades, unidades compatíveis e rendimento. O preço de venda será cadastrado manualmente.

Contas a pagar, contas a receber, contabilidade completa e sugestão automática de preço ficam fora da primeira versão.

### Ponto pendente

Ainda deverá ser definido quais eventos gerarão registros financeiros e quais registros serão manuais ou automáticos.

Também serão definidos o critério temporal do último preço de compra, o tratamento de insumos sem preço e as conversões de unidades. A ausência de preço não deve ser tratada implicitamente como custo zero.

### 4.8. Perfis e responsabilidades

Os perfis funcionais de referência são Comercial, PCP, Compras, Estoque, Produção, Expedição e Financeiro. Uma pessoa poderá acumular perfis ou conjuntos de permissões. A matriz de permissões será detalhada posteriormente; clientes e fornecedores não terão perfil de acesso.

### 4.9. Relações de referência para a modelagem

| Relação | Definição |
|---|---|
| Pedido → produtos | 1..N itens com produtos e quantidades. |
| Pedido → ordem de produção | Uma ordem gerada automaticamente no registro de todo pedido, inclusive com estoque acabado suficiente. |
| Ordem de produção → pedido | 0..1 pedido de origem; ordens manuais não exigem pedido. |
| Ordem de produção → produtos | 1..N itens com produtos e quantidades. |
| Produto → receita | Uma ficha técnica/receita de referência para produção e custo; versionamento não definido. |
| Receita → insumos | 1..N componentes, com quantidades e unidades de medida. |
| Expedição → pedido | Um pedido obrigatório por expedição; sem atendimento parcial inicialmente. |

Essas relações orientam a modelagem conceitual e não substituem o diagrama de classes ou o DER, ainda a elaborar.

---

## 5. Funcionalidades fora do escopo

Não fazem parte da primeira versão do sistema:

- Desenvolvimento de um ERP de abrangência geral;
- Emissão de documentos fiscais;
- Integração com sistemas fiscais ou tributários;
- Contabilidade completa;
- Contas a pagar e contas a receber;
- Sugestão automática de preço de venda;
- Produção parcial;
- Expedição parcial;
- Roteirização de entregas;
- Rastreamento de transporte;
- Gestão de frota;
- Integração com transportadoras;
- Criação automática de pedidos de compra;
- Envio automático de pedidos aos fornecedores;
- Gestão de validade de alimentos;
- Emissão de etiquetas de validade;
- Controle de lotes baseado em vencimento;
- Aplicação de FEFO ou regras de expedição baseadas em validade.

Funcionalidades não descritas neste documento não devem ser consideradas automaticamente pertencentes ao escopo.

Sua inclusão deverá ser avaliada pelo grupo considerando relevância, impacto no projeto e cronograma.

---

## 6. Requisitos funcionais iniciais

| ID | Requisito |
|---|---|
| RF01 | O sistema deverá permitir o cadastro e a consulta de insumos. |
| RF02 | O sistema deverá permitir o cadastro e a consulta de produtos acabados. |
| RF03 | O sistema deverá permitir cadastrar fichas técnicas/receitas com produto, rendimento e um ou mais insumos, quantidades e unidades de medida. |
| RF04 | O sistema deverá permitir o cadastro e a consulta de fornecedores. |
| RF05 | O sistema deverá permitir o cadastro e a consulta de clientes. |
| RF06 | O sistema deverá permitir consultar o estoque disponível de insumos. |
| RF07 | O sistema deverá permitir consultar o estoque disponível de produtos acabados. |
| RF08 | O sistema deverá permitir consultar o histórico de movimentações dos estoques de insumos e produtos acabados. |
| RF09 | O sistema deverá permitir a Compras registrar aquisições de insumos com quantidades e preços, sem gerar entrada no estoque nesse registro. |
| RF10 | O sistema deverá registrar a entrada dos insumos no estoque após o recebimento de uma compra. |
| RF11 | O sistema deverá permitir ao PCP criar manualmente ordens de produção com um ou mais produtos e suas quantidades, sem exigir pedido de origem. |
| RF12 | O sistema deverá permitir ao Comercial registrar pedidos vinculados a clientes cadastrados, com um ou mais produtos e suas quantidades. |
| RF13 | O sistema deverá gerar automaticamente, no registro de cada pedido, uma única ordem de produção vinculada a ele, com todos os seus produtos e quantidades, mesmo com estoque acabado suficiente. |
| RF14 | O sistema deverá calcular os insumos necessários para uma ordem de produção a partir das receitas dos produtos e das quantidades solicitadas. |
| RF15 | O sistema deverá identificar e informar os insumos cuja quantidade disponível seja insuficiente para uma ordem de produção. |
| RF16 | O sistema deverá permitir que uma ordem de produção seja criada mesmo quando houver insuficiência de insumos. |
| RF17 | O sistema deverá manter uma ordem de produção aguardando reposição quando não houver insumos suficientes para seu início. |
| RF18 | O sistema deverá permitir acompanhar o estado das ordens de produção. |
| RF19 | O sistema deverá registrar o consumo dos insumos utilizados na conclusão da ordem de produção. |
| RF20 | O sistema deverá registrar a entrada dos produtos acabados correspondentes no estoque na conclusão da ordem de produção. |
| RF21 | O sistema deverá permitir registrar a expedição integral vinculada a um pedido, incluindo destinatário, produtos, quantidades e data. |
| RF22 | O sistema deverá registrar a saída dos produtos acabados do estoque em decorrência da expedição. |
| RF23 | O sistema deverá permitir registrar valores básicos das operações de venda/expedição; o momento e a forma do registro dependem de PD05. |
| RF24 | O sistema deverá permitir registrar valores básicos das compras; a forma do registro financeiro e seu vínculo dependem de PD05. |
| RF25 | O sistema deverá permitir ao Comercial alterar pedidos até antes do início da produção e atualizar os itens e necessidades da ordem vinculada. |
| RF26 | O sistema deverá permitir ao PCP consultar os insumos faltantes e acionar o processo de reposição junto a Compras. |
| RF27 | O sistema deverá reavaliar a disponibilidade dos insumos após seu recebimento e verificar sua suficiência antes de iniciar a produção. |
| RF28 | O sistema deverá concluir integralmente a ordem de produção, sem conclusão parcial na primeira versão. |
| RF29 | O sistema deverá registrar motivo, quantidades consumidas, perdidas e aproveitáveis no cancelamento; baixar consumo e perdas sem duplicidade, liberar a reserva não utilizada e dar entrada nos produtos aproveitáveis. |
| RF30 | O sistema deverá calcular o custo dos produtos pela receita e pelo último preço de compra conhecido de cada insumo. |
| RF31 | O sistema deverá permitir cadastrar manualmente o preço de venda dos produtos. |
| RF32 | O sistema deverá controlar o acesso dos usuários internos e permitir acumular perfis ou conjuntos de permissões, conforme matriz ainda a definir. |
| RF33 | O sistema deverá permitir consultar os valores básicos registrados para acompanhamento financeiro das operações. |

Esta é uma relação inicial de requisitos. Os requisitos serão detalhados e revisados ao longo da análise e modelagem do sistema.

---

## 7. Regras de negócio iniciais

| ID | Regra |
|---|---|
| RN01 | Cada produto possui uma receita de referência com rendimento e um ou mais insumos, suas quantidades e unidades de medida. |
| RN02 | A necessidade de cada insumo em uma ordem de produção deve ser calculada com base nas receitas dos produtos incluídos e nas quantidades solicitadas. |
| RN03 | O sistema deve informar ao usuário quando a quantidade disponível de um ou mais insumos for inferior à quantidade necessária para a ordem de produção. |
| RN04 | Uma ordem de produção pode ser criada mesmo quando houver insuficiência de insumos. |
| RN05 | Quando houver insuficiência de insumos, a ordem de produção deve permanecer aguardando reposição antes de iniciar. |
| RN06 | O recebimento de insumos adquiridos deve gerar a entrada correspondente no estoque de insumos. |
| RN07 | O consumo dos insumos deve ser registrado somente na conclusão da ordem de produção. |
| RN08 | A entrada dos produtos acabados no estoque deve ser registrada na conclusão da ordem de produção. |
| RN09 | Uma ordem de produção poderá ter origem manual ou estar vinculada a um pedido de cliente. |
| RN10 | Todo pedido contém um ou mais produtos e gera automaticamente uma única ordem de produção no registro, mesmo com estoque acabado suficiente; não há atendimento direto sem ordem. |
| RN11 | A expedição deve gerar a saída da quantidade correspondente do estoque de produtos acabados. |
| RN12 | Comercial registra pedidos. Clientes e fornecedores são cadastros, sem acesso ao sistema. |
| RN13 | Uma ordem contém um ou mais produtos e quantidades; uma ordem manual não exige pedido de origem. |
| RN14 | O PCP identifica necessidades de reposição; Compras registra aquisições e o Estoque registra recebimentos. |
| RN15 | Registrar uma compra não altera o saldo do estoque; somente seu recebimento gera a entrada dos insumos adquiridos. |
| RN16 | Após receber insumos, sua disponibilidade deve ser reavaliada; a produção só inicia com todos os insumos necessários disponíveis. |
| RN17 | A produção é concluída integralmente, sem conclusão parcial na primeira versão. |
| RN18 | Produtos acabados passam pelo estoque antes da expedição. |
| RN19 | Toda expedição está vinculada a um pedido e atende seus itens integralmente, sem expedição parcial inicialmente. |
| RN20 | Pedidos podem ser alterados somente até antes do início da produção; alterações devem refletir na ordem vinculada e no cálculo de insumos. |
| RN21 | Cancelamento durante a produção exige motivo e apuração das quantidades consumidas, perdidas e aproveitáveis; baixa consumo e perdas sem duplicidade, libera a reserva não utilizada e recebe os produtos aproveitáveis. |
| RN22 | O custo do produto utiliza sua receita e o último preço de compra conhecido de cada insumo, com unidades compatíveis e rendimento da receita. |
| RN23 | O preço de venda é informado manualmente. Sugestão automática de preço não faz parte da primeira versão. |
| RN24 | Usuários internos podem acumular perfis ou conjuntos de permissões. |
| RN25 | Registros financeiros acompanham os valores das operações; não constituem controle bancário, contas a pagar, contas a receber ou contabilidade completa. |

Outras regras de negócio serão acrescentadas conforme os pontos pendentes forem definidos.

---

## 8. Requisitos não funcionais

Os requisitos não funcionais ainda serão especificados de maneira mensurável após a definição da arquitetura e das tecnologias utilizadas.

Inicialmente, deverão ser considerados os seguintes aspectos:

- Controle de acesso;
- Integridade e consistência dos dados;
- Usabilidade;
- Tratamento adequado de erros;
- Clareza das mensagens apresentadas ao usuário;
- Manutenibilidade;
- Organização do código;
- Testabilidade;
- Documentação.

Não serão definidos valores ou metas arbitrárias nesta etapa.

Os critérios deverão ser especificados posteriormente de forma que possam ser verificados ou avaliados.

---

## 9. Estratégia preliminar de validação

A validação principal do software não dependerá da disponibilidade de uma empresa parceira.

A validação funcional será planejada a partir dos requisitos e regras de negócio definidos neste documento.

Será utilizada uma base de dados sintética contendo informações representativas do domínio, como:

- Insumos;
- Produtos;
- Receitas;
- Fornecedores;
- Clientes;
- Compras;
- Pedidos;
- Ordens de produção;
- Movimentações de estoque.

Serão elaborados cenários contendo:

1. Dados de entrada;
2. Operações executadas;
3. Resultados esperados;
4. Resultados obtidos.

Esses cenários permitirão verificar o comportamento do sistema diante das regras especificadas.

Caso seja possível estabelecer parceria com uma empresa do setor alimentício, poderá ser realizada uma avaliação complementar com usuários e/ou dados reais, mediante autorização.

Essa participação será considerada complementar e não será requisito para a conclusão do projeto.

A metodologia definitiva de avaliação ainda deverá ser discutida com o orientador.

---

## 10. Decisões confirmadas

| ID | Decisão |
|---|---|
| DC01 | O público-alvo será composto por pequenas e médias empresas do setor alimentício. |
| DC02 | As ordens de produção poderão ser criadas manualmente ou a partir de pedidos de clientes. |
| DC03 | O sistema identificará insuficiências de insumos, enquanto o registro das compras será realizado pelo usuário. |
| DC04 | O financeiro acompanha valores básicos das operações, sem contas a pagar, contas a receber ou contabilidade completa. |
| DC05 | A expedição será vinculada a pedido e registrará destinatário, produtos, quantidades e data, sem atendimento parcial. |
| DC06 | A validação principal não dependerá da disponibilização de dados de uma empresa parceira. |
| DC07 | Uma ordem de produção poderá ser criada mesmo sem estoque suficiente, permanecendo aguardando reposição antes do início. |
| DC08 | O consumo dos insumos e a entrada dos produtos acabados serão registrados na conclusão da ordem de produção. |
| DC09 | Todo pedido deverá gerar uma única ordem para seus produtos, inclusive com estoque acabado suficiente; atendimento direto sem ordem não faz parte do fluxo. |
| DC10 | Comercial registra pedidos; clientes e fornecedores não acessam o sistema. |
| DC11 | O PCP identifica faltas e aciona Compras; a compra só aumenta o estoque após o recebimento. |
| DC12 | Produção e expedição serão integrais inicialmente. Produtos acabados sempre passam pelo estoque. |
| DC13 | O custo usa receitas e o último preço de compra dos insumos; o preço de venda é manual. |
| DC14 | Usuários internos podem acumular perfis; pedidos podem ser alterados até antes do início da produção. |

---

## 11. Pontos pendentes de definição

| ID | Questão |
|---|---|
| PD01 | Qual perfil de estabelecimento será utilizado como referência nos cenários de uso e avaliação? |
| PD02 | Quais serão os estados e os dados obrigatórios dos pedidos de clientes? |
| PD03 | Regra confirmada para cancelamento: apurar consumo e perdas separadamente, baixar sem duplicidade, liberar reserva não utilizada e receber produtos aproveitáveis. Falhas e autorizações ainda a detalhar. |
| PD04 | Quais dados obrigatórios restantes e transições serão usados na expedição integral vinculada ao pedido? |
| PD05 | Quais registros financeiros serão manuais e quais decorrerão automaticamente de outras operações? |
| PD06 | Qual será a matriz de permissões dos perfis funcionais de referência e como será feita a administração de acesso? |
| PD07 | Quais critérios mensuráveis serão utilizados na validação e nos requisitos não funcionais? |
| PD08 | Quais serão todos os estados e transições possíveis de uma ordem de produção? |
| PD10 | Regra confirmada: reserva ao iniciar a produção, com baixa normal na conclusão. Falta definir o mecanismo de integridade para inícios concorrentes na arquitetura. |
| PD11 | Como definir o último preço de compra, tratar ausência de preço e converter unidades no cálculo de custo? |

PD09 foi resolvida nesta revisão: todo pedido deverá gerar uma ordem de produção, inclusive com estoque acabado suficiente. O identificador foi mantido neste registro histórico e não será reutilizado como nova pendência.

---

## 12. Controle de alterações

| Versão | Alteração |
|---|---|
| 0.1 | Definição inicial do escopo, requisitos, regras de negócio, decisões confirmadas e pontos pendentes. |
| 0.2 | Revisão em 13/10/2026: responsabilidades e acesso, pedido e ordem com vários produtos, ordem obrigatória para todo pedido (PD09 resolvida), recebimento separado da compra, produção e expedição integrais, custos e financeiro simplificado; demais pendências preservadas para revisão coletiva. |
| 0.3 | Revisão em 17/10/2026: registro da revisão coletiva informada pelo solicitante, remoção da redação que tornava a ordem opcional e vínculo ao diagrama de casos de uso, sem resolver implicitamente os detalhamentos pendentes. |

O [diagrama de casos de uso](../03-modelagem/casos-de-uso/README.md) utiliza estes identificadores RF/RN e os casos CU01 a CU20 do catálogo de atores e casos de uso.

## Decisões complementares — 20/10/2026

- **RF34 / RN26 — Reserva:** ao iniciar a produção, verificar e reservar conjuntamente todos os insumos necessários. Reserva não é baixa física; o saldo disponível corresponde ao saldo físico menos reservas ativas. Outro início não pode usar o saldo já reservado. Na conclusão, consumir os insumos e encerrar a reserva sem subtrair duas vezes do disponível. O mecanismo técnico será definido na arquitetura (PD10).
- **RF35 / RN27 — Composição preservada:** cada item da OP guarda a composição, as quantidades, unidades e rendimento da receita usados no dimensionamento. Alterar o cadastro da receita não altera automaticamente ordens existentes. Alterações de itens do pedido antes do início continuam exigindo recálculo; a política de revisão da composição nessa situação precisa ser detalhada.
- **RF36 / RN28 — Recebimentos parciais:** uma compra admite vários recebimentos. Cada item recebido referencia seu item comprado; a soma recebida não excede a quantidade comprada. Cada recebimento movimenta apenas a quantidade efetiva e reavalia as faltas das ordens.
- **RN29 — Cancelamento:** consumo e perdas são quantidades separadas, na unidade do insumo, sem sobreposição. Sua soma é baixada uma única vez; o restante da reserva é liberado e os produtos aproveitáveis entram no estoque. Esse encerramento excepcional não permite conclusão parcial normal nem expedição parcial. Autorizações e falhas não decorrentes de cancelamento seguem em PD03.

As regras acima foram confirmadas pelo solicitante nesta conversa. PD03 e PD10 ficam parcialmente resolvidas; seus detalhamentos técnicos e de autorização não são presumidos.
