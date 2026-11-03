import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, BookOpen, Boxes, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, ClipboardList, Download, Factory, FileText, LayoutDashboard, Leaf, LogOut, Menu, Package, PackageCheck, Pencil, Play, Plus, RotateCcw, Search, Settings2, ShoppingBag, ShoppingCart, SlidersHorizontal, Truck, Users, UsersRound, Wallet, Warehouse, X, AlertCircle, Clock3 } from 'lucide-react';
import { freshData } from './data.ts';
import { availableMaterial, execute, orderStatus, productionStatus, productCost, requirements, today, total, type Command } from './domain.ts';
import { OperationForm, type FormKind } from './Forms.tsx';
import { Sidebar } from './Sidebar.tsx';
import { Dashboard } from './Dashboard.tsx';
import { ProductionBoard } from './ProductionBoard.tsx';
import type { Database, Production } from './types.ts';
import { Badge, Button, date, Field, Modal, money, Notice, number, Panel, Stat, Table } from './ui.tsx';

const STORAGE_KEY = 'integra-tcc-demo-v1';
const SESSION_KEY = 'integra-tcc-session';
const pageInfo: Record<string, [string, string]> = {
  dashboard: ['O que precisa da sua atenção?', 'Veja a prioridade da operação e escolha a próxima ação.'],
  orders: ['Pedidos', 'Do registro à expedição: acompanhe cada compromisso com seus clientes.'],
  productions: ['Ordens de produção', 'Todos os produtos de um pedido, reunidos em uma única ordem.'],
  pcp: ['Planejamento da produção', 'Necessidades calculadas pelas fichas técnicas, com o estoque sempre à vista.'],
  production: ['Quadro de produção', 'Cada produto, cada etapa. Veja o que falta fazer e o que já está pronto.'],
  shipments: ['Expedição', 'Produtos conferidos, pedido completo e saída registrada.'],
  purchases: ['Compras', 'Planeje a reposição e registre os valores de cada aquisição.'],
  receipts: ['Recebimentos', 'Confira os itens recebidos e dê entrada no estoque de insumos.'],
  materials: ['Estoque de insumos', 'Saldos, unidades e os últimos preços de compra em uma visão clara.'],
  products: ['Produtos acabados', 'O que foi produzido, está em estoque e pode seguir para expedição.'],
  recipes: ['Fichas técnicas', 'Composição e rendimento: a base do planejamento e dos custos.'],
  customers: ['Clientes', 'Mantenha os dados comerciais organizados e preserve o histórico.'],
  suppliers: ['Fornecedores', 'Seus parceiros de suprimentos, sempre à mão.'],
  finance: ['Custos e preços', 'Entenda os valores das operações e defina seus preços de venda.'],
  users: ['Usuários e perfis', 'Pessoas da equipe com um ou mais perfis funcionais.'],
  guide: ['Apresentação e decisões', 'Um roteiro para demonstrar o fluxo e revisar as definições do protótipo.'],
};

const decisions = [
  ['D01 · Pedido × estoque acabado', 'Há divergência entre a solicitação atual (pendente) e os documentos locais, que dizem que a regra foi confirmada. O protótipo preserva uma OP com a quantidade integral de cada pedido, sem descontar o estoque acabado. A política definitiva continua para sua decisão.'],
  ['D02 · Concorrência de ordens', 'A branch de classes declara reserva no início como confirmada, enquanto a main ainda a lista como pendência. O protótipo considera insumos comprometidos com ordens em andamento sem baixar o saldo físico, e mostra saldo disponível no PCP. Validar qual documento passa a ser a referência.'],
  ['D03 · Cancelamento e perdas', 'A branch de classes prevê apuração quantitativa e movimentações, mas a main deixa o detalhamento aberto. Nesta entrega, motivo e situação são obrigatórios; o registro não altera saldos e exige reconciliação. Consumo, aproveitamento, perdas e autorizações precisam ser consolidados antes da implementação definitiva.'],
  ['D04 · Recebimento', 'A branch de classes admite recebimentos parciais; a main ainda os deixa pendentes. O protótipo simplifica para recebimento integral e único por compra. Confirmar recebimentos parciais, divergências e devoluções antes de expandir esta tela.'],
  ['D05 · Último preço e unidades', 'Custo usa o preço da compra com data mais recente (desempate pelo identificador), a partir do registro da compra. Todos os insumos de cada ficha usam a unidade do cadastro. Conversões e ausência de preço seguem pendentes; preço ausente gera custo indisponível.'],
  ['D06 · Perfis e acesso', 'Login demonstrativo com usuários internos e perfis acumuláveis. Todos os menus ficam visíveis para apresentar o fluxo completo; isso não representa uma matriz aprovada nem segurança de produção.'],
  ['D07 · Estados e expedição', 'Estados são uma proposta de interface. Expedição exige OP concluída, estoque suficiente e todos os itens do pedido. Cancelamentos não permitem expedição nem reabertura automática. Validar o catálogo completo de transições.'],
  ['D08 · Valores financeiros', 'Painel deriva valores de compras, pedidos e expedições, sem lançamentos bancários. Preços históricos de pedidos são preservados. Custos apresentados refletem a receita e os preços atuais, não um custeio histórico. Eventos e estornos continuam pendentes.'],
  ['D09 · Cadastros e rendimento', 'Clientes e fornecedores podem ser incluídos, editados e inativados. Produtos, insumos e fichas técnicas usam cadastros sintéticos de referência nesta entrega; manutenção completa fica para a próxima iteração. Escala proporcional da receita, com produtos em unidades inteiras, precisa de validação para lotes mínimos.'],
  ['D10 · Dados e persistência', 'Dados locais sintéticos, salvos neste navegador. Reiniciar demonstração restaura o cenário inicial. Sem sincronização entre usuários ou dispositivos; login, perfis e operações são demonstrativos.'],
  ['D11 · Base dos diagramas', 'Foram consultados macrofluxo e casos de uso da main e o README de classes da branch docs/diagrama-classes-dominio. O anexo original da conversa não veio neste contexto. Essa branch adiciona decisões além da main; a preservação da composição da receita na OP deve ser consolidada. As fichas são fixas neste protótipo.'],
  ['D12 · Campos e datas', 'Nome e e-mail são obrigatórios nos parceiros; documentos e telefone têm formato livre. Pedidos exigem previsão a partir de hoje e a expedição usa a data da confirmação. Validar obrigatoriedade, datas e documentos fiscais.'],
  ['D13 · Estoque mínimo e indicadores', 'Mínimos de insumos são referências sintéticas para alertas. Produtos disponíveis conta os tipos com saldo positivo, com total de unidades no detalhe. Validar mínimos e indicadores com o grupo.'],
  ['D14 · Etapas no kanban', 'Cada OP possui cards por produto, nas colunas A fazer, Em andamento e Concluído. Os exemplos podem ser complementados. Etapas só avançam após o início da OP; todas precisam estar concluídas para encerrar a ordem integral. Cards não movimentam estoque nem representam produção parcial. A sequência e os nomes definitivos das etapas seguem para validação.'],
];

function loadDatabase(): { database: Database; warning: string } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Database;
      if (parsed.version === 1 && ['customers', 'suppliers', 'materials', 'products', 'recipes', 'orders', 'productions', 'purchases', 'movements', 'shipments', 'users'].every(key => Array.isArray(parsed[key as keyof Database]))) return { database: parsed, warning: '' };
      return { database: freshData(), warning: 'Dados locais incompatíveis. Foi carregado um novo cenário de demonstração.' };
    }
    return { database: freshData(), warning: '' };
  } catch { return { database: freshData(), warning: 'Não foi possível ler os dados locais. O protótipo usará os dados de demonstração.' }; }
}

export default function App() {
  const [initial] = useState(loadDatabase);
  const [database, setDatabase] = useState(initial.database);
  const [userId, setUserId] = useState(() => { try { return sessionStorage.getItem(SESSION_KEY) ?? ''; } catch { return ''; } });
  const [page, setPage] = useState(() => Object.hasOwn(pageInfo, location.hash.slice(1)) ? location.hash.slice(1) : 'dashboard');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<FormKind | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [productionId, setProductionId] = useState('');
  const [confirmation, setConfirmation] = useState<{ title: string; text: string; command: Command } | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [toast, setToast] = useState<{ text: string; error: boolean } | null>(initial.warning ? { text: initial.warning, error: true } : null);
  const [formError, setFormError] = useState('');
  const [storageWarning, setStorageWarning] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const user = database.users.find(entry => entry.id === userId && entry.active);
  const detail = database.productions.find(entry => entry.id === detailId);
  useEffect(() => { if (detailId) setProductionId(detailId); }, [detailId]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(database)); setStorageWarning(''); }
    catch { setStorageWarning('Armazenamento local indisponível. As alterações serão mantidas apenas enquanto esta página estiver aberta.'); }
  }, [database]);
  useEffect(() => {
    const onHash = () => { const nextPage = location.hash.slice(1); setPage(Object.hasOwn(pageInfo, nextPage) ? nextPage : 'dashboard'); setSearch(''); setFilter('all'); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const modalOpen = Boolean(form || detail || confirmation || resetOpen);
  useEffect(() => {
    if (!modalOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setForm(null); setDetailId(null); setConfirmation(null); setResetOpen(false); }
      if (event.key === 'Tab') {
        const focusables = modalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]');
        if (!focusables?.length) return;
        const first = focusables[0]; const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); previousFocus?.focus(); };
  }, [modalOpen]);

  function notify(text: string, error = false) {
    setToast({ text, error });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), error ? 10000 : 5500);
  }
  function navigate(nextPage: string) { setPage(nextPage); location.hash = nextPage; setSearch(''); setFilter('all'); setSidebarOpen(false); }
  function openProduction(id: string) { setProductionId(id); setDetailId(null); navigate('production'); }
  function confirmProduction(production: Production, action: 'start' | 'complete') {
    setConfirmation({ title: `${action === 'start' ? 'Iniciar' : 'Concluir'} ${production.id}?`, text: action === 'start' ? 'O saldo disponível será conferido. As etapas serão liberadas para acompanhamento; o estoque físico só muda na conclusão da OP.' : 'Todas as etapas estão prontas. Confirme a conclusão integral para baixar os insumos e receber todos os produtos no estoque.', command: { type: action, id: production.id } });
  }
  function openForm(nextForm: FormKind) { setFormError(''); setForm(nextForm); setDetailId(null); }
  function run(command: Command) {
    try {
      const updated = execute(database, command);
      setDatabase(updated); setForm(null); setConfirmation(null); setFormError('');
      if (command.type === 'manual') { setProductionId(updated.productions[0].id); navigate('production'); }
      if (command.type !== 'task-move') notify(command.type === 'task-add' ? 'Etapa adicionada ao quadro desta OP.' : command.type === 'task-remove' ? 'Etapa removida do quadro.' : command.type === 'order' && !command.id ? 'Pedido registrado e uma única OP criada automaticamente.' : command.type === 'receive' ? 'Recebimento confirmado. Estoque atualizado e OPs reavaliadas.' : command.type === 'complete' ? 'Produção concluída. Insumos baixados e produtos em estoque.' : command.type === 'purchase' ? 'Compra registrada. O estoque só muda no recebimento.' : command.type === 'cancel' ? 'Cancelamento registrado. Reconciliação do estoque pendente.' : command.type === 'ship' ? 'Pedido expedido integralmente. Saída de estoque registrada.' : 'Alteração salva com sucesso.');
      return true;
    } catch (error) { const message = error instanceof Error ? error.message : 'Não foi possível realizar a operação.'; setFormError(message); notify(message, true); return false; }
  }
  function exportData() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(database, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `integra-demonstracao-${today()}.json`; link.click(); URL.revokeObjectURL(url); notify('Dados da demonstração exportados.');
  }
  const matches = (...values: unknown[]) => values.join(' ').toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'));
  const customerName = (id: string) => database.customers.find(entry => entry.id === id)?.name ?? id;
  const productName = (id: string) => database.products.find(entry => entry.id === id)?.name ?? id;
  const supplierName = (id: string) => database.suppliers.find(entry => entry.id === id)?.name ?? id;
  const materialName = (id: string) => database.materials.find(entry => entry.id === id)?.name ?? id;
  const itemDescription = (items: { productId: string; quantity: number }[]) => items.map(item => `${number(item.quantity)} × ${productName(item.productId)}`).join(' · ');
  const cancelled = database.productions.filter(entry => entry.status === 'cancelled');
  const planned = database.productions.filter(entry => entry.status === 'planned');
  const waiting = planned.filter(entry => productionStatus(database, entry) === 'Aguardando reposição');
  const running = database.productions.filter(entry => entry.status === 'running');
  const lowMaterials = database.materials.filter(entry => entry.stock < entry.minimum);
  const productionActions = (production: Production) => <div className="actions"><Button secondary onClick={() => openProduction(production.id)}>Ver etapas<ArrowRight size={15}/></Button><button className="text-button" onClick={() => setDetailId(production.id)}>Detalhes</button></div>;

  function ordersTable(recent = false) {
    const orders = database.orders.filter(order => matches(order.id, customerName(order.customerId), itemDescription(order.items)) && (filter === 'all' || (filter === 'open' ? !order.shipped : order.shipped)));
    return <Table columns={['Pedido / cliente', 'Produtos', 'Entrega prevista', 'Valor', 'Status', '']} rows={(recent ? orders.slice(0, 5) : orders).map(order => {
      const production = database.productions.find(entry => entry.orderId === order.id);
      return [<div className="identity"><strong>{order.id}</strong><span>{customerName(order.customerId)}</span></div>, <div className="item-summary">{order.items.map(item => <span key={item.productId}>{number(item.quantity)} × {productName(item.productId)}</span>)}</div>, date(order.delivery), <strong>{money(total(order.items))}</strong>, <Badge>{orderStatus(database, order.id)}</Badge>, <div className="actions"><button className="text-button" onClick={() => setDetailId(production?.id ?? null)}>Ver OP <ArrowUpRight size={14}/></button>{!recent && <button title="Pedido editável somente antes do início da produção" className="icon-button" aria-label={`Editar ${order.id}`} disabled={!production || production.status !== 'planned' || Boolean(production.startedAt)} onClick={() => openForm({ type: 'order', id: order.id })}><Pencil size={15}/></button>}</div>];
    })}/>;
  }

  function renderPage() {
    if (page === 'dashboard') return <Dashboard database={database} search={search} navigate={navigate} openProduction={openProduction}/>;
    if (page === 'production') return <ProductionBoard database={database} search={search} selectedId={productionId} onSelect={setProductionId} onCommand={run} onConfirm={confirmProduction} onDetails={setDetailId} onNotes={production => openForm({ type: 'notes', production })} onRemove={(id, taskId, title) => setConfirmation({ title: 'Remover esta etapa?', text: `O card “${title}” será removido apenas desta OP. As fichas técnicas não serão alteradas.`, command: { type: 'task-remove', id, taskId } })} navigate={navigate}/>;

    if (page === 'customers' || page === 'suppliers') {
      const collection = page === 'customers' ? database.customers : database.suppliers;
      return <><div className="summary-strip"><span><strong>{collection.length}</strong> cadastros</span><span><i className="status-dot"/><strong>{collection.filter(entry => entry.active).length}</strong> ativos</span><span>Histórico preservado ao inativar</span></div><Panel title={page === 'customers' ? 'Carteira de clientes' : 'Parceiros de fornecimento'} action={<Filter value={filter} setValue={setFilter} options={[['all', 'Todos'], ['active', 'Ativos'], ['inactive', 'Inativos']]}/>}><Table columns={['Nome / razão social', 'CPF / CNPJ', 'Contato', 'Situação', 'Ações']} rows={collection.filter(entry => matches(entry.id, entry.name, entry.email, entry.document) && (filter === 'all' || entry.active === (filter === 'active'))).map(partner => [<div className="name-cell"><span className="avatar pale">{partner.name.slice(0, 2).toUpperCase()}</span><div className="identity"><strong>{partner.name}</strong><span>{partner.id}</span></div></div>, partner.document || '—', <div className="identity"><span>{partner.email}</span><span>{partner.phone || '—'}</span></div>, <Badge>{partner.active ? 'Ativo' : 'Inativo'}</Badge>, <div className="actions"><Button secondary onClick={() => openForm({ type: page === 'customers' ? 'customer' : 'supplier', partner })}><Pencil size={14}/>Editar</Button><button className="text-button" onClick={() => setConfirmation({ title: `${partner.active ? 'Inativar' : 'Reativar'} ${partner.name}?`, text: 'Os vínculos e o histórico das operações serão preservados.', command: { type: 'partner', collection: page === 'customers' ? 'customers' : 'suppliers', partner: { ...partner, active: !partner.active } } })}>{partner.active ? 'Inativar' : 'Reativar'}</button></div>])}/></Panel></>;
    }

    if (page === 'orders') return <><Notice>O registro do pedido gera automaticamente uma única OP. Alterações são permitidas apenas antes do início da produção.</Notice><Panel title="Todos os pedidos" action={<Filter value={filter} setValue={setFilter} options={[['all', 'Todos'], ['open', 'Em aberto'], ['shipped', 'Expedidos']]}/>}>{ordersTable()}</Panel></>;

    if (page === 'productions') {
      const list = database.productions.filter(production => matches(production.id, production.orderId, itemDescription(production.items)) && (filter === 'all' || production.status === filter));
      return <><Panel title="Todas as ordens" action={<Filter value={filter} setValue={setFilter} options={[['all', 'Todas'], ['planned', 'Planejadas'], ['running', 'Em produção'], ['completed', 'Concluídas'], ['cancelled', 'Canceladas']]}/>}><Table columns={['Ordem / origem', 'Produtos', 'Criada em', 'Situação', 'Ações']} rows={list.map(production => [<div className="identity"><strong>{production.id}</strong><span>{production.orderId ? `Pedido · ${production.orderId}` : 'Criação manual'}</span></div>, <div className="item-summary">{production.items.map(item => <span key={item.productId}>{number(item.quantity)} × {productName(item.productId)}</span>)}</div>, date(production.date), <Badge>{productionStatus(database, production)}</Badge>, productionActions(production)])}/></Panel>{cancelled.length > 0 && <Notice warning>{cancelled.length} cancelamento(s) com reconciliação de insumos e produtos pendente. Os saldos não foram ajustados por essa exceção.</Notice>}</>;
    }

    if (page === 'pcp') return <>
      <div className="mini-stats"><div><span>Ordens planejadas</span><strong>{planned.length}</strong></div><div><span>Aguardando reposição</span><strong className="amber-text">{waiting.length}</strong></div><div><span>Prontas para iniciar</span><strong>{planned.filter(production => productionStatus(database, production) === 'Pronta para iniciar').length}</strong></div></div>
      <Notice warning>A consulta ao estoque acabado antes de dimensionar a produção continua em validação. Aqui, a necessidade usa todos os itens da OP. O início também verifica insumos comprometidos com ordens em andamento.</Notice>
      <div className="pcp-grid">{planned.filter(production => matches(production.id, production.orderId, itemDescription(production.items))).map(production => <Panel key={production.id} title={production.id} eyebrow={production.orderId ? `ORIGEM · ${production.orderId}` : 'ORIGEM · MANUAL'} action={<Badge>{productionStatus(database, production)}</Badge>}>
        <p className="panel-description">{itemDescription(production.items)}</p>
        <Table columns={['Insumo', 'Necessário', 'Físico', 'Comprometido', 'Disponível', 'Falta física']} rows={requirements(database, production.items).map(item => {
          const availability = availableMaterial(database, item.material.id);
          return [item.material.name, `${number(item.quantity)} ${item.material.unit}`, number(item.material.stock), number(availability.committed), number(availability.available), item.missing > 0 ? <strong className="amber-text">{number(item.missing)} {item.material.unit}</strong> : <span className="green-text">—</span>];
        })}/>
        <div className="panel-footer"><button className="text-button" onClick={() => setDetailId(production.id)}>Ver ordem<ArrowUpRight size={14}/></button><Button secondary onClick={() => navigate(productionStatus(database, production) === 'Aguardando reposição' ? 'purchases' : 'production')}>{productionStatus(database, production) === 'Aguardando reposição' ? 'Acionar Compras' : 'Ir para produção'}<ArrowRight size={14}/></Button></div>
      </Panel>)}</div>
      {planned.length === 0 && <Notice>Nenhuma ordem planejada. Registre um pedido ou crie uma OP manual.</Notice>}
    </>;

    if (page === 'purchases' || page === 'receipts') return <><Notice warning>{page === 'purchases' ? 'A compra registra os valores e os últimos preços conhecidos. O saldo só aumenta após o recebimento.' : 'Confirme somente os itens efetivamente conferidos. Nesta demonstração o recebimento é integral.'}</Notice><Panel title={page === 'purchases' ? 'Aquisições de insumos' : 'Conferência e entrada'} action={<Filter value={filter} setValue={setFilter} options={[['all', 'Todas'], ['pending', 'Aguardando'], ['received', 'Recebidas']]}/>}><Table columns={['Compra / fornecedor', 'Itens', 'Data', 'Valor', 'Situação', 'Ações']} rows={database.purchases.filter(purchase => matches(purchase.id, supplierName(purchase.supplierId), purchase.items.map(item => materialName(item.materialId))) && (filter === 'all' || purchase.received === (filter === 'received'))).map(purchase => [<div className="identity"><strong>{purchase.id}</strong><span>{supplierName(purchase.supplierId)}</span></div>, <div className="item-summary">{purchase.items.map(item => <span key={item.materialId}>{number(item.quantity)} {database.materials.find(entry => entry.id === item.materialId)?.unit} · {materialName(item.materialId)} · {money(item.price)}/un. cad.</span>)}</div>, date(purchase.date), <strong>{money(total(purchase.items))}</strong>, <Badge>{purchase.received ? 'Recebida' : 'Aguardando recebimento'}</Badge>, purchase.received ? <span className="green-text"><CheckCircle2 size={15}/> Conferido</span> : <Button secondary onClick={() => page === 'receipts' ? openForm({ type: 'receive', purchase }) : navigate('receipts')}>{page === 'receipts' ? 'Conferir e receber' : 'Ir ao recebimento'}<ArrowRight size={14}/></Button>])}/></Panel></>;

    if (page === 'materials' || page === 'products') return <>
      <Panel title={page === 'materials' ? 'Posição de insumos' : 'Posição de produtos acabados'} action={page === 'materials' ? <Filter value={filter} setValue={setFilter} options={[['all', 'Todos'], ['low', 'Estoque baixo']]}/> : <span className="subtle">Entrada pela conclusão da produção</span>}>
        {page === 'materials' ? <Table columns={['Insumo', 'Unidade', 'Estoque atual', 'Mínimo de referência', 'Último preço de compra', 'Situação']} rows={database.materials.filter(material => matches(material.name, material.id) && (filter !== 'low' || material.stock < material.minimum)).map(material => [<div className="identity"><strong>{material.name}</strong><span>{material.id}</span></div>, material.unit, <strong>{number(material.stock)}</strong>, number(material.minimum), material.lastPrice === null ? 'Não informado' : `${money(material.lastPrice)} / ${material.unit}`, <Badge>{material.stock < material.minimum ? 'Estoque baixo' : 'Regular'}</Badge>])}/> : <Table columns={['Produto', 'Categoria', 'Unidade', 'Estoque atual', 'Preço de venda', '']} rows={database.products.filter(product => matches(product.id, product.name, product.category)).map(product => [<div className="name-cell"><span className="product-icon"><Package size={22}/></span><div className="identity"><strong>{product.name}</strong><span>{product.id}</span></div></div>, product.category, product.unit, <strong>{number(product.stock)}</strong>, money(product.price), <button className="text-button" onClick={() => openForm({ type: 'price', productId: product.id })}>Editar preço<Pencil size={14}/></button>])}/>}
      </Panel><Panel title="Histórico de movimentações" eyebrow="RASTREABILIDADE"><Table columns={['Data', 'Referência', page === 'materials' ? 'Insumo' : 'Produto', 'Movimentação', 'Quantidade']} rows={database.movements.filter(movement => movement.kind === (page === 'materials' ? 'insumo' : 'produto') && matches(movement.reference, movement.description, movement.kind === 'insumo' ? materialName(movement.entityId) : productName(movement.entityId))).map(movement => [date(movement.date), <strong>{movement.reference}</strong>, movement.kind === 'insumo' ? materialName(movement.entityId) : productName(movement.entityId), movement.description, <span className={movement.quantity > 0 ? 'green-text' : 'amber-text'}>{movement.quantity > 0 ? <ArrowDownLeft size={14}/> : <ArrowUpRight size={14}/>} {movement.quantity > 0 ? '+' : ''}{number(movement.quantity)} {movement.kind === 'insumo' ? database.materials.find(entry => entry.id === movement.entityId)?.unit : 'un'}</span>])}/></Panel>
    </>;

    if (page === 'recipes') return <><Notice>As quantidades são dimensionadas proporcionalmente ao rendimento. Cada insumo usa a unidade do seu cadastro.</Notice><div className="recipe-grid">{database.recipes.filter(recipe => matches(productName(recipe.productId))).map(recipe => { const product = database.products.find(entry => entry.id === recipe.productId)!; const cost = productCost(database, product.id); return <Panel key={product.id} title={product.name} eyebrow={product.category.toUpperCase()} action={<BookOpen size={21} className="green-text"/>}><div className="recipe-yield"><span>Rendimento da ficha</span><strong>{number(recipe.yield)} {product.unit}</strong></div><Table columns={['Insumo', 'Quantidade', 'Unidade']} rows={recipe.ingredients.map(ingredient => { const material = database.materials.find(entry => entry.id === ingredient.materialId)!; return [material.name, number(ingredient.quantity), material.unit]; })}/><div className="recipe-cost"><span>Custo de insumos / {product.unit}</span><strong>{cost === null ? 'Indisponível' : money(cost)}</strong></div></Panel>; })}</div></>;

    if (page === 'shipments') return <><Notice>A expedição sempre atende um pedido completo e exige sua OP concluída, além do estoque suficiente.</Notice><Panel title="Pedidos para expedição"><Table columns={['Pedido / destinatário', 'Produtos', 'Situação', 'Ação']} rows={database.orders.filter(order => !order.shipped && matches(order.id, customerName(order.customerId))).map(order => { const ready = orderStatus(database, order.id) === 'Pronto para expedir'; const stock = order.items.every(item => database.products.find(product => product.id === item.productId)!.stock >= item.quantity); return [<div className="identity"><strong>{order.id}</strong><span>{customerName(order.customerId)}</span></div>, <div className="item-summary">{order.items.map(item => <span key={item.productId}>{number(item.quantity)} × {productName(item.productId)}</span>)}</div>, <Badge>{ready && !stock ? 'Falta de estoque' : orderStatus(database, order.id)}</Badge>, <Button disabled={!ready || !stock} onClick={() => openForm({ type: 'ship', orderId: order.id })}><Truck size={15}/>Expedir pedido</Button>]; })}/></Panel><Panel title="Expedições registradas"><Table columns={['Expedição', 'Pedido', 'Destinatário', 'Data', 'Produtos', 'Valor do pedido']} rows={database.shipments.filter(shipment => matches(shipment.id, shipment.orderId, shipment.recipient)).map(shipment => [<strong>{shipment.id}</strong>, shipment.orderId, shipment.recipient, date(shipment.date), itemDescription(shipment.items), money(total(shipment.items))])} empty="Nenhuma expedição registrada. Conclua uma OP para demonstrar a saída dos produtos."/></Panel></>;

    if (page === 'finance') return <><div className="mini-stats financial"><div><span>Valor dos pedidos registrados</span><strong>{money(database.orders.reduce((sum, order) => sum + total(order.items), 0))}</strong></div><div><span>Compras registradas</span><strong>{money(database.purchases.reduce((sum, purchase) => sum + total(purchase.items), 0))}</strong></div><div><span>Valor expedido</span><strong>{money(database.shipments.reduce((sum, shipment) => sum + total(shipment.items), 0))}</strong></div></div><Notice>Valores operacionais, sem confirmação de pagamento. O custo considera apenas os insumos da receita e o último preço de compra conhecido, dividido pelo rendimento.</Notice><Panel title="Custo dos produtos e preço de venda" eyebrow="FINANCEIRO SIMPLIFICADO"><Table columns={['Produto', 'Custo de insumos / un', 'Preço de venda / un', 'Diferença unitária¹', 'Ação']} rows={database.products.filter(product => matches(product.name)).map(product => { const cost = productCost(database, product.id); return [<div className="identity"><strong>{product.name}</strong><span>{product.category}</span></div>, cost === null ? 'Custo indisponível' : money(cost), <strong>{money(product.price)}</strong>, cost === null ? '—' : <span className={product.price - cost >= 0 ? 'green-text' : 'amber-text'}>{money(product.price - cost)}</span>, <Button secondary onClick={() => openForm({ type: 'price', productId: product.id })}><Pencil size={14}/>Editar preço</Button>]; })}/><p className="footnote">¹ Preço menos custo de insumos. Não representa lucro: mão de obra, energia, impostos e outros custos não estão incluídos.</p></Panel><Panel title="Valores das operações"><Table columns={['Referência', 'Operação', 'Data', 'Valor']} rows={[...database.purchases.map(purchase => ({ id: purchase.id, operation: 'Compra registrada', date: purchase.date, amount: total(purchase.items) })), ...database.orders.map(order => ({ id: order.id, operation: 'Pedido registrado', date: order.date, amount: total(order.items) })), ...database.shipments.map(shipment => ({ id: shipment.id, operation: 'Expedição registrada', date: shipment.date, amount: total(shipment.items) }))].filter(operation => matches(operation.id, operation.operation)).sort((first, second) => second.date.localeCompare(first.date)).map(operation => [<strong>{operation.id}</strong>, operation.operation, date(operation.date), money(operation.amount)])}/></Panel></>;

    if (page === 'users') return <><Notice>Usuários internos podem acumular vários perfis. Os menus estão liberados para demonstração; a matriz definitiva de acesso está pendente.</Notice><Panel title="Equipe e responsabilidades"><Table columns={['Usuário', 'E-mail', 'Perfis acumuláveis', 'Situação', 'Ação']} rows={database.users.filter(entry => matches(entry.name, entry.email, entry.profiles)).map(entry => [<div className="name-cell"><span className="avatar pale">{entry.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><strong>{entry.name}</strong></div>, entry.email, <div className="profile-tags">{entry.profiles.map(profile => <span key={profile}>{profile}</span>)}</div>, <Badge>{entry.active ? 'Ativo' : 'Inativo'}</Badge>, <Button secondary onClick={() => openForm({ type: 'profiles', user: entry })}><Settings2 size={14}/>Editar perfis</Button>])}/></Panel><Notice>Cliente e fornecedor são somente entidades cadastradas. Não possuem login.</Notice></>;

    return <><div className="guide-hero"><Leaf size={32}/><div><div className="eyebrow">TCC · GESTÃO INTEGRADA DE ESTOQUE E PRODUÇÃO</div><h2>Uma demonstração, do início ao fim.</h2><p>Dados sintéticos, decisões visíveis e um fluxo integrado para apresentar ao professor.</p></div></div><Panel title="Roteiro sugerido · 8 a 12 minutos"><ol className="demo-steps"><li><strong>Visão geral.</strong> Mostre os indicadores e as ordens em atenção.</li><li><strong>Pedidos → Novo pedido.</strong> Use Café da Vila, 40 pães e 20 brownies. Ao salvar, mostre a única OP automática.</li><li><strong>Planejamento · PCP.</strong> Confira as necessidades e a falta de farinha.</li><li><strong>Compras.</strong> Use a compra CMP-001 pronta ou registre farinha (20 kg) e fermento (1 kg). Mostre que o saldo ainda não mudou.</li><li><strong>Recebimentos.</strong> Confirme a compra. Retorne ao PCP para ver a reavaliação.</li><li><strong>Produção.</strong> Inicie e conclua a OP do novo pedido. Confira baixa de insumos e entrada de produtos no estoque.</li><li><strong>Expedição.</strong> Selecione o pedido e confirme a saída integral.</li><li><strong>Custos e preços.</strong> Mostre a receita, o custo atualizado e a edição manual do preço de venda.</li></ol><div className="panel-footer"><span className="subtle">Reinicie o cenário antes de cada apresentação.</span><Button onClick={() => navigate('dashboard')}>Começar demonstração<ArrowRight size={15}/></Button></div></Panel><Panel title="Decisões, dúvidas e dualidades" eyebrow="PARA VALIDAÇÃO COM O GRUPO"><div className="decision-list">{decisions.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p><span>A validar</span></article>)}</div></Panel><Notice>Fora do escopo: validade, vencimento, FEFO, etiquetas, portais externos, produção/expedição parcial e financeiro contábil completo.</Notice></>;
  }

  if (!user) return <Login database={database} onLogin={id => { setUserId(id); try { sessionStorage.setItem(SESSION_KEY, id); } catch {} }}/ >;

  const action = page === 'orders' ? { label: 'Novo pedido', onClick: () => openForm({ type: 'order' }) } : page === 'productions' || page === 'production' ? { label: 'Criar OP manual', onClick: () => openForm({ type: 'manual' }) } : page === 'customers' ? { label: 'Novo cliente', onClick: () => openForm({ type: 'customer' }) } : page === 'suppliers' ? { label: 'Novo fornecedor', onClick: () => openForm({ type: 'supplier' }) } : page === 'purchases' ? { label: 'Registrar compra', onClick: () => openForm({ type: 'purchase' }) } : page === 'dashboard' ? { label: 'Novo pedido', onClick: () => openForm({ type: 'order' }) } : null;
  const title = pageInfo[page] ?? pageInfo.dashboard;
  const formTitle = form?.type === 'customer' ? form.partner ? 'Editar cliente' : 'Novo cliente' : form?.type === 'supplier' ? form.partner ? 'Editar fornecedor' : 'Novo fornecedor' : form?.type === 'order' ? form.id ? `Editar ${form.id}` : 'Novo pedido' : form?.type === 'manual' ? 'Criar OP manual' : form?.type === 'purchase' ? 'Registrar compra' : form?.type === 'receive' ? `Receber ${form.purchase.id}` : form?.type === 'cancel' ? `Cancelar ${form.production.id}` : form?.type === 'notes' ? `Acompanhar ${form.production.id}` : form?.type === 'ship' ? `Expedir ${form.orderId}` : form?.type === 'price' ? 'Editar preço de venda' : 'Perfis do usuário';

  return <div className="app-shell">
    {sidebarOpen && <div className="sidebar-scrim" onClick={() => setSidebarOpen(false)}/>}
    <Sidebar page={page} navigate={navigate} waiting={waiting.length} open={sidebarOpen}/>
    <div className="main-shell"><header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" aria-label="Abrir menu" onClick={() => setSidebarOpen(true)}><Menu size={22}/></button><span>Workspace</span><ChevronRight size={14}/><strong>{page === 'dashboard' ? 'Visão geral' : title[0]}</strong></div><div className="topbar-right"><label className="search-box"><Search size={17}/><input aria-label="Buscar nesta tela" placeholder="Buscar nesta tela..." value={search} onChange={event => setSearch(event.target.value)}/>{search && <button aria-label="Limpar busca" onClick={() => setSearch('')}><X size={14}/></button>}</label><span className="topbar-divider"/><button className="user-button" title={`${user.profiles.join(', ')} · clique para sair`} onClick={() => { setUserId(''); try { sessionStorage.removeItem(SESSION_KEY); } catch {} }}><span className="avatar">{user.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><span><strong>{user.name.split(' ')[0]}</strong><small>{user.profiles.includes('Administrador') ? 'Administrador' : user.profiles.join(' · ')}</small></span><LogOut size={15}/></button></div></header>
    <main><div className="page-heading"><div><div className="eyebrow">{page === 'dashboard' ? 'BOM TRABALHO, EQUIPE' : 'GESTÃO INTEGRADA'}<span className="heading-dot"/> {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date())}</div><h1>{title[0]}</h1><p>{title[1]}</p></div><div className="actions">{page === 'dashboard' && <Button secondary onClick={() => navigate('guide')}><Play size={15}/>Roteiro da demo</Button>}{action && <Button onClick={action.onClick}><Plus size={17}/>{action.label}</Button>}</div></div>
      {storageWarning && <Notice warning>{storageWarning}</Notice>}{cancelled.length > 0 && !['production', 'guide'].includes(page) && <Notice warning>Há cancelamento(s) pendentes de reconciliação. Os saldos exibidos não refletem eventuais perdas dessa exceção.</Notice>}
      <div className="page-content" key={page}>{renderPage()}</div>
      <footer className="app-footer"><span><span className="status-dot"/>Dados demonstrativos · alterações salvas neste navegador</span><div><button onClick={exportData}><Download size={13}/>Exportar dados</button><button onClick={() => setResetOpen(true)}><RotateCcw size={13}/>Reiniciar demonstração</button></div></footer>
    </main></div>
    <div ref={modalRef}>
      {form && <Modal title={formTitle} onClose={() => setForm(null)}>{formError && <div className="form-error" role="alert">{formError}</div>}<OperationForm database={database} kind={form} submit={run} close={() => setForm(null)}/></Modal>}
      {detail && <Modal title={detail.id} subtitle={`${detail.orderId ? `Pedido de origem: ${detail.orderId}` : 'Criação manual para estoque'} · ${date(detail.date)}`} onClose={() => setDetailId(null)}><div className="form-body"><div className="detail-status"><Badge>{productionStatus(database, detail)}</Badge><span className="subtle">{detail.items.length} produto(s)</span></div><h3>Produtos da ordem</h3><Table columns={['Produto', 'Quantidade']} rows={detail.items.map(item => [productName(item.productId), `${number(item.quantity)} un`])}/><h3>Necessidades de insumos</h3><Table columns={['Insumo', 'Necessário', 'Estoque atual', 'Falta atual']} rows={requirements(database, detail.items).map(item => [item.material.name, `${number(item.quantity)} ${item.material.unit}`, `${number(item.material.stock)} ${item.material.unit}`, detail.status === 'planned' ? `${number(item.missing)} ${item.material.unit}` : '—'])}/>{detail.status === 'completed' && <Notice>Necessidade teórica da ordem. Os saldos exibidos são os atuais, após as movimentações. Consulte o histórico de estoque.</Notice>}{detail.startedAt && <p className="subtle">Início: {date(detail.startedAt)}{detail.completedAt ? ` · Conclusão: ${date(detail.completedAt)}` : ''}</p>}{detail.notes && <Notice>{detail.notes}</Notice>}{detail.cancellation && <div className="cancellation-detail"><Badge>Pendente de reconciliação</Badge><p><strong>Motivo:</strong> {detail.cancellation.reason}</p><p><strong>Insumos:</strong> {detail.cancellation.materials}</p><p><strong>Produtos:</strong> {detail.cancellation.products}</p><p>Cancelamento registrado sem movimentação automática de estoque.</p></div>}</div><footer className="modal-footer"><Button secondary onClick={() => setDetailId(null)}>Fechar</Button>{detail.status === 'running' ? <Button danger onClick={() => openForm({ type: 'cancel', production: detail })}>Cancelar produção</Button> : <Button onClick={() => { setDetailId(null); navigate('production'); }}>Ir para produção<ArrowRight size={15}/></Button>}</footer></Modal>}
      {confirmation && <Modal title={confirmation.title} onClose={() => setConfirmation(null)}><div className="form-body"><p>{confirmation.text}</p></div><footer className="modal-footer"><Button secondary onClick={() => setConfirmation(null)}>Voltar</Button><Button onClick={() => run(confirmation.command)}>Confirmar<Check size={16}/></Button></footer></Modal>}
      {resetOpen && <Modal title="Reiniciar demonstração?" onClose={() => setResetOpen(false)}><div className="form-body"><Notice warning>Todos os registros e alterações feitos neste navegador serão substituídos pelo cenário inicial. Você pode exportá-los antes de continuar.</Notice></div><footer className="modal-footer"><Button secondary onClick={() => setResetOpen(false)}>Voltar</Button><Button danger onClick={() => { setDatabase(freshData()); setResetOpen(false); setDetailId(null); setForm(null); setConfirmation(null); notify('Cenário inicial restaurado.'); }}>Restaurar cenário<RotateCcw size={16}/></Button></footer></Modal>}
    </div>
    {toast && <div className={`toast ${toast.error ? 'error' : ''}`} role={toast.error ? 'alert' : 'status'}>{toast.error ? <AlertCircle size={20}/> : <CheckCircle2 size={20}/>}<span>{toast.text}</span><button aria-label="Fechar aviso" onClick={() => setToast(null)}><X size={16}/></button></div>}
  </div>;
}

function Filter({ value, setValue, options }: { value: string; setValue: (value: string) => void; options: string[][] }) {
  return <label className="filter"><SlidersHorizontal size={14}/><select aria-label="Filtrar registros" value={value} onChange={event => setValue(event.target.value)}>{options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>;
}

function Login({ database, onLogin }: { database: Database; onLogin: (id: string) => void }) {
  const [selectedUser, setSelectedUser] = useState(database.users.find(user => user.active)?.id ?? '');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  return <div className="login-page"><section className="login-story"><div className="login-brand"><Boxes size={32}/>integra<span>.</span></div><div className="login-story-content"><span className="login-kicker"><span/>GESTÃO QUE CONECTA</span><h1>Do primeiro insumo<br/>à próxima entrega<span>.</span></h1><p>Planejamento, estoque e produção.<br/>Uma operação integrada em cada etapa.</p><div className="login-flow"><span><ShoppingBag size={20}/>Pedido</span><ArrowRight size={18}/><span><Factory size={20}/>Produção</span><ArrowRight size={18}/><span><Truck size={20}/>Entrega</span></div></div><div className="login-footer">TCC · Centro Universitário FEI <span>2026</span></div><div className="orb orb-one"/><div className="orb orb-two"/></section><section className="login-form-side"><div className="login-form"><div className="eyebrow">ESTOQUE & PRODUÇÃO</div><h2>Bem-vindo à Integra.</h2><p>Acesse o ambiente de demonstração.</p><form onSubmit={event => { event.preventDefault(); if (password !== '123456') { setError('Use a senha demonstrativa: 123456.'); return; } onLogin(selectedUser); }}><Field label="Usuário de demonstração"><select value={selectedUser} onChange={event => setSelectedUser(event.target.value)}>{database.users.filter(user => user.active).map(user => <option key={user.id} value={user.id}>{user.name}</option>)}</select></Field><div className="login-profiles">{database.users.find(user => user.id === selectedUser)?.profiles.map(profile => <span key={profile}>{profile}</span>)}</div><Field label="Senha demonstrativa"><input type="password" required value={password} onChange={event => setPassword(event.target.value)}/></Field>{error && <p role="alert" className="login-error">{error}</p>}<Button type="submit">Entrar na demonstração<ArrowRight size={18}/></Button></form><div className="login-note"><FileText size={18}/><span>Protótipo acadêmico com dados fictícios.<br/>Senha: <strong>123456</strong> · Nenhum acesso externo.</span></div><p className="login-caption">Gestão Integrada de Estoque e Produção<br/>Eduardo · Gabriel · David</p></div></section></div>;
}
