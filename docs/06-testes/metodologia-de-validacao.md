# Metodologia e cenários de validação

Elaborada em 10/11/2026 e alinhada em 15/11/2026 — issue #10. Planejamento de avaliação para TCC2. Elaboração concluída. Não contém resultados da avaliação definitiva nem aprovação do orientador. Em 15/11/2026, o solicitante dispensou a revisão do orientador como critério desta issue e autorizou seu encerramento; a revisão não foi realizada.

## Objetivo e estratégia

Avaliar se a solução integra pedido, receitas, necessidades, compras, recebimento, produção e expedição com consistência dos saldos e rastreabilidade. Realizar estudo aplicado com construção de software e verificação funcional por cenários controlados com dados sintéticos. Comparar os resultados observados com um oráculo calculado a partir das receitas e regras. A base técnica é reproduzível sem empresa; a avaliação de uso e utilidade segue o [plano específico](avaliacao-de-uso.md), atualizado em 20/11/2026, e não é demonstrada somente por estes cálculos.

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

## Avaliação de uso do produto

O [plano de avaliação de uso](avaliacao-de-uso.md) define U01–U05, observação de tarefas, SUS como possibilidade e alternativa de recrutamento. A tarefa principal escolhida é planejar e acompanhar uma encomenda. Há possível contato com confeitaria, sem participação ou histórico confirmados. Testes técnicos continuam necessários e não substituem evidência de uso.

A ausência de empresa não impede a base sintética de verificação. Se não houver participantes, registrar ausência de avaliação externa e discutir a suficiência das conclusões com o orientador, sem declarar que utilidade ou usabilidade foram comprovadas.

## Dependências de confirmação

- Revisão do orientador: dispensada como critério de encerramento da issue #10 por decisão explícita do solicitante em 15/11/2026. Não ocorreu revisão nem aprovação. Eventuais exigências institucionais para pesquisa com pessoas continuam a verificar antes dessa pesquisa.
- Grupo: confirmar disponibilidade e perfil de participantes e discutir o plano alternativo de uso; ver PD15. Ausência não invalida os cálculos técnicos nem comprova utilidade do produto.
- Grupo: resolver PD12, limites/desempate provisórios, WIP formal, permissões e catálogo completo de estados antes dos cenários específicos dessas decisões. Não presumir resultados para políticas pendentes.
- TCC2: executar cenários e analisar resultados. Este documento conclui a elaboração da proposta, não sua execução, integração de backend ou aprovação externa.

## Cobertura e cenários complementares — 20/11/2026

A [matriz de rastreabilidade](matriz-rastreabilidade.md) cobre RF01–RF43 e RNF01–RNF13. V01–V22 são preservados. Os procedimentos novos abaixo são planejamento; não foram executados nesta entrega documental.

| ID | Procedimento | Resultado esperado |
|---|---|---|
| V23 | Cadastrar, consultar e inativar insumo e produto com vínculos existentes. | Campos válidos preservados, consulta correta e histórico/vínculos conservados; nenhuma exclusão destrutiva implícita. |
| V24 | Cadastrar receita com rendimento e itens válidos; tentar quantidade/unidade inválida; consultar versões. | Composição e rendimento corretos, rejeição de inválidos e preservação das versões publicadas. |
| V25 | Cadastrar e consultar fornecedor e cliente; tentar usar registro incompatível/inativo em nova operação. | Dados e vínculos válidos preservados; política de inativação aplicada conforme cadastro; cliente e fornecedor sem login. |
| V26 | Consultar saldos e histórico antes e depois de recebimento, reserva, conclusão, cancelamento e expedição. | Saldo físico/disponível e origem das movimentações correspondem ao cenário e à regra de sinal/unidade. |
| V27 | Criar OP com faltas, consultar estado/necessidades e repor. | OP permanece acompanhável e aguardando enquanto faltar insumo; reavalia disponibilidade após reposição. |
| V28 | Registrar/consultar valores de compra e venda e alterar preço de cadastro. | Valores operacionais e históricos preservados conforme eventos definidos em PD05; sem apresentar fluxo bancário ou lucro contábil. Bloqueado enquanto eventos não estiverem definidos. |
| V29 | Criar etapas por produto da OP e mover cartões entre situações permitidas. | Quadro corresponde às etapas; movimento de cartão não altera saldo físico nem conclui por si a OP. Pré-condições definitivas em aberto devem ser marcadas no ensaio. |
| E01 | Salvar 90/95/99%, prazo e janela; alterar configuração; tentar prazo não positivo e meta 100%. | Parâmetros válidos versionados; anteriores preservados; entradas inválidas rejeitadas. |
| E02 | Preparar série com zeros, ausências, unidades distintas e fontes selecionadas. | Zero e ausência distintos; cobertura/versão rastreáveis; unidades incompatíveis e histórico insuficiente geram motivo explícito, conforme PD14. |
| E03 | Comparar média, desvio, z, ES e PR com programa/planilha independente. | Erro dentro de RNF06; exemplo fictício 10 kg/dia, desvio 2 kg, prazo 3, z≈1,645 apresenta ES≈5,7 kg e PR≈35,7 kg. Resultado preserva configuração e referência da série. |
| E04 | Usar desvio zero, L=1, curto histórico, sazonalidade/correlação e períodos incompatíveis. | Casos elegíveis coincidem com referência; inelegíveis apresentam limitação ou indisponibilidade. Não prometer frequência nominal sem adequação das hipóteses. |
| E05 | Simular reserva, compra pendente dentro/fora do horizonte, atualização e repetição de alerta. | Regra de posição/horizonte aprovada é respeitada sem dupla contagem e sem compra/movimento automático. Bloqueado até PD13; não inventar oráculo enquanto a política não estiver definida. |

N01–N13 estão especificados nos [RNF](../02-requisitos/requisitos-nao-funcionais.md), incluindo ambiente, critérios e dependências. Registrar simulações estatísticas com parâmetros, sementes e incerteza amostral; não exigir exatamente 95% em amostra finita. O alerta de mínimos sintéticos do protótipo não é evidência de E01–E05.
