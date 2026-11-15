# Guia dos Diagramas de Estados

## 1. O que representa

Representa os estados possíveis de um objeto e os eventos ou condições que provocam mudanças entre eles ao longo de seu ciclo de vida.

## 2. Por que é importante no projeto

Ajuda a definir o comportamento de pedidos, ordens de produção, compras/recebimentos e expedições, distinguindo os estados documentados das propostas que ainda dependem de validação.

## 3. Exemplo no nosso sistema

Uma OP com faltas aguarda reposição. No início, os insumos são reservados sem baixa física. Na conclusão integral, o sistema baixa insumos e recebe acabados em uma única operação. Cancelamento quantitativo segue o DER; limites de divergência e WIP formal permanecem pendentes.

## 4. Base para elaboração

Escopo e requisitos, catálogo de casos de uso e regras de negócio RN01–RN29, incluindo as decisões confirmadas e alinhadas em 15/11/2026. Quando o catálogo oficial de estados e transições não está definido, o desenho é identificado como proposta para validação do grupo. Pendências como PD02, PD03, PD04, PD08 e PD10 devem permanecer explícitas.

Fontes editáveis e visualizações SVG estão no [inventário da pasta](README.md). Elaboração concluída; nomes/estados completos e propostas marcadas no DER não ganham aprovação definitiva pelo desenho.
