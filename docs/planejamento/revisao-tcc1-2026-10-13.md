# Revisão do Planejamento do TCC1

**Data da revisão:** 13/10/2026<br>
**Apresentação final do TCC1:** 17/11/2026<br>
**Status:** Planejamento de referência, sujeito à validação do grupo.

Esta revisão incorpora o resumo da discussão e o macrofluxo fornecidos pelo grupo. As datas estão refletidas no [cronograma e Gantt semanal](Cronograma_TCC_Gestao_Integrada.xlsx). O planejamento do TCC2 permanece conforme a versão anterior.

## Atividades do TCC1

| Período de 2026 | Atividade |
|---|---|
| 13/10 a 16/10 | Finalizar e validar o fluxograma macro com o grupo. |
| 13/10 a 18/10 | Atualizar escopo, requisitos e regras de negócio. |
| 19/10 a 23/10 | Finalizar atores, casos de uso e responsabilidades. |
| 19/10 a 25/10 | Elaborar diagrama de casos de uso e descrições principais. |
| 22/10 a 28/10 | Elaborar diagrama de classes de domínio. |
| 26/10 a 31/10 | Elaborar DER e modelagem do banco. |
| 29/10 a 04/11 | Elaborar diagramas de atividades e estados. |
| 02/11 a 07/11 | Elaborar diagramas de sequência. |
| 02/11 a 08/11 | Definir arquitetura e diagrama de componentes. |
| 03/11 a 10/11 | Desenvolver/refinar protótipo das telas principais. |
| 04/11 a 10/11 | Definir metodologia e cenários de validação. |
| 09/11 a 13/11 | Revisar documentação e consistência entre diagramas. |
| 11/11 a 16/11 | Preparar apresentação, metodologia e pré-banca. |
| 17/11 | Apresentação final do TCC1. |

Os períodos podem se sobrepor, mas as datas não dispensam a resolução das dependências abaixo. Responsáveis e progresso devem ser informados pelo grupo, sem presumir atividades concluídas.

## Dependências e critérios de conclusão

1. Incorporar a regra confirmada nesta revisão: todo pedido gera uma ordem de produção, mesmo com estoque acabado suficiente (antiga PD09 resolvida).
2. Revisar o fluxo macro, incluindo recebimento, reavaliação de insumos, conclusão integral e expedição vinculada.
3. Revisar decisões, requisitos, atores, casos de uso e regras em conjunto.
4. Revisar a contribuição associada à Issue #2; somente após aprovação coletiva considerar seu fechamento/merge.
5. Elaborar casos de uso e consolidar classes e DER após aprovação do macrofluxo; depois verificar atividades, estados e sequência contra os mesmos requisitos.

Esta revisão local não altera, encerra ou aprova issues e pull requests no GitHub.

## Metodologia de validação no TCC1

A definição da metodologia permanece no TCC1; a execução dos testes e avaliação ocorre no TCC2. A estratégia principal utiliza dados sintéticos e cenários derivados de RF/RN, com entrada, operações, resultado esperado e resultado obtido. Participação de empresa ou usuários reais é complementar e depende de autorização.

Cenários a detalhar com o orientador:

- Pedido com vários produtos e insumo comum às receitas: somar a necessidade total sem duplicação.
- Ordem manual: permitir produção sem pedido de origem.
- Pedido com estoque acabado suficiente: ainda exigir a criação da ordem de produção.
- Insumos insuficientes: manter a ordem aguardando reposição e impedir início.
- Compra registrada sem recebimento: manter o estoque inalterado.
- Recebimento de insumos: aumentar saldo e reavaliar disponibilidade da ordem.
- Conclusão integral: registrar baixa de insumos e entrada dos produtos acabados.
- Expedição integral: exigir pedido e registrar saída do estoque de produtos acabados.
- Alteração de pedido antes/depois do início: permitir antes, refletir na ordem e bloquear depois.
- Custo: aplicar último preço de compra às quantidades e unidades da receita, considerando rendimento.
- Acesso: verificar usuário com múltiplos perfis e ausência de acesso de clientes/fornecedores.

Cancelamento durante produção e concorrência entre ordens exigem suas regras aprovadas antes de definir resultados esperados. Metas mensuráveis e metodologia definitiva continuam pendentes de discussão com o orientador.
