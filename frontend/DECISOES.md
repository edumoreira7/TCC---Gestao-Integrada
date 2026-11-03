# Decisões, dúvidas e dualidades do protótipo

Data: **26/10/2026**. Estas escolhas permitem demonstrar o sistema e não aprovam regras de negócio pendentes. A documentação original e os diagramas foram preservados.

Revisão de interface: **27/10/2026** — destaque das próximas ações, legibilidade e kanban por produto/OP (D14).

## Fontes consultadas

- `main`, HEAD `6ca1114`: README, decisões do projeto, catálogo de atores/casos de uso/regras, guia de classes e descrição do macrofluxo.
- Branch local `docs/diagrama-classes-dominio`: README do diagrama, suas quatro vistas, multiplicidades e decisões adicionais.
- Solicitação atual do protótipo, que prevalece sobre divergências de documentação.

A imagem anexada na conversa original não está disponível neste contexto. A revisão de classes foi feita pelo README da branch existente, sem afirmar equivalência com o anexo. Não houve troca de branch nem edição dos diagramas.

## Registro para decisão do grupo

| ID | Tema / dualidade | Implementado agora | Decisão necessária |
|---|---|---|---|
| D01 | Estoque acabado antes da necessidade: documentação local diz confirmado; solicitação atual diz pendente | Uma OP automática com todos os itens e quantidades do pedido; não abate estoque acabado da necessidade | Confirmar política definitiva e reconciliar documentos |
| D02 | Reservas: branch de classes confirma; main deixa pendente | Comprometimento virtual das OPs em andamento, sem baixa física. PCP mostra físico, comprometido e disponível. Início bloqueia concorrência por saldo | Formalizar reserva, estados, prioridades e mecanismo transacional no futuro backend |
| D03 | Cancelamento: classes prevê apuração e movimentos; main deixa tratamento aberto | Exige motivo e situação textual de produtos/insumos. Registra cancelamento, sem movimentação automática, com alerta de reconciliação | Definir consumo efetivo, perdas, produtos aproveitáveis, liberação, autorização e estornos. Não usar saldos pós-cancelamento como apuração real |
| D04 | Recebimento parcial: classes permite; main diz pendente | Recebimento integral e único por compra, com confirmação e bloqueio de repetição | Confirmar recebimentos parciais, divergências, devoluções e entidade própria de recebimento |
| D05 | Último preço / unidades | Preço da compra registrada com data mais recente; em empate, maior ID. Sem atualização por mera ordem de recebimento. Preços iniciais coerentes com a compra registrada. Receita usa unidade do insumo. Ausência de preço gera custo indisponível | Confirmar evento e critério temporal; conversões e tratamento de preço desconhecido |
| D06 | Matriz de acesso pendente | Login mockado, seleção de usuários internos, perfis acumuláveis editáveis. Todos os menus visíveis na demo | Definir permissões reais por ação, concessão, revogação e administrador. Frontend não é controle de segurança |
| D07 | Estados e transições | OP planejada, em produção, concluída, cancelada; reposição/liberação calculadas. Pedido deriva situação da OP e expedição. Edição bloqueada após início; expedição exige OP concluída e estoque integral | Aprovar estados completos, possibilidade de replanejamento após cancelamento e demais transições |
| D08 | Financeiro simplificado / histórico | Valores de pedidos, compras e expedições são visões distintas, não receitas somadas. Custos atuais pela receita; preço de venda manual. Pedido preserva preço registrado | Definir eventos financeiros, estornos e eventual custeio histórico. Diferença preço–insumos não é lucro |
| D09 | Cadastros, lotes e rendimento | CRUD de parceiros com inativação. Produtos/insumos/fichas fixos, com edição de preço de venda. Quantidades de produto em unidades inteiras; receita escala proporcionalmente | Definir CRUD completo, mínimos de lote, fracionamento de receitas, quantidades obrigatórias e validação fiscal dos documentos |
| D10 | Persistência e simultaneidade | Objetos locais + localStorage; sessão em sessionStorage; reset confirmado; exportação JSON | API futura, banco, autenticação, multiusuário, sincronização e recuperação. Por enquanto usar uma aba |
| D11 | Composição preservada na OP | Fichas não são editáveis nesta entrega; necessidade consulta a composição fixa de referência | Classes exige snapshot por OP. Implementar versionamento/preservação quando houver edição de fichas; definir substituição no ajuste do pedido |
| D12 | Campos e datas | Clientes/fornecedores exigem nome/e-mail. Documentos/telefone livres. Pedido usa data atual e previsão a partir de hoje. Expedição registra destinatário, itens e instante da confirmação | Validar campos obrigatórios e limites de datas. CPF/CNPJ sintéticos não passam por validação fiscal |
| D13 | Estoque mínimo e indicadores | Mínimos sintéticos por insumo apenas para alertas. Card de produtos disponíveis conta tipos com saldo positivo e informa total de unidades abaixo | Aprovar política de mínimos e eventual configuração; não confundir alerta de mínimo com falta calculada para uma OP |
| D14 | Acompanhamento de etapas no kanban | Cada OP tem cards por produto em A fazer / Em andamento / Concluído. Exemplos são complementáveis; remover só etapa não iniciada, mantendo uma por produto. Início libera movimentação; conclusão da OP exige todas as etapas. Cards não movimentam estoque | Validar nomes, templates, responsáveis, dependências e eventual histórico de etapas. Não há produção parcial. Dados antigos ganham modelos compatíveis; modelos de OPs historicamente concluídas são exibidos como concluídos, sem histórico individual inventado |

## Regras demonstradas

- Pedido aceita 1..N produtos e gera exatamente uma OP automática. Atualização antes do início altera a mesma OP e recalcula necessidades.
- OP manual aceita vários produtos e não possui pedido nem expedição própria.
- Necessidades somam insumos comuns entre produtos e consideram rendimento.
- Falta de insumos mantém a ordem aguardando reposição. Recebimento reavalia a disponibilidade por cálculo do estado atual.
- Compra não altera estoque; somente o recebimento de insumos o aumenta.
- Início valida saldo disponível considerando produções em andamento, sem baixa física.
- Conclusão integral baixa insumos e recebe todos os produtos no mesmo novo estado; comandos repetidos são bloqueados.
- Produto entra no estoque antes da expedição; expedição é única, integral e ligada ao pedido, com OP concluída.
- Custo considera apenas os insumos, em unidades compatíveis, pelo último preço e rendimento. Preço de venda é manual.
- Cliente e fornecedor não têm acesso; somente usuários internos podem ser selecionados no login de demonstração.

## Fora do escopo

Backend real, API, autenticação real, validade, vencimento, FEFO, etiquetas, portais externos, produção/expedição parcial, sugestão automática de preço, pagamento bancário e contabilidade completa.

## Como avaliar

Use o roteiro no README e a tela **Roteiro e decisões**. Valide cada item D01–D13 com o grupo/professor, registre a decisão no documento oficial e só então expanda as exceções. `npm test` verifica os invariantes críticos, incluindo o fluxo completo, e `npm run build` confere TypeScript e empacotamento.
