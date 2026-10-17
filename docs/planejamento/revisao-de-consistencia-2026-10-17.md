# Revisão de Consistência da Base Consolidada

**Data:** 17/10/2026<br>
**Base auditada:** `main` após o PR #13, commit `cbb8221cd1ff57b1c07cef9e2d4e79499382b91b`.<br>
**Objetivo:** alinhar o repositório e o planejamento antes de concluir as issues #2 e #3.

## Problemas encontrados e encaminhamento

| Situação encontrada | Impacto | Encaminhamento |
|---|---|---|
| Milestone TCC1 com nome `Modelaagem` e prazo em 17/10/2026. | Divergência com a apresentação final de 17/11/2026 registrada no planejamento. | Nome corrigido para `TCC1 - Modelagem e arquitetura`, prazo para 17/11/2026 e descrição com metodologia no TCC1, execução no TCC2. |
| PDF de visão geral descrevia acesso de clientes/fornecedores e entradas/saídas de caixa. | Contradição com acesso interno e financeiro simplificado. | PDF atualizado para a visão funcional consolidada; arquitetura e tecnologias continuam na issue #8. |
| Seção de pedidos ainda dizia que o pedido "poderá" gerar ordem. | Redação ambígua perante a obrigação de gerar OP para todo pedido. | Redação corrigida sem alterar a cardinalidade transitória 0..1 durante o registro. |
| Arquivos ainda indicavam revisão coletiva pendente após a confirmação do solicitante. | Estado documental desatualizado. | Confirmação registrada, mantendo as pendências de detalhamento abertas. |
| Ausência da pasta de casos de uso e de seus arquivos editável/exportado. | Critério objetivo da issue #3 não atendido pelo macrofluxo. | Inclusão de `casos-de-uso.drawio`, `casos-de-uso.png` e documentação de rastreabilidade a RF/RN/CU. |
| Critério da issue #7 não distinguia explicitamente compra de recebimento. | Risco de modelar entrada de estoque no registro da compra. | Separar as duas interações no texto da issue, mantendo-a aberta para elaborar os diagramas. |

## Branches e pull requests

| Branch/PR | Estado observado na revisão | Uso na base atual |
|---|---|---|
| `main` | PR #13 integrado em 17/10/2026. | Base de referência para novos trabalhos. |
| `feature/escopo-e-requisitos` | Commits incorporados pelo PR #13. | Trabalho entregue; não é necessário abrir outro PR com os mesmos commits. |
| `docs/issue-2-modelagem` / PR #11 | PR encerrado sem merge; branch divergente da `main`, com a modelagem anterior. | Superado pelo PR #13; não integrar sua versão antiga sobre a base consolidada. |
| `codex/issue-2-modelagem-revisada` / PR #12 | PR encerrado sem merge; branch divergente da `main`, com revisão intermediária. | Superado pelo PR #13; não usar como base dos novos diagramas. |
| `docs/atualiza-decisoes-fluxo-tcc` | Branch local vinculada a outro checkout, com decisões anteriores. | Não representa o estado atual. Checkout e commits foram preservados. |
| `docs/consolida-issues-2-3` | Criada nesta revisão a partir da `main` consolidada. | Correções de consistência, registro da revisão e entrega do diagrama de casos de uso. |

Os PRs #11 e #12 não estão aguardando merge. Não foi necessário reabri-los ou excluir suas branches para concluir a base consolidada. A branch local `main` estava desatualizada; as referências remotas foram atualizadas e o novo trabalho partiu de `origin/main`.

## Issues e planejamento

| Issue | Conferência |
|---|---|
| #1 - Escopo e requisitos | Já encerrada; referência inicial incorporada no PR #9 e atualizada no PR #13. Checklist histórico não foi reescrito como se tivesse havido nova avaliação completa de RNF. |
| #2 - Atores, casos de uso e regras | Evidências no catálogo e no escopo. Revisão do grupo sobre a base do PR #13 confirmada explicitamente pelo solicitante em 17/10/2026. |
| #3 - Diagrama de casos de uso | Exige diagrama próprio, não apenas o macrofluxo. Evidências entregues em `docs/03-modelagem/casos-de-uso/`. |
| #4 e #5 - Classes e DER | Alinhadas ao planejamento. Deverão partir dos casos de uso e respeitar OP obrigatória por pedido, itens múltiplos, receitas e recebimento separado da compra. |
| #6 - Atividades e estados | Continua aberta para detalhar estados e transições, inclusive PD02/PD08 e exceções relacionadas. Macrofluxo não a encerra automaticamente. |
| #7 - Sequência | Continua aberta. Deve separar registro de compra, recebimento/entrada, criação de OP, conclusão com duas movimentações e expedição vinculada. |
| #8 - Arquitetura e protótipo | Continua aberta. Matriz de acesso, integridade e concorrência devem ser detalhadas sem presumir soluções técnicas aprovadas. |
| #10 - Metodologia e cenários | Corretamente no milestone TCC1. Definição e revisão com orientador no TCC1; execução dos testes e avaliação no TCC2. |

As datas planejadas para #2 (19/10 a 23/10) e #3 (19/10 a 25/10) são janelas de referência, não impedimentos para uma entrega antecipada. Não foram alteradas datas nem percentuais do cronograma para simular uma conclusão; o andamento real fica registrado nas issues e no PR de entrega.

## Pendências preservadas

PD01 a PD08, PD10 e PD11 continuam identificadas no escopo. Em especial, não foram aprovados implicitamente consumo/perdas em cancelamentos, reservas e concorrência, estados completos, matriz de permissões, eventos financeiros, critério temporal dos preços, conversões ou metas mensuráveis de RNF/validação.

PD09 está resolvida: todo pedido gera uma única OP, mesmo com produtos acabados suficientes. A criação de ordens manuais e o estoque de produtos acabados permanecem no escopo.

A apresentação parcial é um registro histórico; sua pasta aponta para a base atual que deverá orientar a apresentação final. Não houve revisão retroativa de todos os slides nem alteração do histórico da apresentação.

## Evidências de verificação

- Conferência do estado real dos PRs #9, #11, #12 e #13, das branches remotas e das issues do TCC1.
- Comparação dos casos CU01 a CU20 com as associações do diagrama e com RF01 a RF33 e RN01 a RN25.
- Conferência de links locais, identificadores únicos e referências às pendências existentes.
- Validação estrutural dos arquivos `.drawio` e revisão visual dos PNGs e do PDF de visão geral.
- Conferência do diff e do conjunto de arquivos do PR, sem incluir os scripts e arquivos temporários usados na preparação.

Este registro descreve as evidências de entrega. O estado de integração e encerramento deve ser confirmado nos próprios PRs e issues do GitHub.
