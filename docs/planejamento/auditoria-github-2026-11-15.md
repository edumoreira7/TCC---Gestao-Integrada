# Auditoria do GitHub e das entregas — 15/11/2026

## Base e limites

Repositório descoberto pela configuração de `origin`: [edumoreira7/TCC---Gestao-Integrada](https://github.com/edumoreira7/TCC---Gestao-Integrada). Base remota auditada: [ea67b80](https://github.com/edumoreira7/TCC---Gestao-Integrada/commit/ea67b809eae1fdf0e7faf730ad858a9af5f0fc9c). Inspecionados arquivos, histórico, seis branches remotas disponíveis, nove issues originais (#1–#8/#10), oito PRs (#9/#11–#16), três milestones e o quadro privado [TCC - GESTÃO INTEGRADA](https://github.com/users/edumoreira7/projects/6).

A cópia local original estava em `41ad30c`, com um commit próprio e 22 commits atrás da referência remota, além de alterações não publicadas do protótipo e documentos. A auditoria foi preparada em worktree e branch próprios, `docs/auditoria-github-2026-11-15`, a partir da main remota. Nenhuma alteração em andamento do checkout original foi descartada, substituída ou publicada implicitamente. Nenhum AGENTS.md aplicável foi localizado nas árvores e ancestrais consultados.

Este PR publica modelos e documentos, não funcionalidades do frontend. Enquanto não integrado, a main continua com a revisão anterior dos modelos; os links relativos deste registro mostram os artefatos corrigidos na branch/PR da auditoria. Não houve merge automático. As fontes de classes/macrofluxo e os alinhamentos documentais já conferidos localmente foram reaproveitados após verificar que suas bases comprometidas eram idênticas às da main remota.

## Resultado por entrega

| Registro | Evidência auditada e correção | Classificação |
|---|---|---|
| [#1](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/1) — escopo | [Requisitos](../02-requisitos/escopo-e-requisitos.md), decisões e PR #9; checklist antigo não refletia a entrega | Elaboração inicial concluída; RNF definitivos e decisões pendentes separados |
| [#2/#3](https://github.com/edumoreira7/TCC---Gestao-Integrada/pull/14) — modelagem funcional/casos de uso | Catálogo, draw.io e PNG já integrados no PR #14 | Concluídas, preservado o histórico de revisão do grupo |
| [#4](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/4) — classes | Três vistas e draw.io do PR #15; recebimento e receita ainda seguiam versão anterior | Elaboração e alinhamento documental concluídos; proposta financeira continua provisória |
| [#5](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/5) — DER | [Quatro vistas, fonte completa, fontes por vista, SVG e HTML](../03-modelagem/dados/README.md) | Modelo lógico elaborado e alinhado; não é esquema físico nem banco implantado |
| [#6](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/6) — atividades/estados | Quatro [atividades](../03-modelagem/atividades/README.md) e quatro [estados](../03-modelagem/estados/README.md), com Mermaid editável e SVG exportado | Elaborados e corrigidos; catálogo completo/nomenclatura de estados permanece proposta |
| [#7](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/7) — sequências | [Cinco fluxos principais e duas interações de versões/cancelamento](../03-modelagem/sequencia/README.md), fontes separadas e SVGs | Elaboração concluída; contratos representam responsabilidades lógicas futuras |
| [#8](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/8) — arquitetura/protótipo inicial | [Componentes e responsabilidades](../04-arquitetura/README.md), [DT01](../04-arquitetura/decisoes-tecnologicas.md), frontend inicial `51e2b61`, [documento do protótipo](../05-prototipos/README.md) | Elaboração inicial concluída; implementação definitiva e integração local são tarefas distintas |
| [#10](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/10) — metodologia | [Estratégia, dados, oráculo, 22 cenários, critérios e registro](../06-testes/metodologia-de-validacao.md) | Elaboração concluída. Solicitante dispensou revisão do orientador como critério em 15/11; revisão não realizada, sem aprovação presumida |

Os encerramentos das issues de elaboração apontam para os artefatos e para o PR desta branch; não certificam integração automática, homologação externa ou implementação de backend. Checklists foram ajustados ao escopo efetivamente entregue, mantendo explícitos os critérios históricos retirados e o trabalho restante.

## Conflitos encontrados e corrigidos

- Atividades, estados, sequência de recebimento, classes e DER remoto ainda admitiam vários recebimentos parciais. Agora representam **zero ou um recebimento integral por compra**, com bloqueio de repetição e todas as entradas na confirmação.
- Modelos não distinguiam suficientemente solicitada, planejada e expedida. Agora explicitam teto(solicitada/rendimento), lotes inteiros também na manual, insumos por lotes, entrada planejada e saída somente do pedido. Exemplo 15/10: produz 20, expede 15, sobra cinco.
- Receita de referência sem versão foi substituída por versões publicadas imutáveis, no máximo uma ativa. OP não iniciada recalcula; iniciada conserva referência e quantidades.
- Referência de preço passou a considerar data/hora do recebimento, com preço inicial opcional e custo indisponível sem preço. Pedido preserva preço histórico.
- Cancelamento agora representa motivo, apuração de cada reserva, consumo/perdas separados, baixa única, liberação restante e aproveitáveis da mesma OP. Divergências são rejeitadas sem truncamento e encerramentos incompatíveis são bloqueados.
- Expedição em atividades/estados/sequência passou a exigir OP concluída, pedido ainda não expedido e saldo suficiente para todos os itens, sem expedição parcial.
- Arquitetura ainda dizia “SGBD a validar”. **PostgreSQL é escolha confirmada para implementação futura**; backend, versão, persistência física, segurança e concorrência não foram implementados.
- PR #16 estava integrado, mas mantinha título genérico e corpo de template; o acompanhamento de 10/11 ainda listava entregas posteriores como ausentes. O PR recebe descrição baseada no diff, e os registros datados apontam para este checkpoint, preservando a fotografia histórica.

## Trabalho que continua aberto

| Issue | Situação e quadro | Milestone |
|---|---|---|
| [#17 — integrar alinhamento local do protótipo](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/17) | Trabalho local existe, registro de 21 testes/build/interface; ainda não integrado à main. Em Andamento; não foi publicado por esta auditoria | TCC1 — Modelagem e arquitetura |
| [#18 — backend e integridade PostgreSQL](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/18) | Futuro, Backlog; tecnologia do backend e garantias técnicas a definir/implementar | TCC2 — Sistema funcional |
| [#19 — executar avaliação definitiva](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/19) | Futuro, Backlog; sem resultados ou aprovação externa inventados | TCC2 — Avaliação e entrega |
| [#20 — fonte editável da visão geral](https://github.com/edumoreira7/TCC---Gestao-Integrada/issues/20) | PDF existe; fonte original independente não localizada. Solicitante confirmou que não a possui e pediu registrar manutenção. Backlog | Sem prazo/milestone presumidos |

A apresentação de **17/11/2026 é da disciplina**. A data da banca continua não confirmada. Datas dos milestones e da planilha foram preservadas; não se atribuíram responsáveis, novos prazos, percentuais ou aprovação do orientador.

## Correção da automação do quadro

A regra existente **Auto-close issue** estava configurada para fechar issues quando o status fosse **Em Andamento**. Ela encerrou indevidamente a #17 ao organizar o quadro. Após confirmação explícita do solicitante, o gatilho foi alterado para **Concluído**, salvo e relido; a #17 foi reaberta com justificativa. Também foram corrigidos os destinos de **Item closed** e **Pull request merged**, que apontavam indevidamente para Em Andamento: agora apontam para Concluído. A correção preserva trabalho em andamento e mantém encerramentos e integrações no destino correspondente. Não foram ampliadas permissões; as demais automações foram preservadas.

## Decisões que não foram transformadas em aprovação

PD12 (abater estoque acabado do dimensionamento), desempate por maior ID de recebimento, limites quantitativos do cancelamento, conversões/mudança de unidade com histórico, estados completos, permissões e autorizações, eventos financeiros/estornos, obrigatoriedade/modelos de etapas e validação da base sintética permanecem explícitos. Uma OP automática por pedido continua obrigatória independentemente de PD12.

No cancelamento, consumo + perdas até reservado e aproveitamento até planejado são **limites provisórios do DER**. A escolha conservadora evita baixas além da reserva e entradas além do plano enquanto a política de divergências aguarda aprovação. Um único item por insumo em cada compra é provisório para evitar preços ambíguos; a proposta de um único insumo por compra não foi aprovada e não foi imposta à demo.

## Conferências e alcance

- Fontes Mermaid renderizadas pelo CLI oficial em SVG; 21 fontes, incluindo DER completo e quatro vistas, sete sequências, quatro atividades, quatro estados e componentes. Doze blocos nos READMEs conferidos contra as fontes separadas.
- Fontes draw.io de classes/macrofluxo e respectivas imagens reaproveitadas e inspecionadas. Referências e IDs XML verificados.
- Links locais, rastreabilidade documental e diferenças da branch conferidos. Nenhum arquivo de frontend ou planilha de cronograma alterado nesta branch.
- Issues encerradas relidas com evidências; vínculos com milestones e estados do quadro conferidos sem declarar trabalho futuro como entregue. A divergência do contador agregado está registrada abaixo.
- O conector GitHub permitiu leitura, mas recusou gravações (403 da integração). As atualizações autorizadas usaram as credenciais Git existentes. O token não possuía acesso à API de Projects; o quadro foi consultado e organizado pelo navegador já autenticado, sem ampliar permissões.

Testes locais do protótipo não comprovam concorrência, segurança, autenticação, recuperação ou transações multiusuário. A metodologia de avaliação definitiva permanece para execução no TCC II. Elaborar um documento ou integrar um PR não aprova automaticamente todas as suas propostas.

## Registros aplicados e conferência final

A revisão está publicada no [PR #21](https://github.com/edumoreira7/TCC---Gestao-Integrada/pull/21), aberto e sem integração automática. As issues #5, #6, #7, #8 e #10 foram encerradas com evidências; #1 e #4 tiveram seus registros históricos corrigidos. O título e a descrição do PR #16 foram atualizados conforme o conteúdo efetivamente integrado. A main permaneceu em `ea67b80` na conferência final.

No quadro, foram confirmados nove itens em Concluído, a #17 aberta em Em Andamento, o PR #21 aberto em Em Revisão e #18/#19/#20 abertas no Backlog. A revisão do orientador foi dispensada como critério da #10 por decisão do solicitante; ela não foi realizada nem registrada como aprovação.

**Limitação observada no GitHub:** o contador agregado do milestone TCC1 ainda informa sete itens abertos e quatro fechados. A consulta dos registros vinculados ao mesmo milestone retorna dois abertos (#17 e PR #21) e nove fechados (#1–#8 e #10), com estados individuais confirmados. A causa da divergência não foi determinada; não se alteraram vínculos ou estados apenas para forçar esse contador. Portanto, o percentual agregado exibido pelo GitHub não deve ser usado como medida de conclusão nesta conferência.
