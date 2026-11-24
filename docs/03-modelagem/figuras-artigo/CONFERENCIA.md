# Conferência da exportação — 23/11/2026

- Base: main remota em `cda5c5b2baa5eca0936294b630426693ac5fbd4c`, baixada em cópia isolada. Arquivos de modelagem canônicos preservados.
- Cobertura das cinco vistas principais do DER: 41 relações, igual à união da fonte completa anterior com a extensão estatística. Recortes adicionais derivados dessa mesma fonte, sem novas entidades ou cardinalidades.
- Casos de uso: 21 identificadores ativos, CU01–CU22 exceto CU08. Todas as associações do draw.io e da extensão CU21/CU22 foram preservadas nas três vistas; repetição de CU05 é intencional.
- Arquitetura: a mudança LR para TB altera somente a disposição; rótulos e conexões da fonte canônica foram preservados.
- Dezesseis figuras foram exportadas em SVG, PNG e PDF: cinco vistas principais do DER, uma visão global, seis recortes adicionais, três vistas de casos de uso e uma arquitetura.
- Cada PDF foi reaberto e conferido como página única, com texto pesquisável. Nomes das entidades presentes nas fontes Mermaid foram confrontados com o texto dos PDFs. Os casos de uso dos SVGs foram confrontados com os PDFs.
- Todos os SVGs foram parseados como XML. PDFs foram renderizados novamente com PDFium, e as vistas principais, casos de uso, arquitetura e seis recortes foram inspecionados visualmente. Foi corrigida uma página vazia adicional da exportação inicial.
- O caderno reúne somente as nove vistas principais, sem a visão global densa e sem os recortes opcionais. A escolha do tamanho das figuras dentro do artigo ainda deve ser conferida no PDF final do texto.
- Não houve alteração de regras de negócio, renumeração para UC, supressão de rendimento/lotes, atualização de frontend ou execução alegada dos testes funcionais do sistema.
- Manifesto e hashes permitem identificar as fontes utilizadas. O ZIP é validado antes da publicação.
