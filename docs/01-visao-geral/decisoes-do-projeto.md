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
- Criação a partir de um pedido de cliente.

Um pedido de cliente deverá gerar uma única ordem de produção, mesmo quando possuir vários produtos.

---

## Disponibilidade de insumos

Uma ordem de produção poderá ser criada mesmo quando os insumos disponíveis não forem suficientes.

Quando houver insuficiência, a ordem deverá permanecer aguardando reposição antes de iniciar.

O sistema deverá identificar os insumos faltantes.

O registro da compra será realizado pelo usuário.

---

## Movimentações da produção

Os insumos não serão descontados do estoque no momento da criação ou do início da ordem.

O consumo dos insumos será registrado na conclusão da ordem de produção.

A entrada dos produtos acabados também será registrada na conclusão.

---

## Expedição

A expedição deverá registrar, no mínimo:

- Destinatário;
- Produto;
- Quantidade;
- Data.

Não fazem parte do escopo inicial o rastreamento de entregas, roteirização, gestão de frota ou integração com transportadoras.

---

## Financeiro

O controle financeiro terá escopo simplificado.

Serão registradas entradas e saídas financeiras básicas.

Não está prevista a implementação de um sistema contábil completo.

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
- Rastreamento logístico;
- Roteirização;
- Criação automática de pedidos de compra.

---

## Decisões ainda pendentes

Ainda deverão ser definidos:

- Perfis de usuário;
- Permissões;
- Estados completos das ordens de produção;
- Estados dos pedidos;
- Regras de cancelamento;
- Relação detalhada entre pedido e expedição;
- Funcionamento detalhado das movimentações financeiras;
- Metodologia definitiva de avaliação;
- Requisitos não funcionais mensuráveis.

Esses itens não devem ser considerados definidos até serem discutidos e documentados.