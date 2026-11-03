# Diagramas de Atividades — Gestão Integrada

**Revisão:** 03/11/2026  
**Status:** documentação-base para revisão do grupo.

## 1. Objetivo

Documentar os fluxos operacionais principais, destacando sequência de atividades, decisões, responsabilidades e movimentações de estoque.

## 2. Arquivos

| Arquivo | Processo | Referências principais |
|---|---|---|
| `atividade-pedido-producao.mmd` | Pedido, geração da OP, reserva de produtos acabados e cálculo da produção restante | RF12–RF20; RN02–RN05, RN09–RN10; PD12 |
| `atividade-compras-recebimento.mmd` | Registro de compra e recebimentos de insumos, inclusive parciais | RF09–RF10, RF27; RN06, RN14–RN16, RN28 |
| `atividade-conclusao-producao.mmd` | Verificação de insumos, reserva, início e conclusão da produção | RF17–RF20, RF27–RF29; RN04–RN08, RN16, RN21, RN26, RN29; PD10 |
| `atividade-expedicao.mmd` | Registro da expedição integral e saída de produtos acabados | RF21–RF22; RN11, RN18–RN19 |

## 3. Convenções

Os arquivos usam `flowchart` do Mermaid para representar atividades, decisões e caminhos alternativos. As responsabilidades são simplificadas e não definem, por si só, a matriz de permissões dos perfis.

## 4. Regras refletidas

- Todo pedido gera exatamente uma OP, inclusive quando a quantidade a produzir for zero.
- A OP originada de pedido reúne seus produtos; não é criada uma OP por item.
- Conforme a PD12, o sistema considera o estoque disponível e as reservas ativas de produtos acabados, reserva a quantidade disponível e dimensiona a produção para a parcela restante.
- A reserva de produtos acabados não representa saída física; o saldo disponível considera as reservas ativas.
- Registrar uma compra não gera entrada no estoque; cada recebimento efetivo gera entrada apenas da quantidade recebida.
- Uma compra pode admitir vários recebimentos. A soma recebida não pode ultrapassar a quantidade comprada (RN28).
- Após cada recebimento, a disponibilidade dos insumos necessários às OPs é reavaliada (RN16 e RN28).
- Insuficiência de insumos não impede criar a OP, mas impede iniciar a produção.
- No início da produção, os insumos necessários são reservados conjuntamente. A reserva reduz o saldo disponível, mas não realiza baixa física (RN26).
- O consumo dos insumos é baixado na conclusão da OP, encerrando a reserva sem dupla baixa; os produtos acabados entram no estoque (RN07, RN08 e RN26).
- O cancelamento durante a produção exige apuração de consumo, perdas e produtos aproveitáveis, com liberação da reserva não utilizada (RN21 e RN29).
- A expedição é integral, vinculada a um pedido e gera saída correspondente do estoque de produtos acabados.

## 5. Pendências e limites

- A integridade técnica para inícios concorrentes e o mecanismo de reserva dependem da definição arquitetural (PD10).
- Autorizações e tratamento de falhas no cancelamento permanecem em PD03.
- A PD12 foi confirmada quanto à consulta e reserva de produtos acabados; detalhes técnicos de concorrência e liberação/consumo das reservas devem seguir as decisões registradas.
- As raias e responsabilidades devem ser validadas com o grupo.
- Os diagramas de atividades simplificam o fluxo e não definem todos os estados internos ou exceções.

Os diagramas não acrescentam aprovação automática de compras, envio de pedidos a fornecedores, transporte, rastreamento ou confirmação de entrega.
