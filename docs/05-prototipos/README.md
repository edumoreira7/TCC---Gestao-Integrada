# Protótipo inicial

O [frontend](../../frontend/README.md) publicado na main é um protótipo acadêmico local React/TypeScript/Vite, com dados sintéticos e kanban por produto/etapa. Não representa o produto final; não tem backend, API, autenticação real, hospedagem ou PostgreSQL em execução.

## Entrega e trabalho local

A entrega inicial de interface, registrada no commit [51e2b61](https://github.com/edumoreira7/TCC---Gestao-Integrada/commit/51e2b61), cobre pedidos multiproduto, OP automática/manual, PCP, compras, recebimento integral, estoques, produção, expedição, custos e usuários demonstrativos. Elaboração do protótipo inicial atende ao escopo documental da issue #8.

O checkout local foi alinhado a lotes inteiros, preço por recebimento, receitas versionadas e cancelamento quantitativo, com registro local de 21 testes, build e conferência da interface. Essas alterações funcionais ainda não estão integradas à main e não são publicadas por esta branch de auditoria. Consultar o [acompanhamento atual](../planejamento/auditoria-github-2026-11-15.md) e a issue específica de integração antes de afirmar que a versão remota demonstra todos esses comportamentos.

Cadastro completo, permissões reais, concorrência e persistência transacional pertencem à implementação futura. Testes locais não comprovam essas garantias. Kanban acompanha trabalho e não movimenta estoque; a conclusão normal é integral. Recebimentos parciais não são evolução aprovada: a decisão vigente é único e integral.

Usar a [metodologia](../06-testes/metodologia-de-validacao.md) para distinguir avaliação antecipada de interface, integração pendente e avaliação definitiva no TCC2.
