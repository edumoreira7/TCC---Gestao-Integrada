# Inventário dos diagramas

Revisão de **15/11/2026**, com inspeção dos arquivos, histórico, branches, PRs e issues. A cópia local original estava atrás da main remota; guias isolados desse checkout não provam ausência dos modelos no GitHub.

| Modelo | Fonte editável e visualização | Estado da entrega |
|---|---|---|
| Visão geral funcional | [PDF](../01-visao-geral/diagrama_visao_geral.pdf); não foi localizada fonte editável independente no histórico/branches auditados | Modelo existente; limitação de manutenção do PDF registrada, sem inventar fonte |
| Fluxo macro | [draw.io](fluxo-macro/fluxo-macro.drawio), [PNG](fluxo-macro/fluxo-macro.png), [JPG](fluxo-macro/fluxo-macro.jpg), [regras](fluxo-macro/README.md) | Existente e alinhado às confirmações; caminho principal, não todas as exceções |
| Casos de uso | [draw.io](casos-de-uso/casos-de-uso.drawio), [PNG](casos-de-uso/casos-de-uso.png), [catálogo](../02-requisitos/atores-casos-de-uso-regras-de-negocio.md) | Elaborado; PR #14, issues #2/#3 já encerradas |
| Classes de domínio | [três vistas, imagens e fonte draw.io](classes/README.md) | Elaborado no PR #15; alinhamento posterior de recebimento, lotes, versões e preços nesta revisão |
| DER | [quatro vistas, Mermaid editável, SVGs e HTML](dados/README.md), [fonte completa](dados/der-gestao-integrada.mmd) | Modelo lógico elaborado e alinhado; esquema físico e implementação futura |
| Atividades | [quatro fontes Mermaid e quatro SVGs](atividades/README.md) | Elaboradas; recebimento único, lotes inteiros, reserva, conclusão, cancelamento e expedição refletidos |
| Estados | [quatro fontes Mermaid e quatro SVGs](estados/README.md) | Elaborados; nomes e catálogo completo são propostas sujeitas às PD02/PD04/PD08 |
| Sequência | [sete fontes Mermaid, blocos renderizáveis e SVGs](sequencia/README.md) | Cinco fluxos principais e duas interações necessárias para versões/cancelamento; elaboração concluída |
| Arquitetura/componentes | [proposta e responsabilidades](../04-arquitetura/README.md), [Mermaid](../04-arquitetura/componentes.mmd), [SVG](../04-arquitetura/componentes.svg), [DT01](../04-arquitetura/decisoes-tecnologicas.md) | Modelo proposto elaborado; PostgreSQL futuro confirmado; backend e detalhes técnicos não implementados |

Fonte editável não é sinônimo de diagrama homologado. SVGs foram exportados das fontes e conferidos; Mermaid nos READMEs é renderizado pelo GitHub. O [renderizador](render_mermaid.mjs) valida correspondência de fontes separadas e blocos documentais. Imagens de classes e macrofluxo podem ser regeneradas pelo [renderizador draw.io](render_drawio.py).

Para regenerar SVGs, usar Node.js e `@mermaid-js/mermaid-cli` (conferido com 12.2.0), instalado como ferramenta de documentação fora das dependências do frontend: `node docs/03-modelagem/render_mermaid.mjs --cli <caminho/mermaid-cli/src/cli.js>`. Se necessário, passar `--puppeteer <configuração-local.json>` para localizar o navegador. A configuração visual padrão está em [mermaid-config.json](mermaid-config.json); `--only docs/03-modelagem/estados` limita a regeneração a uma pasta após alterações localizadas. Não versionar pacotes temporários ou caminhos particulares do navegador.

PD12, desempate de preços, limites de cancelamento, conversões, estados completos, permissões e financeiro permanecem identificados. As decisões confirmadas não aprovam automaticamente as propostas. Ver [auditoria](../planejamento/auditoria-github-2026-11-15.md), [requisitos](../02-requisitos/escopo-e-requisitos.md) e [decisões](../01-visao-geral/decisoes-do-projeto.md).
