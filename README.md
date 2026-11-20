# Gestão Integrada de Estoque e Produção no Setor Alimentício

Sistema voltado a pequenas e médias empresas do setor alimentício, integrando Comercial, Planejamento e Controle da Produção (PCP), Compras, Estoque, Produção e Expedição por meio de pedidos e fichas técnicas/receitas.

## Objetivo

Desenvolver e avaliar um sistema integrado de estoque e produção baseado em receitas, para apoiar a otimização dos processos operacionais e a melhoria do nível de serviço em pequenas e médias empresas do setor alimentício.

## Escopo

O sistema tem como foco a integração dos principais processos relacionados à produção baseada em receitas.

Entre as funcionalidades previstas estão:

- Cadastro de produtos, insumos, receitas, fornecedores e clientes;
- Controle de estoque de insumos;
- Controle de estoque de produtos acabados;
- Registro de compras com preços dos insumos e entrada no estoque somente após o recebimento;
- Cálculo das necessidades de insumos a partir das receitas e identificação de faltas pelo PCP;
- Registro de pedidos com um ou mais produtos pelo Comercial;
- Ordens de produção com vários produtos, criadas manualmente ou geradas automaticamente no registro de um pedido;
- Conclusão integral da produção, com baixa de insumos e entrada de produtos acabados no estoque;
- Expedição integral vinculada ao pedido, com saída dos produtos acabados do estoque;
- Custo dos produtos calculado pela receita e pelo preço da compra recebida mais recentemente de cada insumo, pela data-hora do recebimento, com preço inicial opcional;
- Preço de venda cadastrado manualmente e acompanhamento simplificado dos valores das operações.

Clientes e fornecedores são cadastros do sistema e não possuem acesso. Usuários internos poderão acumular perfis e permissões. O financeiro não inclui contas a pagar, contas a receber ou contabilidade completa.

Todo pedido deverá gerar uma única ordem de produção, mesmo quando houver produtos acabados suficientes em estoque. O fluxo não prevê atendimento direto do pedido sem uma ordem de produção.

O projeto possui escopo delimitado e não tem como objetivo desenvolver um ERP de abrangência geral.

## Documentação

A documentação do projeto está organizada na pasta [`docs/`](docs/).

### Estrutura

- [`01-visao-geral`](docs/01-visao-geral/) — visão geral e decisões do projeto;
- [`02-requisitos`](docs/02-requisitos/) — escopo, requisitos e regras de negócio;
- [`03-modelagem`](docs/03-modelagem/) — diagramas e modelos do sistema;
- [`04-arquitetura`](docs/04-arquitetura/) — arquitetura e componentes;
- [`05-prototipos`](docs/05-prototipos/) — protótipos de interface;
- [`06-testes`](docs/06-testes/) — metodologia de validação; resultados definitivos futuros;
- [`07-apresentacoes`](docs/07-apresentacoes/) — materiais das apresentações;
- [`planejamento`](docs/planejamento/) — cronograma e planejamento do projeto.

As pastas acima estão disponíveis. Elaboração de modelos não equivale a implementação ou aprovação externa.

Documentos principais:

- [Decisões do projeto](docs/01-visao-geral/decisoes-do-projeto.md);
- [Visão geral funcional](docs/01-visao-geral/diagrama_visao_geral.pdf);
- [Escopo e requisitos](docs/02-requisitos/escopo-e-requisitos.md);
- [Atores, casos de uso e regras de negócio](docs/02-requisitos/atores-casos-de-uso-regras-de-negocio.md);
- [Diagrama de casos de uso](docs/03-modelagem/casos-de-uso/README.md);
- [Fluxo macro e pendências de revisão](docs/03-modelagem/fluxo-macro/README.md).
- [Sequências dos fluxos principais](docs/03-modelagem/sequencia/README.md);
- [Arquitetura e componentes](docs/04-arquitetura/README.md);
- [Protótipo inicial](docs/05-prototipos/README.md);
- [Metodologia e cenários de validação](docs/06-testes/metodologia-de-validacao.md).

## Planejamento

O cronograma do projeto está disponível em:

[`docs/planejamento/Cronograma_TCC_Gestao_Integrada.xlsx`](docs/planejamento/Cronograma_TCC_Gestao_Integrada.xlsx)

O planejamento revisado inclui validação do macrofluxo e metodologia de validação no TCC1, com apresentação da disciplina prevista para **17/11/2026**. A data da banca não foi confirmada. A [revisão do planejamento](docs/planejamento/revisao-tcc1-2026-10-13.md) registra atividades, dependências e critérios de conclusão.

A [revisão de consistência de 17/10/2026](docs/planejamento/revisao-de-consistencia-2026-10-17.md) registra o alinhamento entre branches, issues, documentos e planejamento.

## Etapas do projeto

### TCC1

- Levantamento e especificação de requisitos;
- Definição das regras de negócio;
- Modelagem do sistema;
- Modelagem de dados;
- Definição da arquitetura;
- Desenvolvimento dos protótipos;
- Definição da metodologia de avaliação.

### TCC2

- Implementação;
- Integração dos módulos;
- Testes;
- Avaliação;
- Análise dos resultados;
- Preparação da entrega final.

## Equipe

- Eduardo Gonçalves Moreira
- Gabriel dos Santos Silva
- David Gabriel de Souza Batista

**Orientador:** Prof. Luciano Rossi

**Instituição:** Centro Universitário FEI

## Situação do projeto

**TCC1 — requisitos, modelos e proposta de arquitetura elaborados; frontend local demonstrativo.**

Consulte a [auditoria de 15/11/2026](docs/planejamento/auditoria-github-2026-11-15.md) para entregas, PR de alinhamento, integração pendente do protótipo e trabalho futuro de TCC II. PostgreSQL é a escolha futura; backend/API/autenticação real não foram implementados.

A [revisão de 20/10/2026](docs/planejamento/revisao-de-consistencia-2026-10-20.md) registra a OP automática, a revisão dos casos de uso e o replanejamento do TCC1.

## Modelagem e avaliação — atualização de 20/11/2026

A base de produto e seus limites permanecem. Os complementos incluem [RF37–RF43](docs/02-requisitos/reposicao-estatistica.md), [RNF01–RNF13](docs/02-requisitos/requisitos-nao-funcionais.md), [matriz de rastreabilidade](docs/06-testes/matriz-rastreabilidade.md), [extensão de dados de reposição](docs/03-modelagem/dados/reposicao.md), [avaliação de uso](docs/06-testes/avaliacao-de-uso.md) e [mapa da apresentação](docs/07-apresentacoes/mapa-da-modelagem.md). A arquitetura incorpora o componente estatístico previsto. São especificações e planos; não implementam backend, ES/PR ou validação com empresa.
