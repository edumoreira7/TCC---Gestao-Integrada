# Diagramas de Atividades

## O que representam

Detalham as ações e decisões de um processo, incluindo caminhos alternativos e responsabilidades. Diferentemente do fluxo macro, permitem examinar uma operação específica com suas condições. Paralelismo só deve aparecer quando fizer parte do comportamento definido.

## Por que são importantes no projeto

Ajudam a verificar se os caminhos operacionais estão completos e se os bloqueios respeitam as regras de negócio. Servem de referência para implementar e validar processos que envolvem mais de uma área.

## Exemplo no nosso sistema

Na verificação de uma ordem, o sistema calcula a necessidade total de insumos. Com faltas, a ordem aguarda reposição; após o recebimento, a disponibilidade é reavaliada. O início da produção permanece bloqueado enquanto faltar algum insumo necessário.

## Base para elaboração

Os diagramas ainda serão elaborados a partir do [fluxo macro](../fluxo-macro/README.md) e dos [fluxos dos casos de uso](../../02-requisitos/atores-casos-de-uso-regras-de-negocio.md). Não devem introduzir produção ou expedição parciais, excluídas do escopo inicial.
