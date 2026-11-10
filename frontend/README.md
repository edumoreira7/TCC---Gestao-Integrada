# Integra — protótipo de estoque e produção

Frontend navegável do TCC **Gestão Integrada de Estoque e Produção no Setor Alimentício**, feito em React + TypeScript + Vite. Todos os registros são sintéticos e locais. Não há backend, API ou autenticação real.

## Executar no Windows

Requer Node.js 22.18+ (recomendado: Node 24) e npm.

```powershell
cd C:\Users\morei\Documents\GitHub\TCC---Gestao-Integrada\frontend
npm ci
npm run dev -- --port 5173
```

Abra http://127.0.0.1:5173. Escolha um dos três usuários internos e use a senha **123456**, já preenchida. Se a porta estiver ocupada, o Vite informa a próxima disponível.

```powershell
npm test
npm run build
npm run preview -- --port 4173
```

O build gera `dist/`. Tanto a prévia quanto o servidor de desenvolvimento precisam continuar abertos durante a demonstração. `Ctrl+C` encerra o servidor. A aplicação não depende de fontes, imagens ou APIs externas em execução.

## Fluxo para apresentar ao professor (8–12 minutos)

1. Entre e mostre os cinco indicadores do dashboard. Abra **Roteiro e decisões** se precisar consultar o roteiro na apresentação.
2. Em **Pedidos**, registre um novo pedido para Café da Vila: **40 pães artesanais + 20 brownies**. O total é R$ 670,00. O pedido gera exatamente uma OP contendo os dois produtos.
3. Antes de iniciar, experimente editar o pedido e mostrar que a mesma OP é atualizada. Mantenha as quantidades do roteiro para continuar.
4. Em **Planejamento · PCP**, mostre a falta de **6,5 kg de farinha**, calculada pelas receitas e seus rendimentos.
5. Em **Compras**, consulte a CMP-001: 20 kg de farinha e 1 kg de fermento. Ela já está registrada no cenário inicial, mas não recebida. Também é possível cadastrar outra compra. O registro não muda o estoque.
6. Em **Recebimentos**, confira e confirme a CMP-001. A farinha passa de 2 kg para 22 kg; a disponibilidade das ordens é reavaliada.
7. Em **Quadro de produção**, selecione a OP do novo pedido e inicie. Acompanhe os cards por produto nas colunas **A fazer → Em andamento → Concluído**, arrastando ou usando o seletor do card. Finalize todas as etapas dos dois produtos e use **Concluir OP inteira**. No início e ao mover cards o saldo físico não muda. Na conclusão, a farinha passa para 13,5 kg, com entrada de 40 pães e 20 brownies.
8. Confira o histórico em **Insumos** e **Produtos acabados**. Só então vá a **Expedição** e registre a saída integral vinculada ao pedido.
9. Em **Custos e preços**, mostre o custo calculado e edite manualmente o preço de venda. Pedidos anteriores preservam os valores registrados.
10. Mostre os cadastros de clientes/fornecedores e os perfis acumuláveis. A OP manual abastece estoque sem gerar uma expedição própria.

Use **Reiniciar demonstração**, no rodapé, antes de repetir o roteiro. A restauração exige confirmação. **Exportar dados** salva um JSON do cenário atual para consulta; não há importação nesta versão.

## Cobertura

- Login demonstrativo e dashboard.
- Clientes e fornecedores: listar, buscar, cadastrar, editar, inativar/reativar.
- Pedidos com vários produtos e OP automática; edição somente antes do início.
- OP manual com vários produtos, detalhes e necessidades de insumos.
- PCP com saldo físico, comprometimento, disponível, faltas e reavaliação.
- Compras e recebimentos integrais sem duplicidade de entrada.
- Insumos e produtos acabados com histórico das movimentações.
- Fichas técnicas com composição, unidade e rendimento.
- Produção: iniciar, registrar acompanhamento, concluir e cancelar com motivo/situações.
- Expedição integral, vinculada ao pedido, com conferência e bloqueios.
- Custos e preços manuais, valores operacionais e preços históricos dos pedidos.
- Usuários internos e edição de perfis acumuláveis.
- Busca por tela, filtros aplicáveis, validações, avisos, persistência e restauração.

## Organização

| Arquivo | Responsabilidade |
|---|---|
| `src/types.ts` | Tipos do domínio |
| `src/data.ts` | Cenário sintético centralizado |
| `src/domain.ts` | Cálculos, validações e operações imutáveis |
| `src/ui.tsx` | Tabelas, campos, cards, badges, painéis, botões e modais |
| `src/Sidebar.tsx` | Navegação lateral reutilizável |
| `src/Dashboard.tsx` | Prioridade da operação, indicadores e próximos passos |
| `src/ProductionBoard.tsx` | Kanban de etapas por produto e OP |
| `src/workflow.ts` | Modelos de etapas e cálculo do progresso |
| `src/workspace.css` | Hierarquia visual, dashboard e kanban |
| `src/Forms.tsx` | Formulários e conferências das operações |
| `src/App.tsx` | Navegação, sessão demonstrativa e telas |
| `src/style.css` | Identidade visual e adaptação de tamanhos |
| `tests/domain.test.ts` | Testes das regras e do fluxo integrado |

Os dados ficam em `localStorage` (`integra-tcc-demo-v1`); a sessão fica em `sessionStorage`. O domínio recebe um estado e retorna um novo estado, para facilitar a futura integração com API. Não use dados pessoais reais. Várias abas ou usuários não compartilham uma transação consistente; a demonstração deve acontecer em uma aba.

## Limites e decisões

Leia [DECISOES.md](DECISOES.md). A tela **Roteiro e decisões** também lista as dúvidas e dualidades para validação. Cancelamento não contabiliza perdas/aproveitamento automaticamente. Produtos, insumos e fichas técnicas são cadastros de referência fixos nesta entrega. Login e menus não implementam segurança ou permissões reais.

Não há validade, FEFO, etiquetas, portais externos, produção parcial, expedição parcial, contas a pagar/receber nem contabilidade completa.

## Revisão visual e kanban — 27/10/2026

O dashboard passa a destacar uma prioridade: falta de insumos, produção em andamento, expedição ou início de nova OP, nessa ordem. Os números principais permanecem visíveis; pedidos recentes e estoque ficam na seção expansível de consulta. Tamanho dos textos e contraste foram aumentados nas telas operacionais.

No **Quadro de produção**, escolha uma OP e acompanhe os produtos e suas quantidades. Cada card representa uma etapa de um produto, por exemplo **preparar massa**, **assar bolo** e **resfriar e finalizar**. Os exemplos são demonstrativos; use **Adicionar etapa** para incluir algo como **fazer recheio**, quando aplicável ao produto. Etapas ainda não iniciadas podem ser removidas, mantendo ao menos uma por produto.

- Inicie a OP para movimentar cards. OP sem insumos continua bloqueada.
- Use arrastar e soltar ou o seletor de situação, que também funciona pelo teclado e no celular.
- Filtre por produto sem perder o progresso global da ordem.
- Finalizar cards não significa concluir quantidade parcial nem movimentar estoque.
- **Concluir OP inteira** só fica disponível com todas as etapas de todos os produtos concluídas.
- OPs concluídas ou canceladas mantêm o quadro somente para consulta.
- Os dados anteriores permanecem compatíveis. Etapas de OPs antigas são apresentadas por modelos; OPs historicamente concluídas mostram esses modelos como concluídos, sem inventar registros individuais de execução ou horários.

Há **15 testes** de domínio cobrindo o fluxo e as novas regras de etapas. A decisão D14 em `DECISOES.md` registra a proposta de acompanhamento para revisão do grupo.

## Paleta e contraste — 01/11/2026

Fundo cinza claro, superfícies brancas, textos em grafite e menu azul-marinho. Ações principais usam índigo. No kanban, **A fazer** usa âmbar, **Em andamento** usa azul e **Concluído** usa verde; contornos, ícones e nomes das colunas também indicam a situação. Alertas usam âmbar e erros/cancelamentos usam vermelho. Os indicadores do dashboard possuem acentos distintos e as etiquetas de produto usam roxo, rosa ou ciano. Os tokens e estilos de cor ficam em `src/palette.css`.
