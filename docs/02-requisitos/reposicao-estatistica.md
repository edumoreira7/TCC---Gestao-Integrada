# Reposição estatística e acompanhamento visual

Revisão: **20/11/2026**. Complemento funcional do [escopo](escopo-e-requisitos.md), baseado nas decisões do grupo sobre ES/PR. Funcionalidades previstas para o TCC II; não são implementação encontrada no frontend. Os IDs RF01–RF36 e CU01–CU20 são preservados.

## Requisitos complementares

| ID | Requisito | Caso de uso e avaliação |
|---|---|---|
| RF37 | Permitir ao responsável autorizado configurar por insumo nível de serviço por ciclo, prazo fixo, período-base e janela do histórico, preservando versões das configurações. | CU21; E01; RNF02/RNF07. |
| RF38 | Preparar uma série de consumo por insumo com origem, unidade, período e cobertura explícitos, distinguindo zero observado de dado ausente. | Passo interno de CU22; E02. |
| RF39 | Calcular média e desvio do consumo e informar insuficiência de dados ou incompatibilidade com as condições de uso. | Passo interno de CU22; E02/E04. |
| RF40 | Calcular e apresentar ES e PR com fórmula, parâmetros, unidade, data e referência da base utilizada. | CU22; E03/E04. |
| RF41 | Apresentar alertas de reposição como apoio à decisão, considerando compras pendentes e reservas conforme política explicitada, sem criar compra, reserva ou movimento automaticamente. | CU22/CU10; E05. Regra definitiva pendente em PD13. |
| RF42 | Consultar resultados anteriores do cálculo com configuração e versão do histórico usados, sem substituir a meta de serviço por alegação de desempenho realizado. | CU22; E03/N07. |
| RF43 | Acompanhar etapas por produto da OP em quadro visual, mantendo a atualização da etapa separada do encerramento da OP e dos eventos físicos de estoque. | Detalhamento de CU10/CU13 e RF18; V29/U04. |

## Casos de uso complementares

**CU21 — Configurar política por insumo.** Ator: usuário interno autorizado, com PCP como referência funcional; autorização definitiva em PD06. Seleciona insumo, informa parâmetros e consulta condições de uso. O sistema valida unidade temporal, prazo positivo e nível de serviço no intervalo aberto entre 0 e 1, registra uma nova configuração e preserva a anterior. As opções de interface 90%, 95% e 99% podem receber rótulos de proteção, mantendo o percentual e a explicação visíveis. Não há opção universalmente recomendada.

**CU22 — Consultar reposição e resultados.** Ator: PCP; demais consultas conforme PD06. O sistema prepara o histórico elegível, verifica parâmetros e condições, calcula os valores, registra a origem e apresenta resultado ou motivo de indisponibilidade. Mostra separadamente a necessidade de uma OP conhecida e a sinalização estatística. Na ausência de política de posição/horizonte aprovada, o resultado ES/PR pode ser consultado, mas a decisão definitiva do alerta permanece indisponível, com justificativa.

Não há novo ator “sistema”. Preparo e cálculo são passos internos, não casos de uso artificiais. Os dois novos casos integram a extensão do [modelo de dados](../03-modelagem/dados/reposicao.md) e o componente de reposição na [arquitetura](../04-arquitetura/README.md). O diagrama geral CU01–CU20 é a base anterior; esta extensão deve ser apresentada junto dele para cobrir o escopo novo.

## Formulação e contratos

`ES = z × σd × √L` e `PR = média por período × L + ES`.

`z` é o quantil unilateral da normal padrão do nível de serviço escolhido. `σd` é o desvio dos totais consumidos por período-base e `L` conta períodos-base do prazo. ES/PR usam a unidade do insumo. A versão inicial considera prazo fixo, consumos independentes, média/variância suficientemente estáveis e aproximação normal adequada do consumo acumulado. Escolher e registrar o estimador amostral ou populacional antes dos testes. Não misturar desvio mensal com prazo em dias.

O nível de serviço é meta de probabilidade de um ciclo sem falta sob as hipóteses e a política adotadas; não é percentual de pedidos atendidos. Impacto da falta, substituição, armazenagem e conservação orientam a escolha. O módulo dimensiona uma política de reposição baseada em histórico, sem IA nem previsão explícita de demanda.

Exemplo **fictício** de farinha: média 10 kg/dia, desvio dos totais diários 2 kg, L=3 dias e nível de 95% com z≈1,645. ES≈5,7 kg e PR≈35,7 kg. Não são resultados medidos do produto. PR não determina quantidade de compra nem estoque-alvo.

## Pendências delimitadas

| ID | Definição necessária |
|---|---|
| PD13 | Posição comparada ao PR, compras pendentes elegíveis e horizonte, reservas e sobreposição entre necessidade conhecida e consumo médio. Momento de atualizar e encerrar alertas, igualdade com PR e repetição de eventos. |
| PD14 | Origem do consumo, agregação temporal, cancelamentos/perdas, janela, mínimo de observações, dias ausentes, amostragem e comportamento para séries irregulares. Baixa concentrada na conclusão da OP pode distorcer consumo diário. |
| PD15 | Estratégia definitiva de avaliação de uso, contribuição do produto, possível participação da confeitaria e alternativa se não houver acesso. |

A fórmula isolada não resolve PD13. Recebimento previsto não é estoque físico, e a mesma reserva não deve ser descontada duas vezes. O histórico deve indicar cobertura; movimentos sintéticos incompletos do protótipo não constituem série operacional real. Validade/FEFO e IA não foram incluídos por este complemento.

Referência técnica da formulação, níveis de serviço e distinção de fill rate: [King, APICS, 2011](https://web.mit.edu/2.810/www/files/readings/King_SafetyStock.pdf). Ver também os [RNF](requisitos-nao-funcionais.md) e a [matriz de testes](../06-testes/matriz-rastreabilidade.md).
