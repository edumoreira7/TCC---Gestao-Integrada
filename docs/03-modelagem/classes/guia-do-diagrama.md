# Diagrama de Classes de Domínio

## O que representa

Descreve os conceitos do negócio, seus atributos e relacionamentos. As multiplicidades indicam quantas ocorrências podem se relacionar. É uma visão do domínio, não uma cópia das tabelas do banco ou das classes de uma linguagem de programação.

## Por que é importante no projeto

Estabelece um vocabulário comum para requisitos, dados e implementação. Ajuda a evitar confusão entre conceitos distintos, como produto, insumo, receita, pedido e ordem de produção.

## Exemplo no nosso sistema

Deve representar pedidos e ordens com seus itens e as receitas com composição e rendimento. Todo pedido deverá ter uma única ordem, gerada automaticamente no registro; uma ordem manual não possui pedido de origem. Esses vínculos precisam expressar tanto a regra quanto o momento do processo.

## Base para elaboração

O [modelo baseado na imagem oficial](README.md) está disponível em três vistas complementares e uma fonte editável, alinhado ao [catálogo funcional](../../02-requisitos/atores-casos-de-uso-regras-de-negocio.md) e ao [escopo](../../02-requisitos/escopo-e-requisitos.md). A consulta ao estoque acabado antes do dimensionamento permanece pendente (PD12); a OP única por pedido continua obrigatória. Relacionamentos afetados por decisões pendentes estão identificados nas notas.
