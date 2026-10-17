# Diagrama Entidade-Relacionamento (DER)

## O que representa

Descreve os dados que precisam ser armazenados e os relacionamentos entre eles. Conforme o nível de detalhamento, identifica entidades, atributos, cardinalidades e chaves. Complementa as classes de domínio com uma visão voltada à persistência.

## Por que é importante no projeto

Ajuda a definir um banco consistente e a manter a rastreabilidade das operações. Evita registrar produtos, quantidades e vínculos de maneira que permita duplicações ou perda de histórico.

## Exemplo no nosso sistema

Deve distinguir o registro da compra do recebimento que gera entrada no estoque. Também precisa sustentar os itens de pedidos, ordens e receitas e as movimentações decorrentes da conclusão da produção e da expedição. Uma compra registrada, por si só, não representa insumo disponível.

## Base para elaboração

O DER ainda será elaborado a partir das classes e do [escopo](../../02-requisitos/escopo-e-requisitos.md). Recebimentos parciais, reservas e concorrência não devem ganhar regras definitivas antes da resolução das pendências correspondentes.
