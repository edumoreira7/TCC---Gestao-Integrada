# Metodologia e cenários de validação

Versão proposta em 10/11/2026 — issue #10. Planejamento de avaliação para TCC2. Não contém resultados de testes executados nem aprovação do orientador.

## Objetivo e estratégia

Avaliar se a solução integra pedido, receitas, necessidades, compras, recebimento, produção e expedição com consistência dos saldos e rastreabilidade. Realizar estudo aplicado com construção de software e verificação funcional por cenários controlados com dados sintéticos. Comparar os resultados observados com um oráculo calculado a partir das receitas e regras. A avaliação não depende de uma empresa parceira.

Executar testes de domínio, integração com persistência e cenários ponta a ponta. O protótipo pode antecipar avaliação de fluxo e interface, mas não comprova transações, segurança ou concorrência do sistema final. Usar uma base reinicializada por cenário; identificar versão do software e dados. Os testes de integração devem usar o SGBD escolhido na arquitetura definitiva.

## Dados sintéticos e oráculo

Clientes C01 e fornecedor F01 são fictícios e não possuem acesso. Produtos P01 (pão) e P02 (bolo) são exemplos de teste, sem representar formulação industrial validada. Usar kg para todos os insumos e unidade para os acabados, sem conversões neste conjunto.

| Receita | Rendimento | Farinha (I01) | Açúcar (I02) |
|---|---:|---:|---:|
| P01 | 10 unidades | 1 kg | 0,2 kg |
| P02 | 5 unidades | 0,5 kg | 0,5 kg |

Saldo inicial: farinha 2 kg, açúcar 0,5 kg, acabados P01/P02 zero. Últimos preços de compra fornecidos no histórico de teste: farinha R$ 6/kg, açúcar R$ 4/kg. Preços de venda manuais: P01 R$ 2/unidade e P02 R$ 5/unidade.

Pedido de referência: 20 P01 e 10 P02. Necessidade total: 3 kg de farinha e 1,4 kg de açúcar. Faltas: 1 kg e 0,9 kg. Compra de reposição: 2 kg de farinha e 1 kg de açúcar aos mesmos preços. Após recebimento integral: farinha 4 kg e açúcar 1,5 kg. Após conclusão: farinha 1 kg e açúcar 0,1 kg; acabados 20 P01 e 10 P02. Após expedição integral: acabados zero. Valor do pedido: R$ 90. Custo unitário de insumos: P01 R$ 0,68 e P02 R$ 1,00. Custo total dos itens: R$ 23,60; diferença para venda não representa lucro contábil.

## Cenários e resultados esperados

| ID | Procedimento | Resultado esperado | Rastreabilidade |
|---|---|---|---|
| V01 | Registrar pedido de referência com C01 | Uma OP, dois itens, necessidades agregadas e faltas acima; criação permitida | RF12–RF17; RN02–RN05/RN10 |
| V02 | Criar OP manual com os mesmos dois produtos | Uma OP sem pedido e sem expedição própria | RF11; RN09/RN13 |
| V03 | Alterar pedido para 10 P01 e 5 P02 antes de iniciar | Mesma OP; necessidade 1,5 kg e 0,7 kg, sem OP adicional | RF25; RN20 |
| V04 | Tentar iniciar V01 antes de repor | Início bloqueado, sem baixa física ou entrada de acabados | RF27; RN16 |
| V05 | Registrar compra de reposição | Saldo permanece 2 kg e 0,5 kg | RF09; RN15 |
| V06 | Receber compra integral de V05 | Saldo 4 kg e 1,5 kg; faltas reavaliadas | RF10/RF27; RN06/RN16 |
| V07 | Em base isolada, receber 1 kg farinha e 0,4 kg açúcar; depois 1 kg e 0,6 kg | Entradas só do recebido; acumulado 2 kg/1 kg; exceder qualquer item é rejeitado | RF36; RN28 |
| V08 | Iniciar OP após V06 | Reserva sem baixa física; saldos físicos 4 kg/1,5 kg; disponíveis 1 kg/0,1 kg | RF34; RN26 |
| V09 | Tentar alterar pedido depois de V08 | Rejeição e preservação do pedido/OP | RF25; RN20 |
| V10 | Concluir V08 integralmente e repetir comando | Saldos do oráculo; OP concluída, reserva encerrada; repetição não duplica movimentos | RF19/RF20/RF28; RN07/RN08/RN17 |
| V11 | Simular falha entre gravações da conclusão | Nenhuma baixa ou entrada parcial persistida; OP não concluída | RF19/RF20/RF28 |
| V12 | Expedir pedido integral após V10 e repetir | Uma expedição ligada ao pedido e acabados zero; repetição rejeitada | RF21/RF22; RN18/RN19 |
| V13 | Tentar expedir parte dos itens ou sem saldo suficiente | Rejeitar sem saída de estoque | RF21; RN19 |
| V14 | Consultar custo e alterar apenas preço manual de venda | Custo P01 0,68 e P02 1,00; custo não muda pela alteração do preço de venda | RF30/RF31; RN22/RN23 |
| V15 | Disputar início simultâneo com duas OPs que juntas excedem os insumos | No máximo reservas compatíveis com saldo; uma OP bloqueada, sem saldo disponível negativo | RF34; RN26; PD10 técnico |
| V16 | Alterar receita cadastral depois de criada OP | Composição preservada da OP não é sobrescrita | RF35; RN27 |
| V17 | Tentar acessar como cliente/fornecedor; usuário com dois perfis | Sem acesso externo; acumulação preservada; ações específicas conforme matriz aprovada | RF32; RN12/RN24; PD06 |

V15 e V17 só podem ser aceitos na implementação definitiva com mecanismo concorrente e matriz definidos. V16 requer implementação da composição preservada, ausente no protótipo de fichas fixas.

## Critérios e registro dos resultados

Para cada cenário registrar: ID, versão/commit, ambiente, conjunto inicial, executor, data, passos, esperado, observado, evidências (captura, resposta e movimentos), resultado (aprovado/reprovado/bloqueado) e defeito associado. Reexecutar cenários afetados após correção. Não classificar bloqueado como aprovado.

Critérios propostos para revisão: todos os cenários obrigatórios executáveis aprovados; nenhuma divergência nos saldos e custos do oráculo, após arredondamento monetário de apresentação; nenhuma OP ou movimentação duplicada; nenhum efeito parcial persistido nos testes de falha. Quantidades devem ser comparadas em precisão decimal definida, não por igualdade de ponto flutuante. Registrar cobertura como cenários executados/planejados e aprovados/executados, apresentando bloqueados separadamente. Critérios ainda dependentes de PD devem ser resolvidos ou explicitamente excluídos com justificativa antes da avaliação final.

Analisar defeitos por requisito, severidade, causa e correção. Relatar falhas e limitações, sem generalizar a pequenas e médias empresas a partir de um único conjunto sintético. Não há meta de desempenho inventada; carga, tempo de resposta e ambiente serão acordados quando os RNF forem mensuráveis.

## Avaliação complementar de uso

Se houver participantes disponíveis, convidar usuários com experiência em operação alimentícia para executar registro de pedido, identificação de faltas, recebimento e consulta da produção. Registrar conclusão da tarefa, erros, necessidade de ajuda, duração e comentários, com consentimento e dados sem identificação pessoal desnecessária. Quantidade e perfil dos participantes, instrumento e eventual exigência institucional devem ser combinados com orientador. Sem participantes, manter a validação funcional e declarar que usabilidade externa não foi avaliada. Não inventar entrevistas ou resultados.

## Dependências de confirmação

- Orientador: revisar a adequação da estratégia, critérios e eventual participação humana.
- Grupo: confirmar disponibilidade de participantes; ausência não bloqueia a estratégia principal.
- Grupo: resolver PD12, cancelamento/WIP, ausência de preço e estados completos antes dos cenários específicos dessas decisões. Eles não têm resultado esperado presumido neste plano.
- TCC2: executar cenários e analisar resultados. Este documento conclui a elaboração da proposta, não sua execução nem a revisão externa.
