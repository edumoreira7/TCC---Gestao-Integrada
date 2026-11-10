# Diagrama Entidade-Relacionamento (DER)

## O que representa

Representa a estrutura dos dados que precisam ser armazenados pelo sistema e os relacionamentos entre eles. Identifica entidades, atributos, chaves primárias, chaves estrangeiras, cardinalidades e restrições de integridade. Complementa o Diagrama de Classes de Domínio com uma visão voltada à persistência dos dados.

## Por que é importante no projeto

Ajuda a definir uma estrutura de banco de dados consistente e a manter a rastreabilidade das operações. Evita duplicidade de informações, vínculos inválidos e perda do histórico de compras, recebimentos, pedidos, produção, estoque e expedição.

## Exemplo no nosso sistema

O DER deve distinguir o registro de uma compra do recebimento que efetivamente gera entrada no estoque. Também deve representar os itens de pedidos e ordens de produção, as receitas utilizadas e as movimentações de produtos acabados e insumos. Todo pedido gera automaticamente uma única ordem de produção; OP manual não exige pedido. PD12 permanece pendente.

## Base para elaboração

O DER será elaborado a partir do [Diagrama de Classes de Domínio](../classes/README.md), do [escopo e requisitos](../../02-requisitos/escopo-e-requisitos.md), do [catálogo funcional](../../02-requisitos/atores-casos-de-uso-regras-de-negocio.md) e das [decisões do projeto](../../01-visao-geral/decisoes-do-projeto.md). PD12 permanece pendente: decidir o efeito do estoque acabado no dimensionamento. A concorrência de insumos depende de PD10.
