# DER — Gestão Integrada de Estoque e Produção

**Revisão:** 15/11/2026 · **Status:** modelo lógico concluído para revisão do orientador.
**Banco escolhido:** PostgreSQL ([DT01](../../04-arquitetura/decisoes-tecnologicas.md)). Nenhum banco foi criado.

As quatro vistas representam um único modelo. A [fonte completa](der-gestao-integrada.mmd) mantém o endereço editável anterior; as fontes por vista e os blocos abaixo têm o mesmo conteúdo. Abra a [visualização local](der.html) para apresentar, ou edite os blocos Mermaid abaixo. PK = chave primária; FK = chave estrangeira; UK = unicidade. As cardinalidades descrevem registros válidos, inclusive onde uma FK, sozinha, não garante a regra.

## 1. Pedidos, produção e expedição

[Fonte editável da vista 1](der-pedidos-producao-expedicao.mmd) · [SVG exportado](der-pedidos-producao-expedicao.svg)

![Vista 1 do DER](der-pedidos-producao-expedicao.svg)

```mermaid
erDiagram
  CLIENTE ||--o{ PEDIDO : realiza
  PEDIDO ||--|{ ITEM_PEDIDO : contem
  PRODUTO ||--o{ ITEM_PEDIDO : vendido
  PEDIDO o|--|| ORDEM_PRODUCAO : gera
  ORDEM_PRODUCAO ||--|{ ITEM_OP : planeja
  PRODUTO ||--o{ ITEM_OP : produzido
  RECEITA_VERSAO ||--o{ ITEM_OP : referencia
  ITEM_PEDIDO o|--|| ITEM_OP : origina
  PEDIDO ||--o| EXPEDICAO : atendido
  EXPEDICAO ||--|{ ITEM_EXPEDICAO : contem
  ITEM_PEDIDO ||--o| ITEM_EXPEDICAO : atende
  CLIENTE {
    bigint id PK
    text nome
    boolean ativo
  }
  PEDIDO {
    bigint id PK
    bigint cliente_id FK
    timestamptz registrado_em
    date entrega_prevista
    text status
  }
  PRODUTO {
    bigint id PK
    text nome
    numeric preco_venda
    boolean ativo
  }
  ITEM_PEDIDO {
    bigint id PK
    bigint pedido_id FK
    bigint produto_id FK
    integer quantidade
    numeric preco_unitario
  }
  ORDEM_PRODUCAO {
    bigint id PK
    bigint pedido_id FK,UK "nulo na OP manual"
    text status
    timestamptz criada_em
    timestamptz iniciada_em
    timestamptz finalizada_em
  }
  ITEM_OP {
    bigint id PK
    bigint op_id FK
    bigint produto_id FK
    bigint item_pedido_id FK,UK "nulo na OP manual"
    bigint receita_versao_id FK
    integer quantidade_solicitada
    integer lotes_planejados
  }
  RECEITA_VERSAO {
    bigint id PK
    bigint produto_id FK
    integer rendimento
  }
  EXPEDICAO {
    bigint id PK
    bigint pedido_id FK,UK
    text destinatario
    timestamptz expedida_em
  }
  ITEM_EXPEDICAO {
    bigint id PK
    bigint expedicao_id FK
    bigint item_pedido_id FK,UK
    integer quantidade
  }
```

O pedido e sua única OP nascem na mesma transação. Cada item de pedido tem exatamente um item na OP correspondente; na OP manual o vínculo fica nulo. Alterações antes do início preservam essa correspondência. Por item, lotes = teto(quantidade solicitada ÷ rendimento); quantidade planejada = lotes × rendimento. Pedido de 15 com rendimento de 10 gera 20 unidades: entram 20 e a expedição integral retira 15. Se o rendimento for 1, não há excedente por arredondamento. A OP manual usa o mesmo cálculo. O modelo não reduz a produção por saldo acabado até a decisão PD12.

A expedição exige OP concluída e saldo disponível suficiente, com todos os itens e as quantidades do pedido. Chaves compostas ou validação transacional devem impedir vínculos entre pedidos diferentes. O preço de venda do item é histórico; alterar o cadastro não muda pedidos anteriores.

## 2. Receitas, compras e recebimento

[Fonte editável da vista 2](der-receitas-compras-recebimento.mmd) · [SVG exportado](der-receitas-compras-recebimento.svg)

![Vista 2 do DER](der-receitas-compras-recebimento.svg)

```mermaid
erDiagram
  PRODUTO ||--o{ RECEITA_VERSAO : versiona
  RECEITA_VERSAO ||--|{ ITEM_RECEITA : contem
  INSUMO ||--o{ ITEM_RECEITA : compoe
  FORNECEDOR ||--o{ COMPRA : fornece
  COMPRA ||--|{ ITEM_COMPRA : contem
  INSUMO ||--o{ ITEM_COMPRA : adquirido
  COMPRA ||--o| RECEBIMENTO : recebido
  PRODUTO {
    bigint id PK
    text nome
  }
  RECEITA_VERSAO {
    bigint id PK
    bigint produto_id FK
    integer versao
    integer rendimento
    boolean ativa
  }
  ITEM_RECEITA {
    bigint receita_versao_id PK,FK
    bigint insumo_id PK,FK
    numeric quantidade_padrao
  }
  INSUMO {
    bigint id PK
    text nome
    text unidade_padrao
    numeric preco_inicial "opcional"
    boolean ativo
  }
  FORNECEDOR {
    bigint id PK
    text nome
    boolean ativo
  }
  COMPRA {
    bigint id PK
    bigint fornecedor_id FK
    timestamptz registrada_em
  }
  ITEM_COMPRA {
    bigint id PK
    bigint compra_id FK
    bigint insumo_id FK
    numeric quantidade_padrao
    numeric preco_unitario_padrao
  }
  RECEBIMENTO {
    bigint id PK
    bigint compra_id FK,UK
    timestamptz recebido_em
  }
```

Uma compra tem zero ou um recebimento, sempre integral. Os itens recebidos são os itens da compra; não há tabela de recebimentos parciais. Confirmar recebimento cria as entradas e congela os itens da compra na mesma transação. Um insumo por compra é uma simplificação proposta no DER, ainda não aprovada. A demonstração preserva compras com vários insumos distintos e impõe provisoriamente no máximo um item por insumo. Isso evita dois preços para o mesmo insumo no mesmo recebimento, sem restringir a compra a um único insumo; a política permanece para validação.

Há no máximo uma receita ativa por produto; um produto liberado para produzir deve ter exatamente uma. Versões publicadas têm composição e rendimento imutáveis; editar cria outra versão. OP não iniciada é recalculada com a nova versão; ao iniciar, congela-se a referência usada. O modelo guarda quantidades e preços na unidade padrão do insumo, aceitando conversões simples entre unidades compatíveis. Mudanças na unidade padrão de insumo com histórico exigem política de migração, ainda a validar.

O preço de referência vem do item da compra recebida mais recentemente, pela data/hora do recebimento; em empate, propõe-se o ID do recebimento. Sem recebimento, usa-se o preço inicial se informado. Sem nenhum preço, o custo é indisponível. Custo unitário = soma dos custos dos insumos de uma receita ÷ rendimento.

## 3. Reservas, cancelamento e movimentações

[Fonte editável da vista 3](der-reservas-cancelamento-movimentos.mmd) · [SVG exportado](der-reservas-cancelamento-movimentos.svg)

![Vista 3 do DER](der-reservas-cancelamento-movimentos.svg)

```mermaid
erDiagram
  ORDEM_PRODUCAO ||--o{ RESERVA_INSUMO : compromete
  INSUMO ||--o{ RESERVA_INSUMO : reservado
  ORDEM_PRODUCAO ||--o| CANCELAMENTO_OP : registra
  CANCELAMENTO_OP ||--o{ APURACAO_INSUMO : apura
  RESERVA_INSUMO ||--o| APURACAO_INSUMO : detalha
  CANCELAMENTO_OP ||--o{ APROVEITAMENTO_PRODUTO : recebe
  ITEM_OP ||--o| APROVEITAMENTO_PRODUTO : aproveitado
  INSUMO ||--o{ MOV_INSUMO : historico
  ITEM_COMPRA o|--o| MOV_INSUMO : entrada
  RESERVA_INSUMO o|--o| MOV_INSUMO : baixa_normal
  APURACAO_INSUMO o|--o| MOV_INSUMO : baixa_cancelamento
  PRODUTO ||--o{ MOV_PRODUTO : historico
  ITEM_OP o|--o| MOV_PRODUTO : entrada_normal
  APROVEITAMENTO_PRODUTO o|--o| MOV_PRODUTO : entrada_cancelamento
  ITEM_EXPEDICAO o|--o| MOV_PRODUTO : saida
  RESERVA_INSUMO {
    bigint id PK
    bigint op_id FK
    bigint insumo_id FK
    numeric quantidade_reservada
    timestamptz reservada_em
    timestamptz encerrada_em
  }
  CANCELAMENTO_OP {
    bigint id PK
    bigint op_id FK,UK
    text motivo
    timestamptz cancelada_em
  }
  APURACAO_INSUMO {
    bigint id PK
    bigint cancelamento_id FK
    bigint reserva_id FK,UK
    numeric consumido
    numeric perdido
  }
  APROVEITAMENTO_PRODUTO {
    bigint id PK
    bigint cancelamento_id FK
    bigint item_op_id FK,UK
    integer aproveitado
  }
  MOV_INSUMO {
    bigint id PK
    bigint insumo_id FK
    bigint item_compra_id FK,UK
    bigint reserva_id FK,UK
    bigint apuracao_id FK,UK
    text tipo
    numeric quantidade
    timestamptz ocorrida_em
  }
  MOV_PRODUTO {
    bigint id PK
    bigint produto_id FK
    bigint item_op_id FK,UK
    bigint aproveitamento_id FK,UK
    bigint item_expedicao_id FK,UK
    text tipo
    integer quantidade
    timestamptz ocorrida_em
  }
```

As entidades de referência sem atributos nesta vista são as mesmas das vistas anteriores. A classe de domínio MovimentacaoEstoque é desdobrada em duas tabelas lógicas para manter FKs de produto e insumo distintas. Cada movimento operacional tem exatamente uma origem correspondente ao tipo, com FKs alternativas nulas; saldo inicial pode ser lançado separadamente como evento identificado, sujeito à política a validar. Quantidades de movimentos são positivas; o tipo determina o sinal.

- **Início:** somar necessidades por insumo, conferir disponível e gravar uma reserva por par OP/insumo. Saldo disponível = saldo físico − reservas abertas. Na implementação futura, verificação e reserva deverão ser atômicas, com concorrência controlada no PostgreSQL. O frontend simula reserva virtual em uma aba.
- **Conclusão:** encerrar reservas, registrar baixas e entradas integrais, atualizar situação da OP, tudo na mesma transação. As origens únicas evitam duplicar movimentos.
- **Cancelamento após início:** apurar cada reserva (inclusive consumo/perda zero), registrar produtos aproveitáveis quando houver, baixar consumo e perdas sem sobreposição e liberar o restante. Apuração e aproveitamento devem pertencer à mesma OP. Como política inicial a validar, consumo + perdas não ultrapassa o reservado, e aproveitamento não excede o planejado; divergências não devem ser truncadas silenciosamente.
- **Recebimento:** entrada por item da compra somente após confirmação do seu recebimento. **Expedição:** saída por item expedido após conferência integral.

O histórico é a referência para saldo físico; eventual saldo materializado será uma escolha de implementação. Proibir movimentos fora da transação da operação de origem e validar não negatividade de saldos conforme a política aprovada.

## 4. Acesso e acompanhamento

[Fonte editável da vista 4](der-acesso-acompanhamento.mmd) · [SVG exportado](der-acesso-acompanhamento.svg)

![Vista 4 do DER](der-acesso-acompanhamento.svg)

```mermaid
erDiagram
  USUARIO ||--o{ USUARIO_PERFIL : recebe
  PERFIL ||--o{ USUARIO_PERFIL : atribuido
  ITEM_OP ||--o{ ETAPA_OP : acompanha
  USUARIO {
    bigint id PK
    text nome
    text email UK
    boolean ativo
  }
  PERFIL {
    bigint id PK
    text nome UK
  }
  USUARIO_PERFIL {
    bigint usuario_id PK,FK
    bigint perfil_id PK,FK
  }
  ITEM_OP {
    bigint id PK
  }
  ETAPA_OP {
    bigint id PK
    bigint item_op_id FK
    text titulo
    integer ordem
    text situacao
  }
```

Usuários internos acumulam perfis. Clientes e fornecedores não têm acesso. Matriz de permissões e autenticação são decisões futuras. EtapaOP é extensão proposta, baseada no protótipo: o kanban acompanha trabalho por item da OP e não gera movimentação de estoque. Validar se todas as etapas devem ser concluídas como pré-condição da OP definitiva. O financeiro permanece provisório: valores de compra, pedido e expedição podem ser consultados nas respectivas entidades; não se presume tabela definitiva de lançamentos, pagamentos ou estornos.

## Validação e alinhamentos

| Ponto | O que mostrar ou confirmar |
|---|---|
| Classes × recebimentos | RF36/RN28 e classes alinhados ao recebimento único integral em 15/11/2026. |
| Receita e lotes | Uma ativa por produto; OP pendente acompanha revisão; iniciada conserva versão. Lotes inteiros também em OP manual; sobra no estoque. |
| Estoque e cancelamento | Reserva no início; conclusão integral; cancelamento apura consumo, perdas e aproveitamento. Confirmar divergências acima do reservado e ajustes de saldo inicial. |
| Preço e unidades | Último preço **recebido**, com preço inicial opcional. Confirmar critério de empate e alteração de unidade com histórico. |
| Pendências de escopo | Estoque acabado no dimensionamento (PD12), estados, permissões, financeiro e obrigatoriedade das etapas do kanban. |
| Protótipo × DER | Esses refinamentos foram conferidos no checkout local; a integração do frontend correspondente à main continua pendente. Esta branch publica somente modelos e documentação. Restrições relacionais, segurança, transações e concorrência dependem do backend futuro; não há banco criado. |
| Base de demonstração | Padaria/confeitaria sintética proposta; confirmar composição e cenários com o orientador. |

**Próxima etapa:** validar o modelo com o orientador, harmonizar a documentação e detalhar restrições e tipos no esquema físico PostgreSQL. Este DER não é um script de implantação.

## Extensão de reposição — 20/11/2026

O [modelo complementar](reposicao.md), com [fonte](reposicao-dados.mmd) e [SVG](reposicao-dados.svg), propõe dados de configuração, série de consumo e resultados para RF37–RF42. As quatro vistas acima continuam a base do fluxo operacional; a extensão distingue proposta estatística e implementação futura.
