# Metodologia e cenários de validação

Elaborada em 10/11/2026 e alinhada em 15/11/2026 — issue #10. Planejamento de avaliação para TCC2. Elaboração concluída. Não contém resultados da avaliação definitiva nem aprovação do orientador. Em 15/11/2026, o solicitante dispensou a revisão do orientador como critério desta issue e autorizou seu encerramento; a revisão não foi realizada.

## Objetivo e estratégia

Avaliar se a solução integra pedido, receitas, necessidades, compras, recebimento, produção e expedição com consistência dos saldos e rastreabilidade. Realizar estudo aplicado com construção de software e verificação funcional por cenários controlados com dados sintéticos. Comparar os resultados observados com um oráculo calculado a partir das receitas e regras. A avaliação não depende de uma empresa parceira.

Executar testes de domínio, integração com persistência e cenários ponta a ponta. O protótipo pode antecipar avaliação de fluxo e interface, mas não comprova transações, segurança ou concorrência do sistema final. Usar uma base reinicializada por cenário; identificar versão do software e dados. Os testes de integração devem usar o SGBD escolhido na arquitetura definitiva.

## Dados sintéticos e oráculo

Clientes C01 e fornecedor F01 são fictícios e não possuem acesso. Produtos P01 (pão) e P02 (bolo) são exemplos de teste, sem representar formulação industrial validada. Usar kg para todos os insumos e unidade para os acabados, sem conversões neste conjunto.

| Receita | Rendimento | Farinha (I01) | Açúcar (I02) |
|---|---:|---:|---:|
| P01 | 10 unidades | 1 kg | 0,2 kg |
| P02 | 5 unidades | 0,5 kg | 0,5 kg |

Saldo inicial: farinha 2 kg, açúcar 0,5 kg, acabados P01/P02 zero. Preços iniciais fornecidos no histórico de teste (sem recebimentos anteriores): farinha R$ 6/kg, açúcar R$ 4/kg. Preços de venda manuais: P01 R$ 2/unidade e P02 R$ 5/unidade.

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
| V07 | Tentar recebimento parcial da compra; depois confirmar integralmente e repetir | Parcial não confirmado; única entrada integral de 2 kg/1 kg; repetição não duplica saldo | RF36; RN28 |
| V08 | Iniciar OP após V06 | Reserva sem baixa física; saldos físicos 4 kg/1,5 kg; disponíveis 1 kg/0,1 kg | RF34; RN26 |
| V09 | Tentar alterar pedido depois de V08 | Rejeição e preservação do pedido/OP | RF25; RN20 |
| V10 | Concluir V08 integralmente e repetir comando | Saldos do oráculo; OP concluída, reserva encerrada; repetição não duplica movimentos | RF19/RF20/RF28; RN07/RN08/RN17 |
| V11 | Simular falha entre gravações da conclusão | Nenhuma baixa ou entrada parcial persistida; OP não concluída | RF19/RF20/RF28 |
| V12 | Expedir pedido integral após V10 e repetir | Uma expedição ligada ao pedido e acabados zero; repetição rejeitada | RF21/RF22; RN18/RN19 |
| V13 | Tentar expedir parte dos itens ou sem saldo suficiente | Rejeitar sem saída de estoque | RF21; RN19 |
| V14 | Consultar custo e alterar apenas preço manual de venda | Custo P01 0,68 e P02 1,00; custo não muda pela alteração do preço de venda | RF30/RF31; RN22/RN23 |
| V15 | Disputar início simultâneo com duas OPs que juntas excedem os insumos | No máximo reservas compatíveis com saldo; uma OP bloqueada, sem saldo disponível negativo | RF34; RN26; PD10 técnico |
| V16 | Publicar rendimento/composição novos com uma OP pendente e outra iniciada | Pendente recalcula pela nova ativa; iniciada conserva versão, lotes e necessidades; publicação não altera composição anterior | RF35; RN27 |
| V17 | Tentar acessar como cliente/fornecedor; usuário com dois perfis | Sem acesso externo; acumulação preservada; ações específicas conforme matriz aprovada | RF32; RN12/RN24; PD06 |

V15 e V17 só podem ser aceitos na implementação definitiva com mecanismo concorrente e matriz definidos. V16 foi antecipado no checkout local do protótipo, mas seu alinhamento funcional ainda não foi integrado à main. Isso não substitui a avaliação da implementação definitiva.


## Cenários adicionais das decisões confirmadas

| ID | Procedimento em base isolada | Resultado esperado |
|---|---|---|
| V18 | Pedir 15 P01, rendimento 10; repetir em OP manual | Dois lotes, 20 planejadas, farinha 2 kg e açúcar 0,4 kg; conclusão entra 20; expedir 15 deixa cinco. Manual sem expedição própria |
| V19 | Registrar compra de farinha a R$ 8/kg e receber; depois receber uma compra mais antiga a R$ 7/kg | Registro não altera referência; recebimento mais recente define referência 8 e depois 7 pela data-hora, não data de compra; preços de venda de pedidos anteriores preservados |
| V20 | Remover preço inicial em base sem recebimentos; consultar custo; simular empate de recebimentos | Custo indisponível sem preço. No empate, maior ID é o critério provisório documentado, sujeito à validação |
| V21 | OP de 15 P01 iniciada: cancelar com consumo farinha 0,5 kg, perda 0,1 kg, açúcar zero; aproveitar cinco P01 | Baixar farinha 0,6 kg uma vez, liberar reserva restante (1,4 kg farinha e 0,4 kg açúcar), receber cinco P01; não liberar expedição de pedido cancelado |
| V22 | Informar apuração acima da reserva, produto de outra OP ou aproveitar acima de 20; repetir cancelamento válido; tentar concluir a cancelada | Rejeitar sem truncar, duplicar movimentos ou aceitar encerramentos incompatíveis. Limites quantitativos são provisórios até aprovação |

Consumo informado exclui perdas; apurar cada reserva, inclusive zero. Os cenários não introduzem produção ou expedição parcial normal. Nenhum teste local comprova concorrência ou autenticação reais.

## Critérios e registro dos resultados

Para cada cenário registrar: ID, versão/commit, ambiente, conjunto inicial, executor, data, passos, esperado, observado, evidências (captura, resposta e movimentos), resultado (aprovado/reprovado/bloqueado) e defeito associado. Reexecutar cenários afetados após correção. Não classificar bloqueado como aprovado.

Critérios propostos para revisão: todos os cenários obrigatórios executáveis aprovados; nenhuma divergência nos saldos e custos do oráculo, após arredondamento monetário de apresentação; nenhuma OP ou movimentação duplicada; nenhum efeito parcial persistido nos testes de falha. Quantidades devem ser comparadas em precisão decimal definida, não por igualdade de ponto flutuante. Registrar cobertura como cenários executados/planejados e aprovados/executados, apresentando bloqueados separadamente. Critérios ainda dependentes de PD devem ser resolvidos ou explicitamente excluídos com justificativa antes da avaliação final.

Analisar defeitos por requisito, severidade, causa e correção. Relatar falhas e limitações, sem generalizar a pequenas e médias empresas a partir de um único conjunto sintético. Não há meta de desempenho inventada; carga, tempo de resposta e ambiente serão acordados quando os RNF forem mensuráveis.

## Avaliação complementar de uso

Se houver participantes disponíveis, convidar usuários com experiência em operação alimentícia para executar registro de pedido, identificação de faltas, recebimento e consulta da produção. Registrar conclusão da tarefa, erros, necessidade de ajuda, duração e comentários, com consentimento e dados sem identificação pessoal desnecessária. Quantidade e perfil dos participantes, instrumento e eventual exigência institucional devem ser combinados com orientador. Sem participantes, manter a validação funcional e declarar que usabilidade externa não foi avaliada. Não inventar entrevistas ou resultados.

## Dependências de confirmação

- Revisão do orientador: dispensada como critério de encerramento da issue #10 por decisão explícita do solicitante em 15/11/2026. Não ocorreu revisão nem aprovação. Eventuais exigências institucionais para pesquisa com pessoas continuam a verificar antes dessa pesquisa.
- Grupo: confirmar disponibilidade de participantes; ausência não bloqueia a estratégia principal.
- Grupo: resolver PD12, limites/desempate provisórios, WIP formal, permissões e catálogo completo de estados antes dos cenários específicos dessas decisões. Não presumir resultados para políticas pendentes.
- TCC2: executar cenários e analisar resultados. Este documento conclui a elaboração da proposta, não sua execução, integração de backend ou aprovação externa.
