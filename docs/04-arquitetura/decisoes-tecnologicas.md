# Decisões tecnológicas

## DT01 — PostgreSQL como sistema gerenciador de banco de dados

**Data:** 01/11/2026
**Status:** aprovado pelo solicitante nesta conversa de definição do modelo de dados.
**Projeto:** Gestão Integrada de Estoque e Produção no Setor Alimentício.

### Decisão

O sistema utilizará **PostgreSQL**, com modelagem relacional, como banco de dados da futura implementação.

O solicitante informou que ele e outro integrante da equipe já trabalharam com PostgreSQL. A familiaridade da equipe foi considerada na escolha.

### Justificativa

- O domínio possui relações entre clientes, pedidos, itens, produtos, receitas, ordens de produção, compras, recebimentos e movimentações de estoque.
- O banco oferece transações e mecanismos de integridade adequados à implementação dessas relações.
- Conclusão da produção envolve registrar consumo de insumos e entrada de produtos de forma conjunta. Cancelamentos e reservas também exigirão tratamento consistente.
- A experiência prévia de dois integrantes reduz o esforço de aprendizado da equipe.

As garantias de estoque dependem do desenho das transações, restrições e tratamento da concorrência na aplicação. A escolha do PostgreSQL, isoladamente, não implementa essas regras.

### Consequências para a modelagem

- O MER será desenvolvido considerando um banco relacional.
- Chaves, relacionamentos, cardinalidades e restrições serão detalhados nas próximas etapas da modelagem.
- A implementação futura deverá tratar de forma consistente a reserva de insumos, sua liberação, a conclusão da produção e as demais movimentações.
- Não foi definido um esquema físico, nem criada uma base PostgreSQL nesta etapa.
- O protótipo frontend permanece com os dados locais já existentes, sem backend real.

### Pontos ainda não definidos

- Versão do PostgreSQL a utilizar.
- Hospedagem e ambientes de desenvolvimento, teste e apresentação.
- Linguagem/framework do backend, biblioteca de acesso ao banco e ferramenta de migrações.
- Estratégia técnica de concorrência, transações e histórico.
- Composição e fontes da base de demonstração, que deverá conter dados adequados aos cenários de estoque e produção. A escolha de dados de exemplo é distinta da escolha do banco e da hospedagem.

Esses pontos não são considerados aprovados por esta decisão.

### Referências

- [Sobre o PostgreSQL](https://www.postgresql.org/about/).
- [Documentação de transações](https://www.postgresql.org/docs/current/tutorial-transactions.html).
- [Decisões do projeto](../01-visao-geral/decisoes-do-projeto.md).
- [Guia da modelagem de dados](../03-modelagem/dados/guia-do-diagrama.md).

## Limite da entrega de 15/11/2026

Frontend é um protótipo local acadêmico e não o produto final. Demonstra lotes inteiros, receitas versionadas, recebimento único e cancelamento quantitativo em memória/localStorage. Nenhum backend, API, autenticação real, hospedagem ou PostgreSQL foi implementado. Testes locais não comprovam segurança ou concorrência multiusuário. DT01 continua válida para a implementação futura.

Estado de publicação: esta revisão é documental. O alinhamento funcional do frontend foi conferido no checkout local e ainda não está integrado à main; ver [auditoria](../planejamento/auditoria-github-2026-11-15.md).
