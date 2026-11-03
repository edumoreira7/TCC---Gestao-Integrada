# Guia dos Diagramas de Atividades

## 1. O que representa

Representa o fluxo de execução de um processo, mostrando ações, decisões, alternativas, responsabilidades e a sequência das atividades.

## 2. Por que é importante no projeto

Permite visualizar como Comercial, PCP, Compras, Estoque, Produção e Expedição se relacionam nos processos da Gestão Integrada, além de evidenciar em que momentos ocorrem reservas e movimentações de estoque.

## 3. Exemplo no nosso sistema

Ao registrar um pedido, o sistema gera uma única OP, consulta o estoque disponível de produtos acabados considerando reservas ativas, reserva a quantidade disponível e calcula a parcela que ainda precisa ser produzida. Antes do início da produção, os insumos necessários são reservados conjuntamente; o consumo físico é registrado na conclusão.

## 4. Base para elaboração

Escopo e requisitos, catálogo de casos de uso, regras de negócio RN01–RN29, decisões complementares registradas em 20/10/2026 e PD12 confirmada em 02/11/2026. Situações ainda não definidas são identificadas como pendências, sem serem tratadas como requisitos aprovados.
