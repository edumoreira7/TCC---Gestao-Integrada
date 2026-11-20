# Matriz de rastreabilidade

Revisão: **20/11/2026**. Cobertura documental RF01–RF43 e RNF01–RNF13. Os vínculos indicam cenários planejados, não testes executados ou requisitos aceitos. A numeração anterior é preservada. Os casos de uso de base são CU01–CU20, exceto CU08 descontinuado; CU21/CU22 integram a extensão estatística.

## Fontes e legenda

- [RF01–RF36 e regras](../02-requisitos/escopo-e-requisitos.md); [RF37–RF43/CU21/CU22](../02-requisitos/reposicao-estatistica.md); [RNF01–RNF13](../02-requisitos/requisitos-nao-funcionais.md).
- [V01–V29 e E01–E05](metodologia-de-validacao.md); N01–N13 nos RNF; [U01–U05](avaliacao-de-uso.md).
- D01: [casos de uso](../03-modelagem/casos-de-uso/README.md). D02: [classes](../03-modelagem/classes/README.md). D03: [DER operacional](../03-modelagem/dados/README.md). D04: [componentes](../04-arquitetura/README.md). D05: [sequências](../03-modelagem/sequencia/README.md). D06: [dados estatísticos](../03-modelagem/dados/reposicao.md). D07: [casos de uso da extensão](../03-modelagem/casos-de-uso/reposicao.md).
- Componentes usam os nomes do diagrama: UI (interface), API, AC (acesso), CAD (cadastros/receitas), PED (pedidos), PCP (produção), COM (compras/recebimentos), EST (estoque), EXP (expedição), FIN (custos/valores), REP (reposição), P (persistência). São responsabilidades propostas, sem serviços implantados.

## Cobertura funcional

| Requisito | Caso de uso | Componente responsável | Modelo | Verificação técnica | Tarefa de uso |
|---|---|---|---|---|---|
| RF01 | CU01 | CAD | D01/D02/D03 | V23 | U01 |
| RF02 | CU02 | CAD | D01/D02/D03 | V23 | U01 |
| RF03 | CU02 | CAD | D01/D02/D03 | V24 | U01 |
| RF04 | CU03 | CAD | D01/D03 | V25 | — |
| RF05 | CU04 | CAD | D01/D03 | V25 | — |
| RF06 | CU05 | EST | D03/D04 | V26 | U03 |
| RF07 | CU05 | EST | D03/D04 | V26 | — |
| RF08 | CU05 | EST | D03/D04 | V26 | U03 |
| RF09 | CU11 | COM | D03/D04/D05 | V05 | U03 |
| RF10 | CU12 | COM/EST | D03/D04/D05 | V06 | U03 |
| RF11 | CU09 | PCP | D02/D03/D05 | V02 | — |
| RF12 | CU06 | PED | D01/D03/D05 | V01 | U02 |
| RF13 | CU06 | PED/PCP | D03/D05 | V01 | U02 |
| RF14 | CU06/CU09 | PCP/CAD | D02/D03/D05 | V01/V18 | U02 |
| RF15 | CU10 | PCP/EST | D01/D04 | V01/V27 | U02/U03 |
| RF16 | CU06/CU09 | PCP | D03/D05 | V01/V27 | U02 |
| RF17 | CU10/CU13 | PCP/EST | D04/D05 | V04/V27 | U02/U03 |
| RF18 | CU10/CU13 | PCP | D01/D05 | V27/V29 | U04 |
| RF19 | CU14 | PCP/EST | D03/D05 | V10/V11 | — |
| RF20 | CU14 | PCP/EST | D03/D05 | V10/V11 | — |
| RF21 | CU16 | EXP | D03/D05 | V12/V13 | — |
| RF22 | CU16 | EXP/EST | D03/D05 | V12/V13 | — |
| RF23 | CU19 | FIN | D03/D04 | V28 | — |
| RF24 | CU11/CU19 | COM/FIN | D03/D04 | V05/V28 | — |
| RF25 | CU07 | PED/PCP | D02/D05 | V03/V09 | U02 |
| RF26 | CU10 | PCP | D01/D04 | V27 | U03 |
| RF27 | CU12/CU13 | PCP/EST | D04/D05 | V04/V06 | U03 |
| RF28 | CU14 | PCP | D03/D05 | V10 | — |
| RF29 | CU15 | PCP/EST | D02/D03/D05 | V21/V22 | — |
| RF30 | CU17 | FIN/CAD/COM | D02/D03/D04 | V14/V19/V20 | — |
| RF31 | CU18 | FIN | D01/D04 | V14 | — |
| RF32 | CU20 | AC | D01/D03/D04 | V17/N02 | — |
| RF33 | CU19 | FIN | D03/D04 | V28 | — |
| RF34 | CU13 | PCP/EST | D03/D05 | V08/V15 | — |
| RF35 | CU02 | CAD/PCP | D02/D03/D05 | V16/V24 | U01 |
| RF36 | CU12 | COM/EST | D03/D05 | V07 | U03 |
| RF37 | CU21 | REP/AC | D04/D06/D07 | E01 | U05 |
| RF38 | CU22 | REP/EST | D04/D06/D07 | E02 | — |
| RF39 | CU22 | REP | D04/D06/D07 | E02/E04 | — |
| RF40 | CU22 | REP | D04/D06/D07 | E03/E04 | U05 |
| RF41 | CU22/CU10 | REP/PCP | D04/D06/D07 | E05 | U05 |
| RF42 | CU22 | REP | D04/D06/D07 | E03/N07 | U05 |
| RF43 | CU10/CU13 | PCP | D01/D03/D04 | V29 | U04 |

U01–U05 não cobrem todas as funções administrativas: o estudo de uso prioriza planejar e acompanhar encomenda. Ausência de tarefa U não dispensa o cenário técnico. RF23/RF24/RF33 dependem da política de valores/financeiro PD05; RF32 depende de PD06; E05 depende de PD13; E02/E04 de PD14. Registrar bloqueio explicitamente, sem aceitar uma política ainda indefinida.

## Cobertura não funcional

| Requisito | Componentes/modelos | Cenário | Evidência exigida |
|---|---|---|---|
| RNF01 | API/AC; D04 | N01 | Respostas sem sessão válida e ausência de segredo em saída pública. |
| RNF02 | API/AC; D01/D04 | N02/V17 | Matriz por ação/perfil e tentativas diretas permitidas/negadas. |
| RNF03 | P e módulos transacionais; D03/D05 | N03/V11 | Falha injetada e consulta da base depois de rollback. |
| RNF04 | PCP/EST/P; D03/D05 | N04/V15 | Sincronização de duas sessões, conflitos e saldos após cada rodada. |
| RNF05 | COM/PCP/EXP/P; D03/D05 | N05/V07/V10/V12/V22 | Repetições sequenciais/concorrentes e contagem de efeitos confirmados. |
| RNF06 | PCP/FIN/REP; D02/D06 | N06/E03/E04 | Referências independentes, unidades, precisão e erros absolutos. |
| RNF07 | API/REP/P; D03/D06 | N07/E03 | Vínculo de usuário, instante, origem e versões históricas. |
| RNF08 | UI/API/P; D04 | N08 | Perfil congelado, ambiente, p50/p95 e taxa de falhas por operação. |
| RNF09 | P/PostgreSQL; D03/D04 | N09 | Manifesto de backup/restauração e comparação de contagens/vínculos/totais. |
| RNF10 | UI e componentes de tarefa; D01/D04 | N10/U01/U02/U03/U04/U05 | Registro por tarefa, ajuda, erros, tempos e SUS quando aplicado. |
| RNF11 | UI/API; D04/D05 | N11 | Resposta a falha, estado não confirmado e preservação adequada dos dados. |
| RNF12 | Todos os módulos avaliados | N12/E03 | Commit, base, ferramentas, parâmetros e sementes reproduzíveis. |
| RNF13 | UI; D01/D04 | N13/U01/U02/U03/U04/U05 | Navegadores declarados, navegação por teclado e informação sem depender de cor. |

## Registro de execução

Para cada linha de cenário, preencher: versão, ambiente, referência da base, executor, passos, resultado esperado, observado, evidência, requisito, situação e defeito. Use **planejado**, **aprovado**, **reprovado** ou **bloqueado**, com motivo. Esta entrega tem situação **planejado** para os cenários novos. A cobertura acima é de especificação; a cobertura de execução será calculada quando houver resultados reais.
