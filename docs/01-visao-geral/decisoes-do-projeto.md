# Decisões do Projeto

Este documento registra decisões relevantes tomadas durante o desenvolvimento do TCC.

O objetivo é manter um histórico das definições que afetam o escopo, os requisitos, a arquitetura e a implementação do sistema.

---

## Público-alvo

O sistema será desenvolvido considerando pequenas e médias empresas do setor alimentício.

A proposta não está restrita exclusivamente a restaurantes.

---

## Escopo da solução

O projeto tem como foco os processos relacionados a:

- Insumos;
- Receitas;
- Fornecedores;
- Compras;
- Pedidos de clientes;
- Produção;
- Estoque de insumos;
- Estoque de produtos acabados;
- Expedição;
- Movimentações financeiras básicas.

O objetivo não é desenvolver um ERP de abrangência geral.

---

## Ordens de produção

As ordens de produção poderão ter duas origens:

- Criação manual pelo usuário;
- Criação automática no registro de um pedido de cliente.

Cada pedido contém um ou mais produtos e deverá gerar uma única ordem de produção, mesmo quando possuir vários produtos ou já houver produtos acabados suficientes em estoque. O atendimento direto sem ordem de produção não faz parte do fluxo.

O registro do pedido gera automaticamente sua única ordem de produção, sem ação adicional do PCP. A geração integra o fluxo de registrar pedido e não constitui caso de uso separado.

Uma ordem contém um ou mais produtos e suas quantidades. Cada produto utiliza uma ficha técnica/receita com insumos, quantidades, unidades de medida e quantidade de produto resultante, necessária para dimensionar a produção.

O Comercial registra o pedido e poderá alterá-lo até antes do início da produção. Alterações que afetem uma ordem já criada devem refletir nos seus itens e no cálculo da necessidade de insumos antes do início.

A produção será concluída integralmente; produção parcial não faz parte da primeira versão.

---

## Disponibilidade de insumos

Uma ordem de produção poderá ser criada mesmo quando os insumos disponíveis não forem suficientes.

Quando houver insuficiência, a ordem deverá permanecer aguardando reposição antes de iniciar.

O sistema deverá identificar os insumos faltantes.

O PCP identifica a necessidade de reposição e aciona Compras. O registro da compra será realizado pelo usuário autorizado.

O registro da compra, com quantidades e preços dos insumos, não aumenta o estoque. A entrada ocorre somente no recebimento efetivo pelo Estoque. Após o recebimento, a disponibilidade dos insumos da ordem deverá ser reavaliada antes de liberar seu início.

---

## Movimentações da produção

Os insumos não serão descontados do estoque no momento da criação ou do início da ordem.

O consumo dos insumos será registrado na conclusão da ordem de produção.

A entrada dos produtos acabados também será registrada na conclusão.

Produtos acabados sempre passam pelo estoque antes da expedição. Ordens manuais abastecem esse estoque e não originam, por si só, uma expedição.

No cancelamento durante a produção, deverão ser registrados o motivo e a situação dos insumos e produtos envolvidos. Produtos acabados aproveitáveis poderão ser incorporados ao estoque. O tratamento das quantidades consumidas, perdas e movimentações dessa exceção ainda deverá ser detalhado.

---

## Expedição

A expedição estará vinculada a um pedido e deverá registrar, no mínimo:

- Destinatário;
- Produto;
- Quantidade;
- Data.

Um pedido com vários produtos terá seus itens e quantidades registrados na expedição. Não haverá expedição parcial inicialmente. O registro da expedição gera a saída correspondente do estoque de produtos acabados.

Não fazem parte do escopo inicial o rastreamento de entregas, roteirização, gestão de frota ou integração com transportadoras.

---

## Financeiro

O controle financeiro terá escopo simplificado.

Serão registrados valores básicos das operações de compra e venda/expedição. Esses registros não representam confirmação de pagamentos ou recebimentos bancários.

As compras registram os preços dos insumos. O custo de um produto será calculado pela receita, utilizando o último preço de compra conhecido de cada insumo, com unidades compatíveis e considerando o rendimento da receita.

O preço de venda será cadastrado manualmente. A sugestão automática de preço com base no custo fica como evolução futura.

Não estão previstos contas a pagar, contas a receber ou um sistema contábil completo. Eventos, campos, automatização e tratamento de estornos dos registros financeiros ainda precisam de detalhamento.

---

## Responsabilidades e acesso

Os perfis funcionais de referência são Comercial, PCP, Compras, Estoque, Produção, Expedição e Financeiro. A matriz detalhada de permissões e a administração dos acessos ainda serão definidas.

Uma mesma pessoa poderá acumular mais de um perfil ou conjunto de permissões. Clientes e fornecedores são entidades cadastradas, não atores com acesso ao sistema.

---

## Validação

A conclusão do projeto não dependerá da participação de uma empresa específica.

A estratégia principal deverá utilizar dados sintéticos e cenários de teste definidos a partir dos requisitos e das regras de negócio.

Caso seja possível contar com uma empresa do setor, usuários ou dados reais poderão ser utilizados como avaliação complementar, mediante autorização.

---

## Funcionalidades deliberadamente fora do escopo

Não fazem parte do escopo atual:

- Gestão de validade;
- Emissão de etiquetas de validade;
- FEFO;
- Gestão fiscal completa;
- Contabilidade completa;
- Contas a pagar e contas a receber;
- Produção e expedição parciais;
- Sugestão automática de preço de venda;
- Rastreamento logístico;
- Roteirização;
- Criação automática de pedidos de compra.

---

## Decisões ainda pendentes

Ainda deverão ser definidos:

- Matriz detalhada de permissões e administração dos perfis de referência;
- Estados completos das ordens de produção;
- Estados dos pedidos;
- Movimentações no cancelamento durante a produção, incluindo consumo efetivo, perdas e aproveitamento de produtos;
- Dados obrigatórios restantes e transições de pedidos e expedições;
- Reserva de estoque e tratamento de ordens concorrentes, já que a baixa normal ocorre somente na conclusão;
- Critério temporal do último preço de compra, ausência de preço e conversões entre unidades;
- Funcionamento detalhado das movimentações financeiras;
- Metodologia definitiva de avaliação;
- Requisitos não funcionais mensuráveis.

Esses itens não devem ser considerados definidos até serem discutidos e documentados.

## Registro da revisão

Em 13/10/2026, este documento foi atualizado com o resumo da discussão e a imagem do macrofluxo. Naquela revisão, foi confirmada pelo solicitante a obrigatoriedade de criar uma ordem para todo pedido, inclusive com estoque acabado suficiente. A validação coletiva do fluxo ainda estava pendente àquela data.

Em 17/10/2026, o solicitante confirmou que a revisão do grupo sobre a base consolidada no PR #13 já ocorreu. Essa confirmação atualiza o status da base e do macrofluxo; as decisões listadas como pendentes continuam abertas. O PDF de visão geral foi alinhado ao acesso exclusivamente interno e ao financeiro simplificado.
