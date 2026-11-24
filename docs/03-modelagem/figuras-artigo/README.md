# Figuras para o artigo — 23/11/2026

Pacote de exportação da modelagem publicada na main em `cda5c5b2baa5eca0936294b630426693ac5fbd4c`. Não representa aprovação do orientador, implementação de backend ou nova decisão de negócio. As fontes canônicas foram preservadas. Os ajustes desta entrega são de organização e exportação para permitir substituir os desenhos do artigo.

## Download e formatos

- [Baixar o pacote completo](Figuras-artigo.zip): PDF vetorial, SVG, PNG e fontes editáveis.
- [Caderno de consulta com nove vistas](Diagramas-para-artigo.pdf): cinco vistas principais do DER, três de casos de uso e arquitetura.
- Para inserir no LaTeX, prefira os PDFs individuais. Eles têm fundo branco, margem de segurança e texto pesquisável. PNGs têm duas vezes a resolução do SVG; SVGs preservam o conteúdo vetorial.
- O caderno usa páginas com tamanho adequado ao desenho, não páginas A4: é material para consulta e extração, não o artigo já diagramado.

## DER completo em cinco vistas

| Vista | PDF | SVG | PNG |
| --- | --- | --- | --- |
| Pedidos, produção e expedição | [PDF](01-der-pedidos-producao-expedicao.pdf) | [SVG](01-der-pedidos-producao-expedicao.svg) | [PNG](01-der-pedidos-producao-expedicao.png) |
| Receitas, compras e recebimento | [PDF](02-der-receitas-compras-recebimento.pdf) | [SVG](02-der-receitas-compras-recebimento.svg) | [PNG](02-der-receitas-compras-recebimento.png) |
| Reservas, cancelamento e movimentos | [PDF](03-der-reservas-cancelamento-movimentos.pdf) | [SVG](03-der-reservas-cancelamento-movimentos.svg) | [PNG](03-der-reservas-cancelamento-movimentos.png) |
| Usuários, perfis e etapas | [PDF](04-der-usuarios-perfis-etapas.pdf) | [SVG](04-der-usuarios-perfis-etapas.svg) | [PNG](04-der-usuarios-perfis-etapas.png) |
| Reposição estatística | [PDF](05-der-reposicao-estatistica.pdf) | [SVG](05-der-reposicao-estatistica.svg) | [PNG](05-der-reposicao-estatistica.png) |

[Visão global consolidada](00-der-completo.pdf) · [SVG global](00-der-completo.svg). O consolidado incorpora a extensão estatística ao DER anterior. As cinco vistas preservam em conjunto todas as 41 relações declaradas nessa base. Entidades repetidas conectam as vistas: não são tabelas adicionais. Algumas vistas canônicas mostram somente atributos de referência de entidades cujo detalhamento está em outra vista.

### Recortes adicionais para evitar letras pequenas no artigo

As vistas 01 e 03 concentram mais entidades. Use os recortes abaixo quando a redução à largura da página prejudicar a leitura. Cada recorte conserva as entidades selecionadas com seus atributos da fonte completa e as relações existentes entre elas. Não usar um recorte isolado como se fosse o DER inteiro.

- [01a — pedidos](01a-der-pedidos.pdf).
- [01b — itens da produção e receita](01b-der-itens-producao.pdf).
- [01c — expedição](01c-der-expedicao.pdf).
- [03a — reservas e cancelamento](03a-der-reservas-cancelamento.pdf).
- [03b — movimentos de insumos](03b-der-movimentos-insumos.pdf).
- [03c — movimentos de produtos](03c-der-movimentos-produtos.pdf).

Cada recorte também possui SVG e PNG com o mesmo nome. As fontes Mermaid ficam em `fontes/`.

## Casos de uso completos, incluindo CU21 e CU22

| Vista | PDF | SVG | PNG |
| --- | --- | --- | --- |
| Pedidos e planejamento, incluindo CU21/CU22 | [PDF](06-casos-pedidos-planejamento.pdf) | [SVG](06-casos-pedidos-planejamento.svg) | [PNG](06-casos-pedidos-planejamento.png) |
| Compras, estoque, produção e expedição | [PDF](07-casos-operacao.pdf) | [SVG](07-casos-operacao.svg) | [PNG](07-casos-operacao.png) |
| Cadastros, acessos e valores operacionais | [PDF](08-casos-cadastros-financeiro.pdf) | [SVG](08-casos-cadastros-financeiro.svg) | [PNG](08-casos-cadastros-financeiro.png) |

As três vistas reúnem os 21 casos ativos: CU01–CU22, exceto CU08, anteriormente incorporado a CU06. Preservam as associações do draw.io oficial e as duas associações da extensão de reposição. CU05 aparece em duas vistas porque Estoque e PCP participam do mesmo caso; não são duas funcionalidades distintas. Não foram inventadas relações include/extend, atores externos ou permissões novas. O usuário autorizado da extensão conserva PCP como referência, com permissões específicas em PD06.

**Atenção à nomenclatura:** o pedido cita UC21/UC22, mas o repositório identifica esses mesmos casos como **CU21/CU22**. Esta entrega conserva CU para manter a rastreabilidade com requisitos e cenários. Não foi executada uma renumeração para UC. Os diagramas também conservam os termos insumo e ficha técnica/receita da base publicada.

## Arquitetura em componentes

[PDF](09-arquitetura-componentes.pdf) · [SVG](09-arquitetura-componentes.svg) · [PNG](09-arquitetura-componentes.png).

O arranjo vertical preserva os componentes e as conexões da fonte canônica: usuário, interface, API, módulos de negócio, persistência e PostgreSQL. O monólito modular é uma proposta para a implementação futura; API, autenticação e banco não são apresentados como já implantados. O desenho não inclui um framework de API que a fonte canônica ainda deixa em aberto.

## Avisos para quem atualiza o texto

- **Ainda existem rendimento e lotes inteiros**: `rendimento`, `quantidade_solicitada` e `lotes_planejados` permanecem no DER. Isso foi preservado deliberadamente, sem excluir campos ou mudar regras para adequar a figura ao texto.
- Permanecem receitas versionadas, uma OP por pedido, recebimento integral único, reservas, cancelamento quantitativo e movimentos de estoque da base publicada.
- A extensão estatística é um modelo lógico planejado. Configuração, histórico, observações e cálculos não representam tabelas já implantadas.
- Alertas, histórico elegível, permissões e decisões técnicas com PD aberta não foram resolvidos por esta exportação. As notas de integridade e limitações estão nos documentos canônicos de [dados](../dados/README.md), [reposição](../dados/reposicao.md), [casos](../casos-de-uso/README.md) e [arquitetura](../../04-arquitetura/README.md).
- Inserir os desenhos em largura suficiente e conferir o PDF final do artigo. Texto pesquisável e alta resolução não tornam uma figura reduzida demais legível. A visão global é para consulta; não é recomendada como miniatura em uma coluna.

## Inserção no LaTeX

Copie os PDFs selecionados para a pasta `figuras/` do projeto e cite cada figura no texto. Para usar a largura das duas colunas:

```latex
\begin{figure*}[t]
\centering
\includegraphics[width=\textwidth]{figuras/02-der-receitas-compras-recebimento.pdf}
\caption{Modelo lógico de receitas, compras e recebimento. Fonte: autores.}
\label{fig:der-receitas-compras}
\end{figure*}
```

As fontes e seus hashes estão em [manifesto.json](manifesto.json). Os scripts `preparar_figuras_artigo.py`, `exportar_figuras_artigo.mjs` e `conferir_figuras_artigo.py`, na pasta superior, permitem repetir a preparação, a exportação e a conferência. Requerem Python com Pillow/pypdf/pypdfium2, Node com Playwright e Mermaid CLI e um navegador Chromium local. Não instalam dependências no projeto nem publicam um serviço.
