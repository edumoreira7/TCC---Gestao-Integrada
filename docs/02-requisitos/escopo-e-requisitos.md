# Escopo e Requisitos do Sistema

**Projeto:** Gestão Integrada de Estoque e Produção no Setor Alimentício: uma abordagem baseada em receitas e necessidades de insumo  
**Versão:** 0.1  
**Etapa:** TCC1 — Levantamento de requisitos e análise  
**Status:** Em elaboração

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

Cada receita deverá relacionar um produto aos insumos e às quantidades necessárias para sua produção.

---

### 4.2. Estoque

O sistema deverá controlar os estoques de insumos e produtos acabados.

Deverá ser possível consultar as quantidades disponíveis e acompanhar movimentações decorrentes de compras, produção e expedição.

O histórico dessas movimentações deverá permanecer disponível para consulta.

---

### 4.3. Compras

O sistema deverá permitir o registro de compras de insumos e o recebimento dos itens adquiridos.

Ao criar uma ordem de produção, o sistema deverá calcular a quantidade de insumos necessária com base nas receitas dos produtos e nas quantidades solicitadas.

Caso algum insumo esteja disponível em quantidade inferior à necessária, o sistema deverá informar a insuficiência ao usuário.

A identificação da necessidade de compra será feita pelo sistema, mas o registro da compra será realizado pelo usuário.

Não está prevista a criação ou o envio automático de pedidos de compra aos fornecedores.

---

### 4.4. Produção

O sistema deverá permitir a criação e o acompanhamento de ordens de produção.

Uma ordem poderá ser criada de duas formas:

1. Manualmente por um usuário;
2. A partir de um pedido de cliente.

Quando a ordem for criada manualmente, o usuário deverá informar os produtos e as respectivas quantidades que serão produzidas.

Quando a ordem tiver origem em um pedido de cliente, um único pedido deverá gerar uma única ordem de produção, mesmo quando possuir mais de um produto.

A ordem de produção poderá ser criada mesmo quando não houver quantidade suficiente de todos os insumos necessários.

Nessa situação, a ordem deverá permanecer aguardando reposição e não poderá iniciar enquanto os insumos necessários não estiverem disponíveis.

O consumo dos insumos será registrado somente na conclusão da ordem de produção.

No mesmo momento, deverá ser registrada a entrada dos produtos acabados correspondentes no estoque.

---

### 4.5. Pedidos de clientes

O sistema deverá permitir registrar pedidos de clientes contendo um ou mais produtos.

Um pedido poderá dar origem a uma ordem de produção.

### Decisão confirmada

Um pedido de cliente gera uma única ordem de produção, mesmo quando contém mais de um produto.

### Pontos pendentes

Ainda deverão ser definidos:

- Dados obrigatórios de um pedido;
- Estados possíveis de um pedido;
- Regras para alterações e cancelamentos;
- Relação entre pedido e expedição.

---

### 4.6. Expedição

O sistema deverá permitir registrar a saída de produtos acabados.

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
- Integração com transportadoras.

---

### 4.7. Controle financeiro básico

O sistema deverá permitir o registro básico de entradas e saídas financeiras.

O objetivo deste módulo será registrar movimentações financeiras relacionadas aos processos do sistema, sem desenvolver funcionalidades equivalentes a um sistema contábil completo.

### Ponto pendente

Ainda deverá ser definido quais eventos gerarão registros financeiros e quais registros serão manuais ou automáticos.

---

## 5. Funcionalidades fora do escopo

Não fazem parte da primeira versão do sistema:

- Desenvolvimento de um ERP de abrangência geral;
- Emissão de documentos fiscais;
- Integração com sistemas fiscais ou tributários;
- Contabilidade completa;
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
| RF03 | O sistema deverá permitir o cadastro de receitas, relacionando produtos, insumos e quantidades necessárias. |
| RF04 | O sistema deverá permitir o cadastro e a consulta de fornecedores. |
| RF05 | O sistema deverá permitir o cadastro e a consulta de clientes. |
| RF06 | O sistema deverá permitir consultar o estoque disponível de insumos. |
| RF07 | O sistema deverá permitir consultar o estoque disponível de produtos acabados. |
| RF08 | O sistema deverá permitir consultar o histórico de movimentações dos estoques de insumos e produtos acabados. |
| RF09 | O sistema deverá permitir registrar compras de insumos. |
| RF10 | O sistema deverá registrar a entrada dos insumos no estoque após o recebimento de uma compra. |
| RF11 | O sistema deverá permitir a criação manual de ordens de produção. |
| RF12 | O sistema deverá permitir registrar pedidos de clientes contendo um ou mais produtos. |
| RF13 | O sistema deverá permitir criar uma única ordem de produção a partir de um pedido de cliente. |
| RF14 | O sistema deverá calcular os insumos necessários para uma ordem de produção a partir das receitas dos produtos e das quantidades solicitadas. |
| RF15 | O sistema deverá identificar e informar os insumos cuja quantidade disponível seja insuficiente para uma ordem de produção. |
| RF16 | O sistema deverá permitir que uma ordem de produção seja criada mesmo quando houver insuficiência de insumos. |
| RF17 | O sistema deverá manter uma ordem de produção aguardando reposição quando não houver insumos suficientes para seu início. |
| RF18 | O sistema deverá permitir acompanhar o estado das ordens de produção. |
| RF19 | O sistema deverá registrar o consumo dos insumos utilizados na conclusão da ordem de produção. |
| RF20 | O sistema deverá registrar a entrada dos produtos acabados correspondentes no estoque na conclusão da ordem de produção. |
| RF21 | O sistema deverá permitir registrar a expedição de produtos acabados, incluindo destinatário, produto, quantidade e data. |
| RF22 | O sistema deverá registrar a saída dos produtos acabados do estoque em decorrência da expedição. |
| RF23 | O sistema deverá permitir registrar entradas financeiras básicas. |
| RF24 | O sistema deverá permitir registrar saídas financeiras básicas. |

Esta é uma relação inicial de requisitos. Os requisitos serão detalhados e revisados ao longo da análise e modelagem do sistema.

---

## 7. Regras de negócio iniciais

| ID | Regra |
|---|---|
| RN01 | Uma receita deve relacionar um produto aos insumos e às quantidades necessárias para sua produção. |
| RN02 | A necessidade de cada insumo em uma ordem de produção deve ser calculada com base nas receitas dos produtos incluídos e nas quantidades solicitadas. |
| RN03 | O sistema deve informar ao usuário quando a quantidade disponível de um ou mais insumos for inferior à quantidade necessária para a ordem de produção. |
| RN04 | Uma ordem de produção pode ser criada mesmo quando houver insuficiência de insumos. |
| RN05 | Quando houver insuficiência de insumos, a ordem de produção deve permanecer aguardando reposição antes de iniciar. |
| RN06 | O recebimento de insumos adquiridos deve gerar a entrada correspondente no estoque de insumos. |
| RN07 | O consumo dos insumos deve ser registrado somente na conclusão da ordem de produção. |
| RN08 | A entrada dos produtos acabados no estoque deve ser registrada na conclusão da ordem de produção. |
| RN09 | Uma ordem de produção poderá ter origem manual ou estar vinculada a um pedido de cliente. |
| RN10 | Um pedido de cliente gera uma única ordem de produção, mesmo quando possuir mais de um produto. |
| RN11 | A expedição deve gerar a saída da quantidade correspondente do estoque de produtos acabados. |

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
| DC04 | O controle financeiro ficará limitado ao registro básico de entradas e saídas. |
| DC05 | A expedição registrará destinatário, produto, quantidade e data. |
| DC06 | A validação principal não dependerá da disponibilização de dados de uma empresa parceira. |
| DC07 | Uma ordem de produção poderá ser criada mesmo sem estoque suficiente, permanecendo aguardando reposição antes do início. |
| DC08 | O consumo dos insumos e a entrada dos produtos acabados serão registrados na conclusão da ordem de produção. |
| DC09 | Um pedido de cliente gerará uma única ordem de produção, mesmo quando possuir vários produtos. |

---

## 11. Pontos pendentes de definição

| ID | Questão |
|---|---|
| PD01 | Qual perfil de estabelecimento será utilizado como referência nos cenários de uso e avaliação? |
| PD02 | Quais serão os estados e os dados obrigatórios dos pedidos de clientes? |
| PD03 | Como serão tratados cancelamentos, alterações de quantidade e falhas durante a produção? |
| PD04 | Como será realizado o vínculo entre pedidos de clientes e registros de expedição? |
| PD05 | Quais registros financeiros serão manuais e quais decorrerão automaticamente de outras operações? |
| PD06 | Quais perfis de usuário e níveis de permissão serão necessários? |
| PD07 | Quais critérios mensuráveis serão utilizados na validação e nos requisitos não funcionais? |
| PD08 | Quais serão todos os estados e transições possíveis de uma ordem de produção? |

---

## 12. Controle de alterações

| Versão | Alteração |
|---|---|
| 0.1 | Definição inicial do escopo, requisitos, regras de negócio, decisões confirmadas e pontos pendentes. |