# Guia dos Diagramas de Estados

## 1. O que representa

Representa os estados possíveis de um objeto e os eventos ou condições que provocam mudanças entre eles ao longo de seu ciclo de vida.

## 2. Por que é importante no projeto

Ajuda a definir o comportamento de pedidos, ordens de produção, compras/recebimentos e expedições, distinguindo os estados documentados das propostas que ainda dependem de validação.

## 3. Exemplo no nosso sistema

Uma OP com insuficiência de insumos aguarda reposição. Quando todos os insumos necessários estão disponíveis, eles são reservados conjuntamente no início da produção. Após o registro da conclusão, o consumo é baixado uma única vez e a OP passa ao estado concluído. O cancelamento durante a produção possui tratamento específico para consumo, perdas, reserva não utilizada e produtos aproveitáveis.

## 4. Base para elaboração

Escopo e requisitos, catálogo de casos de uso e regras de negócio RN01–RN29, incluindo as decisões complementares registradas em 20/10/2026. Quando o catálogo oficial de estados e transições não está definido, o desenho é identificado como proposta para validação do grupo. Pendências como PD02, PD03, PD04, PD08 e PD10 devem permanecer explícitas.
