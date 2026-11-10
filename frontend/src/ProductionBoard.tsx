import { useEffect, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Circle, ClipboardList, GripVertical, Layers3, ListTodo, LockKeyhole, Package, Play, Plus, Trash2, X } from 'lucide-react';
import type { Database, Production, TaskStatus } from './types.ts';
import { productionStatus, requirements, type Command } from './domain.ts';
import { productionTasks, taskColumns, taskProgress } from './workflow.ts';
import { Badge, Button, date, Field, number } from './ui.tsx';

type Props = {
  database: Database;
  search: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onCommand: (command: Command) => boolean;
  onConfirm: (production: Production, action: 'start' | 'complete') => void;
  onDetails: (id: string) => void;
  onNotes: (production: Production) => void;
  onRemove: (id: string, taskId: string, title: string) => void;
  navigate: (page: string) => void;
};

export function ProductionBoard({ database, search, selectedId, onSelect, onCommand, onConfirm, onDetails, onNotes, onRemove, navigate }: Props) {
  const [productFilter, setProductFilter] = useState('all');
  const [adding, setAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProduct, setTaskProduct] = useState('');
  const [dragging, setDragging] = useState<string | null>(null);
  const [dropColumn, setDropColumn] = useState<TaskStatus | null>(null);
  const list = database.productions.filter(production => `${production.id} ${production.orderId ?? 'Manual'} ${production.items.map(item => database.products.find(product => product.id === item.productId)?.name).join(' ')}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
  const selected = list.find(production => production.id === selectedId) ?? list.find(production => production.status === 'running') ?? list.find(production => production.status === 'planned') ?? list[0];
  useEffect(() => { if (selected && selected.id !== selectedId) onSelect(selected.id); }, [selected?.id, selectedId, onSelect]);

  if (!selected) return <div className="board-empty"><ClipboardList size={36}/><h2>{search ? 'Nenhuma ordem encontrada' : 'Seu quadro está pronto para começar'}</h2><p>{search ? 'Tente buscar por outra OP, pedido ou produto.' : 'Registre um pedido ou crie uma OP manual para acompanhar as etapas.'}</p>{!search && <Button onClick={() => navigate('orders')}>Ir para pedidos<ArrowRight size={16}/></Button>}</div>;

  const tasks = productionTasks(selected);
  const progress = taskProgress(selected);
  const running = selected.status === 'running';
  const editable = running || selected.status === 'planned';
  const status = productionStatus(database, selected);
  const blocked = selected.status === 'planned' && status !== 'Pronta para iniciar';
  const order = database.orders.find(entry => entry.id === selected.orderId);
  const currentFilter = selected.items.some(item => item.productId === productFilter) ? productFilter : 'all';
  const filteredTasks = tasks.filter(task => currentFilter === 'all' || task.productId === currentFilter);
  const shortage = requirements(database, selected.items).filter(item => item.missing > 0);

  function selectOrder(id: string) {
    onSelect(id); setProductFilter('all'); setAdding(false); setTaskTitle(''); setTaskProduct(''); setDragging(null); setDropColumn(null);
  }
  function move(taskId: string, target: TaskStatus) {
    onCommand({ type: 'task-move', id: selected.id, taskId, status: target }); setDragging(null); setDropColumn(null);
  }

  return <div className="production-workspace">
    <div className="board-picker"><Field label="Qual ordem vamos acompanhar?"><select value={selected.id} onChange={event => selectOrder(event.target.value)}>{list.map(production => <option key={production.id} value={production.id}>{production.id} · {production.items.map(item => database.products.find(product => product.id === item.productId)?.name).join(' + ')} · {productionStatus(database, production)}</option>)}</select></Field><div className="board-picker-meta"><Layers3 size={18}/><span><strong>{list.length}</strong> {list.length === 1 ? 'ordem' : 'ordens'} no acompanhamento</span></div></div>
    <section className="board-overview">
      <div className="board-order-title"><div><span className="section-kicker">ORDEM DE PRODUÇÃO</span><h2>{selected.id} <Badge>{status}</Badge></h2><p>{selected.orderId ? `${selected.orderId} · ${database.customers.find(customer => customer.id === order?.customerId)?.name ?? 'Pedido de cliente'}` : 'Ordem manual · reposição de estoque'}{order && <> <span>·</span> Entrega prevista: {date(order.delivery)}</>}</p></div><Button secondary onClick={() => onDetails(selected.id)}><ClipboardList size={16}/>Detalhes da OP</Button></div>
      <div className="board-progress-row"><div className="board-progress"><div><strong>{progress.done}/{progress.total} etapas concluídas</strong><span>{progress.percent}%</span></div><div className="progress-track" role="progressbar" aria-label={`Progresso de ${selected.id}`} aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress.percent}%` }}/></div></div><div className="actions">{selected.status === 'planned' && <Button disabled={blocked} onClick={() => onConfirm(selected, 'start')}><Play size={16}/>Iniciar esta OP</Button>}{running && <Button disabled={!progress.ready} title={progress.ready ? 'Concluir a OP inteira e movimentar estoque' : 'Conclua todas as etapas do quadro primeiro'} onClick={() => onConfirm(selected, 'complete')}><CheckCircle2 size={16}/>Concluir OP inteira</Button>}{selected.status === 'completed' && <span className="board-completed"><CheckCircle2 size={18}/>Estoque atualizado</span>}{selected.status === 'cancelled' && <span className="board-cancelled">Reconciliação pendente</span>}</div></div>
    </section>
    {selected.status === 'planned' && <div className={`board-guidance ${blocked ? 'blocked' : ''}`}><LockKeyhole size={19}/><div><strong>{blocked ? 'Esta ordem ainda não pode começar.' : 'Tudo pronto para começar esta ordem.'}</strong><span>{blocked ? shortage.length ? `Falta repor: ${shortage.map(item => `${number(item.missing)} ${item.material.unit} de ${item.material.name.toLocaleLowerCase('pt-BR')}`).join('; ')}.` : 'Há insumos comprometidos com outra produção. Confira o disponível no PCP.' : 'Inicie a OP para liberar a movimentação dos cards.'}</span></div>{blocked && <button className="text-button" onClick={() => navigate('pcp')}>Ver no PCP<ArrowRight size={16}/></button>}</div>}
    {running && <div className={`board-guidance ${progress.ready ? 'ready' : ''}`}><CheckCircle2 size={19}/><div><strong>{progress.ready ? 'Todas as etapas estão prontas. Falta concluir a OP.' : 'Cada card é uma etapa de um produto.'}</strong><span>{progress.ready ? 'Use “Concluir OP inteira” para baixar os insumos e receber os produtos no estoque.' : 'Arraste os cards ou use o seletor de situação. O estoque muda apenas na conclusão da OP inteira.'}</span></div></div>}
    <div className="kanban-toolbar"><div><h2>Etapas da produção</h2><p>Visualize o trabalho de cada produto.</p></div><div className="actions">{running && <button className="text-button" onClick={() => onNotes(selected)}>Observações</button>}{editable && <Button secondary onClick={() => { setAdding(!adding); setTaskProduct(selected.items[0].productId); }}><Plus size={16}/>Adicionar etapa</Button>}</div></div>
    {adding && editable && <form className="add-stage-form" onSubmit={event => { event.preventDefault(); if (onCommand({ type: 'task-add', id: selected.id, productId: taskProduct || selected.items[0].productId, title: taskTitle })) { setTaskTitle(''); setAdding(false); } }}><Field label="Produto da etapa"><select value={taskProduct || selected.items[0].productId} onChange={event => setTaskProduct(event.target.value)}>{selected.items.map(item => <option key={item.productId} value={item.productId}>{database.products.find(product => product.id === item.productId)?.name}</option>)}</select></Field><Field label="O que precisa ser feito?"><input autoFocus required maxLength={100} value={taskTitle} onChange={event => setTaskTitle(event.target.value)} placeholder="Ex.: preparar massa, fazer recheio..."/></Field><Button type="submit"><Plus size={16}/>Criar card</Button><button type="button" className="icon-button" aria-label="Cancelar nova etapa" onClick={() => setAdding(false)}><X size={18}/></button></form>}
    <div className="board-product-filters" role="group" aria-label="Filtrar etapas por produto"><button aria-pressed={currentFilter === 'all'} className={currentFilter === 'all' ? 'selected' : ''} onClick={() => setProductFilter('all')}>Todos os produtos <span>{tasks.length}</span></button>{selected.items.map(item => <button key={item.productId} aria-pressed={currentFilter === item.productId} className={currentFilter === item.productId ? 'selected' : ''} onClick={() => setProductFilter(item.productId)}>{database.products.find(product => product.id === item.productId)?.name}<span>{tasks.filter(task => task.productId === item.productId).length}</span></button>)}</div>
    <div className="kanban-board">{taskColumns.map(column => {
      const columnTasks = filteredTasks.filter(task => task.status === column.id);
      const ColumnIcon = column.id === 'todo' ? ListTodo : column.id === 'doing' ? Play : CheckCircle2;
      return <section key={column.id} aria-label={`Coluna ${column.label}`} className={`kanban-column ${column.id} ${dropColumn === column.id ? 'drop-target' : ''}`} onDragOver={event => { if (running && dragging) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setDropColumn(column.id); } }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropColumn(null); }} onDrop={event => { event.preventDefault(); const taskId = event.dataTransfer.getData('text/integra-task'); if (running && taskId === dragging && tasks.some(task => task.id === taskId)) move(taskId, column.id); }}>
        <div className="kanban-column-head"><span className="column-icon"><ColumnIcon size={17}/></span><h3>{column.label}</h3><span className="column-count">{columnTasks.length}</span></div><p className="column-description">{column.description}</p>
        <div className="kanban-card-list">{columnTasks.map(task => {
          const item = selected.items.find(entry => entry.productId === task.productId)!;
          const productIndex = database.products.findIndex(product => product.id === task.productId);
          const product = database.products[productIndex];
          const stageNumber = tasks.filter(entry => entry.productId === task.productId).findIndex(entry => entry.id === task.id) + 1;
          return <article className={`kanban-card ${dragging === task.id ? 'dragging' : ''}`} key={task.id} draggable={running} aria-label={`${task.title} · ${product.name}`} onDragStart={event => { event.dataTransfer.setData('text/integra-task', task.id); event.dataTransfer.effectAllowed = 'move'; setDragging(task.id); }} onDragEnd={() => { setDragging(null); setDropColumn(null); }}>
            <div className="task-card-top"><span className={`task-product-label product-${productIndex % 3}`}>{product.name}</span>{running && <GripVertical size={16} className="drag-grip"/>}</div><span className="task-sequence">ETAPA {String(stageNumber).padStart(2, '0')}</span><h4>{task.title}</h4><p className="task-quantity"><Package size={14}/>{number(item.quantity)} unidades · {selected.id}</p>
            <div className="task-card-footer">{running ? <label><span className="sr-only">Situação de {task.title} · {product.name}</span><select value={task.status} onChange={event => move(task.id, event.target.value as TaskStatus)}>{taskColumns.map(target => <option key={target.id} value={target.id}>{target.label}</option>)}</select></label> : <span className="task-status-label">{task.status === 'done' ? <Check size={14}/> : <Circle size={12}/>} {column.label}</span>}{editable && task.status === 'todo' && <button type="button" className="icon-button" title="Remover etapa que ainda não começou" aria-label={`Remover etapa ${task.title} · ${product.name}`} onClick={() => onRemove(selected.id, task.id, task.title)}><Trash2 size={14}/></button>}</div>
          </article>;
        })}{columnTasks.length === 0 && <div className="kanban-empty"><ColumnIcon size={25}/><strong>{column.id === 'done' ? 'As próximas conquistas vêm para cá.' : column.id === 'doing' ? 'Nada em execução por aqui.' : 'Nenhuma etapa pendente.'}</strong><span>{running ? 'Mova um card para esta coluna.' : selected.status === 'planned' ? 'Inicie a OP para trabalhar nas etapas.' : 'Quadro somente para consulta.'}</span></div>}</div>
      </section>;
    })}</div>
    <details className="workflow-note"><summary>Sobre as etapas deste protótipo</summary><p>Os cards são exemplos editáveis de organização do trabalho. Não substituem as fichas técnicas nem representam produção parcial. As etapas não impõem sequência ou tempo obrigatório. Ajuste os exemplos ao processo real; títulos e fluxo definitivo serão validados com o grupo.</p></details>
  </div>;
}
