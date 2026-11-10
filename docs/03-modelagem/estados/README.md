# Diagramas de Estados — Gestão Integrada

**Revisão:** 03/11/2026  
**Status:** documentação-base para revisão do grupo.

## 1. Objetivo

Representar ciclos de vida dos objetos operacionais e distinguir comportamentos documentados de propostas de estados e transições que ainda dependem de validação do grupo.

## 2. Arquivos

| Arquivo | Objeto | Situação |
|---|---|---|
| `estado-ordem-producao.mmd` | Ordem de Produção | Proposta baseada nas regras de criação, reposição, reserva, produção, conclusão e cancelamento; catálogo completo ainda precisa de validação (PD08). |
| `estado-pedido.mmd` | Pedido | Proposta; catálogo de estados, alterações e cancelamentos ainda depende de validação (PD02). |
| `estado-compra-recebimento.mmd` | Compra e recebimento | Proposta que representa recebimentos parciais conforme RN28; nomenclatura e transições detalhadas devem ser validadas. |
| `estado-expedicao.mmd` | Expedição | Proposta; estados, dados obrigatórios e transições adicionais ainda dependem de validação (PD04). |

## 3. Convenções

Os arquivos usam `stateDiagram-v2` do Mermaid. `[*]` representa estado inicial/final; setas representam transições e seus rótulos indicam eventos ou condições. Estados e transições propostos não devem ser tratados como decisões aprovadas apenas por aparecerem no desenho.

## 4. Comportamentos documentados para a OP

- Pode ter origem em pedido ou ser criada manualmente (RN09).
- Todo pedido gera uma única OP automaticamente no registro (RN10).
- Pode ser criada mesmo com insuficiência de insumos, mas aguarda reposição e não pode iniciar antes da disponibilidade necessária (RN04–RN05).
- No início da produção, os insumos necessários são reservados conjuntamente; a reserva não representa baixa física (RN26).
- Na conclusão integral e atômica, o consumo é registrado uma única vez, a reserva é encerrada sem dupla baixa e os produtos acabados entram no estoque (RN07–RN08 e RN26).
- Cancelamento, WIP, perdas e insumos usados dependem de detalhamento do grupo; os diagramas não completam essas regras.

## 5. Comportamentos documentados para compra e recebimento

- Registrar uma compra não altera o estoque; a entrada ocorre no recebimento efetivo (RN06 e RN15).
- Uma compra pode admitir vários recebimentos; cada recebimento movimenta apenas a quantidade efetivamente recebida e a soma recebida não pode exceder a quantidade comprada (RN28).
- Após o recebimento, a disponibilidade dos insumos necessários às OPs é reavaliada (RN16 e RN28).
- Os estados `RecebimentoParcial` e `RecebimentoConcluido` são uma proposta de representação da RN28, sujeita à validação do grupo.

## 6. Pendências

- Catálogo completo de estados e transições da OP (PD08).
- Estados, alterações e cancelamentos de pedidos (PD02).
- Dados obrigatórios e transições adicionais da expedição (PD04).
- Autorizações e tratamento de falhas no cancelamento (PD03).
- Integridade técnica das reservas em inícios concorrentes (PD10).

Os diagramas de estados são propostas de modelagem e não criam requisitos adicionais de aprovação, entrega, devolução ou movimentação não documentados.
