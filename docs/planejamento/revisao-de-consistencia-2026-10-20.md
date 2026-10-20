# Revisão de consistência — 20/10/2026

- Casos de uso de cadastro renomeados de Manter para Gerenciar (cadastrar, consultar, editar e inativar quando aplicável, preservando histórico).
- CU08 incorporado a CU06: registrar pedido gera automaticamente uma única OP com todos os itens, inclusive quando há estoque acabado suficiente. IDs restantes preservados.
- CU09 preservado para criação manual pelo PCP. Consultar custo permanece um objetivo do Financeiro; cálculo, verificações e movimentações são comportamentos internos.
- Fluxograma e casos de uso conferidos: compra não movimenta estoque; recebimento dá entrada e reavalia faltas; início exige insumos; conclusão integral baixa insumos e recebe acabados; expedição integral exige pedido e gera saída.
- Editáveis e imagens atualizados juntos; requisitos, decisões e guia de classes alinhados à geração automática.
- Cronograma TCC1 replanejado a partir de 20/10, com apresentação em 17/11/2026. TCC2, responsáveis e progresso preservados.
- Pendências de cancelamento, reserva/concorrência, estados, permissões, eventos financeiros e preços/unidades continuam abertas.

A revisão de 17/10 permanece como registro histórico. Esta atualização não altera o estado de issues ou PRs no GitHub.

## Progresso conforme entregas na main

Por orientação do solicitante, as entregas presentes na main foram consideradas concluídas: fluxo macro; escopo, requisitos e regras; atores e casos de uso; diagrama de casos de uso. As quatro atividades correspondentes receberam status Concluído e 100% no cronograma. Guias sem o respectivo diagrama não foram contados como entrega. As demais atividades e o TCC2 permaneceram inalterados.

