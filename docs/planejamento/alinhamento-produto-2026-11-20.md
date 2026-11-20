# Alinhamento da modelagem e avaliação do produto

Revisão: **20/11/2026**. Desenvolvimento documental solicitado pelo grupo a partir do feedback da apresentação. O trabalho foi preparado sobre a main remota `64bfdf4`, em cópia isolada, preservando as alterações da cópia local original.

## Base efetivamente encontrada

A main remota já continha DER completo, atividades, estados, sequências e arquitetura em componentes. A indicação anterior de ausência desses modelos se referia a uma cópia local desatualizada; não descrevia o GitHub. A arquitetura existente foi aproveitada e estendida para a reposição estatística. Não se declara nova criação de todos os modelos nem implementação de backend.

## Decisões de direção do grupo

- Foco em produto e avaliação de uso, tendo como tarefa central planejar e acompanhar uma encomenda.
- Reposição estatística como função complementar. Sem escolha de IA ou comparação de políticas como eixo principal.
- Possível contato com uma confeitaria; participação, modo de operação, usuários e histórico ainda não definidos.
- Abertura da apresentação com fluxo simples de pedido, planejamento de ingredientes, disponibilidade, produção e entrega, incluindo reposição quando necessário. Detalhes de recebimento, reserva e transação permanecem nos modelos técnicos.

## Entregas desta revisão

1. [RF37–RF43 e CU21/CU22](../02-requisitos/reposicao-estatistica.md), com fórmula, condições, dados, limites e pendências PD13–PD15.
2. [RNF01–RNF13](../02-requisitos/requisitos-nao-funcionais.md), com cenários e critérios de aceitação para o TCC II.
3. [Matriz RF/RNF](../06-testes/matriz-rastreabilidade.md), cobrindo todos os requisitos declarados com modelos, componentes e avaliação.
4. Extensões visuais de [dados](../03-modelagem/dados/reposicao.md) e [casos de uso](../03-modelagem/casos-de-uso/reposicao.md), com fontes Mermaid e SVGs.
5. Arquitetura com componente de reposição e contratos para integridade e concorrência.
6. [Avaliação de uso](../06-testes/avaliacao-de-uso.md), preservando verificação técnica e distinguindo utilidade de correção de fórmulas.
7. [Mapa dos modelos e fluxo resumido](../07-apresentacoes/mapa-da-modelagem.md) para orientar a próxima edição da apresentação.

## Situação e limites

São modelos, especificações e planos. Não há novos resultados de software, testes multiusuário, SUS, pesquisa de campo ou ganhos operacionais medidos. Alguns critérios de ensaio são propostas iniciais para congelamento após piloto; não equivalem a SLA ou aprovação do orientador. A política definitiva do alerta, o histórico elegível e o acesso à confeitaria continuam pendentes. O PowerPoint ainda será ajustado a partir desta base; não foi substituído por esta entrega documental.

## Conferência da entrega documental

- Cobertura: RF01–RF43 e RNF01–RNF13 possuem linha própria na matriz; referências de cenários conferidas.
- Links relativos dos documentos alterados conferidos contra arquivos existentes; SVGs parseados como XML.
- Fontes Mermaid renderizadas sem erro e correspondência entre blocos documentais/fontes validada pelo renderizador existente.
- Quatro imagens conferidas visualmente: arquitetura, extensão de dados, extensão CU21/CU22 e fluxo resumido. Corrigida preservação de espaços entre palavras em consumidores SVG; o renderizador mantém essa propriedade na regeneração.
- Exemplo independente: z≈1,645, desvio 2 e L=3 produzem ES≈5,7 e PR≈35,7. É conferência do exemplo fictício, não teste da funcionalidade implementada.
- JavaScript do renderizador passou na verificação de sintaxe e git diff --check não indicou erros.
- Não houve alteração de código do frontend nem execução alegada dos cenários futuros de backend, desempenho, autenticação ou uso.
