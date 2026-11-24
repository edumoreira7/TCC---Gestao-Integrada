# DER para o corpo do artigo — 24/11/2026

Este conjunto substitui a seleção extensa anterior por **uma visão geral do núcleo e quatro recortes essenciais**. Ele foi preparado para explicar pedido, produção, receita e estoque sem reduzir o modelo inteiro com todos os atributos a letras pequenas. Não altera as fontes canônicas nem as regras de negócio.

**Importante:** a figura geral é uma visão do núcleo operacional, não uma declaração de que o sistema possui somente essas entidades. Mostra 13 entidades e as 18 relações existentes entre elas; omite atributos e os subsistemas de compras/recebimento, expedição, cancelamento, acessos e reposição estatística. O modelo completo continua em [dados](../dados/README.md) e no [pacote completo anterior](../figuras-artigo/README.md), com 29 entidades e 41 relações incluindo a extensão estatística. A fonte completa também foi incluída em `fontes/referencia-modelo-completo.mmd` para conferência.

## Arquivos recomendados

| Ordem | Figura | Pergunta que esclarece |
| --- | --- | --- |
| Geral | [Visão geral do núcleo](00-der-geral-entidades.pdf) | Como pedido, produção, receita e estoque se conectam? |
| 1 | [Pedido e produção](01-pedido-e-producao.pdf) | Como itens do pedido se vinculam à única OP e aos seus itens? |
| 2 | [Produto, receita e matéria-prima](02-produto-receita-e-materia-prima.pdf) | Onde ficam versão, rendimento, componentes e quantidades? |
| 3 | [Reserva e consumo](03-reserva-e-consumo-de-materia-prima.pdf) | Como a OP compromete ingredientes e se relaciona com sua baixa? |
| 4 | [Produção, etapas e acabados](04-producao-etapas-e-produtos-acabados.pdf) | Como se relacionam itens produzidos, acompanhamento e entrada dos produtos? |

- [Caderno A4 para leitura e revisão](DER-geral-e-recortes-essenciais.pdf).
- [Baixar o conjunto completo](DER-artigo-essencial.zip), com PDF individual, SVG, PNG e fontes.
- Prefira os PDFs individuais na inserção no LaTeX. O caderno A4 inclui títulos e notas para estudo; não é necessário inserir cada página inteira no artigo.

## O que foi simplificado

A visão geral conserva as cardinalidades originais, com nomes por extenso. O mapeamento desses nomes para os identificadores técnicos está em `manifesto.json`. Os quatro recortes mostram somente os atributos necessários à explicação e preservam os atributos selecionados, as chaves e as relações da fonte original. Não representam tabelas novas nem mudança na cardinalidade. Campos omitidos continuam no modelo lógico completo.

O recorte 03 mostra a reserva e a baixa normal. Compras/recebimentos e cancelamentos também podem originar movimentos, conforme o modelo completo; essas origens não foram excluídas do sistema por estarem fora da figura. O recorte 04 também não substitui o modelo de expedição ou de aproveitamento no cancelamento. O saldo é tratado a partir dos movimentos; não foi criada uma entidade fictícia “Estoque”.

Rendimento, lotes inteiros e identificadores internos como `INSUMO`, `ITEM_OP` e `RECEITA_VERSAO` foram preservados. “Matéria-prima” nos títulos corresponde ao cadastro `INSUMO`; não houve renomeação do banco ou do código. Os cartões de etapas continuam distintos dos eventos físicos de estoque.

## Sugestão de inserção

Use a visão geral na abertura da seção de modelagem e apresente cada recorte junto da regra que ele explica. Em artigo com duas colunas, priorize `figure*` e `width=\textwidth`, verificando a legibilidade no PDF final. Não descreva a primeira imagem como “DER completo”; use **“Visão geral do núcleo de pedidos, produção, receitas e estoques”**.

```latex
\begin{figure*}[t]
\centering
\includegraphics[width=\textwidth]{figuras/00-der-geral-entidades.pdf}
\caption{Visão geral do núcleo de pedidos, produção, receitas e estoques. Fonte: autores.}
\label{fig:der-geral-nucleo}
\end{figure*}
```

O conjunto foi derivado da main em `b39d9a36b28f191c4de299986039a8f9a9dd8167`. Os hashes das fontes e o escopo de cada exportação constam no manifesto. Não há alegação de implementação ou de validação funcional do sistema nesta entrega de figuras.
