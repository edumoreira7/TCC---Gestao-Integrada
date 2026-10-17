# Gestão Integrada de Estoque e Produção no Setor Alimentício

Sistema voltado a pequenas e médias empresas do setor alimentício, integrando Comercial, Planejamento e Controle da Produção (PCP), Compras, Estoque, Produção e Expedição por meio de pedidos e fichas técnicas/receitas.

## Objetivo

Desenvolver um sistema integrado de apoio à gestão de estoque e produção para pequenas e médias empresas do setor alimentício, relacionando receitas, necessidades de insumos, compras, ordens de produção, estoque de produtos acabados e expedição.

## Escopo

O sistema tem como foco a integração dos principais processos relacionados à produção baseada em receitas.

Entre as funcionalidades previstas estão:

- Cadastro de produtos, insumos, receitas, fornecedores e clientes;
- Controle de estoque de insumos;
- Controle de estoque de produtos acabados;
- Registro de compras com preços dos insumos e entrada no estoque somente após o recebimento;
- Cálculo das necessidades de insumos a partir das receitas e identificação de faltas pelo PCP;
- Registro de pedidos com um ou mais produtos pelo Comercial;
- Ordens de produção com vários produtos, criadas manualmente ou vinculadas a um pedido;
- Conclusão integral da produção, com baixa de insumos e entrada de produtos acabados no estoque;
- Expedição integral vinculada ao pedido, com saída dos produtos acabados do estoque;
- Custo dos produtos calculado pela receita e pelo último preço de compra conhecido de cada insumo;
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
- `04-arquitetura` — arquitetura e componentes;
- `05-prototipos` — protótipos de interface;
- `06-testes` — planejamento e resultados dos testes;
- [`07-apresentacoes`](docs/07-apresentacoes/) — materiais das apresentações;
- [`planejamento`](docs/planejamento/) — cronograma e planejamento do projeto.

Algumas dessas pastas serão adicionadas conforme o desenvolvimento do TCC avançar.

Documentos principais:

- [Decisões do projeto](docs/01-visao-geral/decisoes-do-projeto.md);
- [Visão geral funcional](docs/01-visao-geral/diagrama_visao_geral.pdf);
- [Escopo e requisitos](docs/02-requisitos/escopo-e-requisitos.md);
- [Atores, casos de uso e regras de negócio](docs/02-requisitos/atores-casos-de-uso-regras-de-negocio.md);
- [Diagrama de casos de uso](docs/03-modelagem/casos-de-uso/README.md);
- [Fluxo macro e pendências de revisão](docs/03-modelagem/fluxo-macro/README.md).

## Planejamento

O cronograma do projeto está disponível em:

[`docs/planejamento/Cronograma_TCC_Gestao_Integrada.xlsx`](docs/planejamento/Cronograma_TCC_Gestao_Integrada.xlsx)

O planejamento revisado inclui validação do macrofluxo e metodologia de validação no TCC1, com apresentação final prevista para **17/11/2026**. A [revisão do planejamento](docs/planejamento/revisao-tcc1-2026-10-13.md) registra atividades, dependências e critérios de conclusão.

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

**TCC1 — levantamento de requisitos, modelagem e definição da arquitetura.**
