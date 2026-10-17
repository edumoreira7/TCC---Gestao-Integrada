# Diagramas de Estados

## O que representam

Mostram o ciclo de vida de um registro: suas situações possíveis, os eventos que provocam mudanças e as condições para cada transição. Enquanto atividades descrevem ações de um processo, estados descrevem a situação de uma entidade ao longo do tempo.

## Por que são importantes no projeto

Ajudam a impedir operações fora de hora, como iniciar produção sem insumos ou alterar um pedido depois do início da produção. Também tornam mais claros os bloqueios e as condições de conclusão.

## Exemplo no nosso sistema

Uma ordem com faltas deve aguardar reposição e só pode iniciar com todos os insumos disponíveis. Na conclusão integral, devem ser registradas a baixa dos insumos e a entrada dos produtos acabados.

## Base para elaboração

Os diagramas ainda serão elaborados. A lista completa de estados de pedidos, ordens e expedições, assim como as regras de cancelamento, depende das pendências no [escopo](../../02-requisitos/escopo-e-requisitos.md). Os exemplos acima não definem uma máquina de estados completa nem novos nomes oficiais.
