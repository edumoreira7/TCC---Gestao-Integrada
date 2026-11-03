import type { Database, Item, Partner, Profile, Production, Purchase, TaskStatus } from './types.ts';
import { createTasks, productionTasks, taskProgress } from './workflow.ts';

export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
export const nextId = (prefix: string, records: { id: string }[]) => `${prefix}-${String(Math.max(0, ...records.map(record => Number(record.id.split('-').at(-1)) || 0)) + 1).padStart(3, '0')}`;
function ensure(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const positive = (value: number) => Number.isFinite(value) && value > 0;
const nonnegative = (value: number) => Number.isFinite(value) && value >= 0;
const round = (value: number) => Math.round(value * 1e6) / 1e6;

export function requirements(database: Database, items: Item[]) {
  const amounts = new Map<string, number>();
  for (const item of items) {
    const recipe = database.recipes.find(entry => entry.productId === item.productId);
    if (!recipe || !positive(recipe.yield)) throw new Error('Produto sem ficha técnica válida.');
    for (const ingredient of recipe.ingredients) amounts.set(ingredient.materialId, (amounts.get(ingredient.materialId) ?? 0) + ingredient.quantity * item.quantity / recipe.yield);
  }
  return [...amounts].map(([materialId, quantity]) => {
    const material = database.materials.find(entry => entry.id === materialId);
    if (!material) throw new Error('Insumo da receita não encontrado.');
    return { material, quantity: round(quantity), missing: round(Math.max(0, quantity - material.stock)) };
  });
}

export function productionStatus(database: Database, production: Production) {
  if (production.status === 'running') return 'Em produção';
  if (production.status === 'completed') return 'Concluída';
  if (production.status === 'cancelled') return 'Cancelada';
  const needed = requirements(database, production.items);
  if (needed.some(item => item.missing > 0)) return 'Aguardando reposição';
  if (needed.some(item => item.quantity > availableMaterial(database, item.material.id).available + 1e-6)) return 'Aguardando liberação';
  return 'Pronta para iniciar';
}

export function availableMaterial(database: Database, materialId: string) {
  const material = database.materials.find(entry => entry.id === materialId)!;
  const committed = database.productions.filter(entry => entry.status === 'running').reduce((sum, production) => sum + (requirements(database, production.items).find(item => item.material.id === materialId)?.quantity ?? 0), 0);
  return { committed: round(committed), available: round(Math.max(0, material.stock - committed)) };
}

export function orderStatus(database: Database, orderId: string) {
  const order = database.orders.find(entry => entry.id === orderId);
  if (order?.shipped) return 'Expedido';
  const production = database.productions.find(entry => entry.orderId === orderId);
  if (production?.status === 'completed') return 'Pronto para expedir';
  return production ? productionStatus(database, production) : 'Sem ordem';
}

export function productCost(database: Database, productId: string): number | null {
  const recipe = database.recipes.find(entry => entry.productId === productId);
  if (!recipe || !positive(recipe.yield)) return null;
  let cost = 0;
  for (const ingredient of recipe.ingredients) {
    const material = database.materials.find(entry => entry.id === ingredient.materialId);
    if (!material || material.lastPrice === null) return null;
    cost += ingredient.quantity * material.lastPrice;
  }
  return cost / recipe.yield;
}

export const total = (items: { quantity: number; price: number }[]) => items.reduce((sum, item) => sum + item.quantity * item.price, 0);

export type Command =
  | { type: 'partner'; collection: 'customers' | 'suppliers'; partner: Partner }
  | { type: 'order'; id?: string; customerId: string; delivery: string; items: Item[] }
  | { type: 'manual'; items: Item[]; notes: string }
  | { type: 'purchase'; supplierId: string; date: string; items: Purchase['items'] }
  | { type: 'receive'; id: string }
  | { type: 'start' | 'complete'; id: string }
  | { type: 'cancel'; id: string; reason: string; materials: string; products: string }
  | { type: 'notes'; id: string; notes: string }
  | { type: 'task-move'; id: string; taskId: string; status: TaskStatus }
  | { type: 'task-add'; id: string; productId: string; title: string }
  | { type: 'task-remove'; id: string; taskId: string }
  | { type: 'ship'; orderId: string; recipient: string }
  | { type: 'price'; productId: string; price: number }
  | { type: 'profiles'; userId: string; profiles: Profile[] };

function validateItems(database: Database, items: Item[]) {
  ensure(items.length > 0, 'Adicione pelo menos um produto.');
  ensure(new Set(items.map(item => item.productId)).size === items.length, 'Agrupe as quantidades do mesmo produto em uma linha.');
  for (const item of items) {
    ensure(database.products.some(product => product.id === item.productId), 'Selecione um produto válido.');
    ensure(positive(item.quantity) && Number.isInteger(item.quantity), 'Informe quantidades inteiras e positivas para os produtos em unidades.');
    ensure(nonnegative(item.price), 'Preço inválido.');
  }
  requirements(database, items);
}

export function execute(current: Database, command: Command): Database {
  const database = structuredClone(current);
  const timestamp = new Date().toISOString();
  const movement = (reference: string, entityId: string, kind: 'insumo' | 'produto', quantity: number, description: string) => database.movements.unshift({ id: nextId('MOV', database.movements), date: timestamp, reference, entityId, kind, quantity: round(quantity), description });
  if (command.type === 'partner') {
    ensure(command.partner.name.trim(), 'Informe o nome.');
    ensure(command.partner.email.includes('@'), 'Informe um e-mail válido.');
    const existing = database[command.collection].find(entry => entry.id === command.partner.id);
    if (existing) Object.assign(existing, command.partner);
    else database[command.collection].push({ ...command.partner, id: nextId(command.collection === 'customers' ? 'CLI' : 'FOR', database[command.collection]) });
  }
  if (command.type === 'order') {
    validateItems(database, command.items);
    ensure(database.customers.some(customer => customer.id === command.customerId && customer.active), 'Selecione um cliente ativo.');
    ensure(/^\d{4}-\d{2}-\d{2}$/.test(command.delivery) && command.delivery >= today(), 'Informe uma previsão de entrega a partir de hoje.');
    if (command.id) {
      const order = database.orders.find(entry => entry.id === command.id);
      const production = database.productions.find(entry => entry.orderId === command.id);
      ensure(order && production && production.status === 'planned' && !production.startedAt && !order.shipped, 'O pedido só pode ser alterado antes do início da produção.');
      const previousTasks = productionTasks(production);
      Object.assign(order, { customerId: command.customerId, delivery: command.delivery, items: command.items });
      production.items = structuredClone(command.items);
      production.tasks = command.items.flatMap(item => previousTasks.some(task => task.productId === item.productId) ? previousTasks.filter(task => task.productId === item.productId) : createTasks([item]));
    } else {
      const id = nextId('PED', database.orders);
      database.orders.unshift({ id, customerId: command.customerId, date: today(), delivery: command.delivery, items: command.items, shipped: false });
      database.productions.unshift({ id: nextId('OP', database.productions), orderId: id, date: today(), items: structuredClone(command.items), status: 'planned', notes: '', tasks: createTasks(command.items) });
    }
  }
  if (command.type === 'manual') {
    validateItems(database, command.items);
    database.productions.unshift({ id: nextId('OP', database.productions), date: today(), items: command.items, status: 'planned', notes: command.notes, tasks: createTasks(command.items) });
  }
  if (command.type === 'purchase') {
    ensure(database.suppliers.some(supplier => supplier.id === command.supplierId && supplier.active), 'Selecione um fornecedor ativo.');
    ensure(command.items.length > 0, 'Adicione pelo menos um insumo.');
    ensure(new Set(command.items.map(item => item.materialId)).size === command.items.length, 'Agrupe os insumos repetidos.');
    ensure(/^\d{4}-\d{2}-\d{2}$/.test(command.date) && command.date <= today(), 'A data da compra não pode estar no futuro.');
    for (const item of command.items) {
      const material = database.materials.find(entry => entry.id === item.materialId);
      ensure(material && positive(item.quantity) && positive(item.price), 'Informe insumos, quantidades e preços positivos.');
      ensure(material.unit !== 'un' || Number.isInteger(item.quantity), 'Insumos em unidades exigem quantidades inteiras.');
    }
    database.purchases.unshift({ id: nextId('CMP', database.purchases), supplierId: command.supplierId, date: command.date, items: command.items, received: false });
    for (const item of command.items) {
      const latest = [...database.purchases].filter(purchase => purchase.items.some(entry => entry.materialId === item.materialId)).sort((first, second) => second.date.localeCompare(first.date) || second.id.localeCompare(first.id))[0];
      database.materials.find(material => material.id === item.materialId)!.lastPrice = latest.items.find(entry => entry.materialId === item.materialId)!.price;
    }
  }
  if (command.type === 'receive') {
    const purchase = database.purchases.find(entry => entry.id === command.id);
    ensure(purchase && !purchase.received, 'Compra já recebida ou inexistente.');
    purchase.received = true;
    for (const item of purchase.items) {
      const material = database.materials.find(entry => entry.id === item.materialId)!;
      material.stock = round(material.stock + item.quantity);
      movement(purchase.id, material.id, 'insumo', item.quantity, 'Recebimento de compra');
    }
  }
  if (command.type === 'start' || command.type === 'complete' || command.type === 'cancel' || command.type === 'notes') {
    const production = database.productions.find(entry => entry.id === command.id);
    ensure(production, 'Ordem não encontrada.');
    if (command.type === 'notes') {
      ensure(production.status === 'running', 'Somente produções em andamento podem receber acompanhamento.');
      production.notes = command.notes;
    }
    if (command.type === 'start') {
      ensure(production.status === 'planned', 'Esta ordem não pode ser iniciada.');
      const needed = requirements(database, production.items);
      const committed = new Map<string, number>();
      for (const other of database.productions.filter(entry => entry.status === 'running')) {
        for (const item of requirements(database, other.items)) committed.set(item.material.id, (committed.get(item.material.id) ?? 0) + item.quantity);
      }
      ensure(needed.every(item => item.quantity <= item.material.stock - (committed.get(item.material.id) ?? 0) + 1e-6), 'Insumos insuficientes ou comprometidos com produção em andamento. Confira o PCP.');
      production.status = 'running';
      production.startedAt = timestamp;
    }
    if (command.type === 'complete') {
      ensure(production.status === 'running', 'Inicie a produção antes de concluir.');
      ensure(taskProgress(production).ready, 'Finalize todas as etapas do kanban antes de concluir a OP.');
      production.tasks = productionTasks(production);
      const needed = requirements(database, production.items);
      ensure(needed.every(item => item.missing <= 1e-6), 'Saldo insuficiente para concluir esta produção.');
      for (const item of needed) {
        item.material.stock = round(item.material.stock - item.quantity);
        movement(production.id, item.material.id, 'insumo', -item.quantity, 'Consumo da produção');
      }
      for (const item of production.items) {
        database.products.find(product => product.id === item.productId)!.stock += item.quantity;
        movement(production.id, item.productId, 'produto', item.quantity, 'Conclusão de produção');
      }
      production.status = 'completed';
      production.completedAt = timestamp;
    }
    if (command.type === 'cancel') {
      ensure(production.status === 'running', 'Somente uma produção em andamento pode ser cancelada.');
      ensure(command.reason.trim() && command.materials.trim() && command.products.trim(), 'Registre motivo e situação dos insumos e dos produtos.');
      production.status = 'cancelled';
      production.cancellation = { reason: command.reason, materials: command.materials, products: command.products };
    }
  }
  if (command.type === 'task-move' || command.type === 'task-add' || command.type === 'task-remove') {
    const production = database.productions.find(entry => entry.id === command.id);
    ensure(production, 'Ordem não encontrada.');
    production.tasks = productionTasks(production);
    if (command.type === 'task-move') {
      ensure(production.status === 'running', 'Inicie a OP para movimentar suas etapas. Ordens encerradas não podem ser alteradas.');
      ensure(['todo', 'doing', 'done'].includes(command.status), 'Coluna inválida.');
      const task = production.tasks.find(entry => entry.id === command.taskId);
      ensure(task, 'Etapa não encontrada nesta ordem.');
      task.status = command.status;
    }
    if (command.type === 'task-add') {
      ensure(production.status === 'planned' || production.status === 'running', 'Não é possível adicionar etapas a uma ordem encerrada.');
      ensure(production.items.some(item => item.productId === command.productId), 'A etapa precisa pertencer a um produto desta OP.');
      ensure(command.title.trim().length > 0 && command.title.trim().length <= 100, 'Informe um título de até 100 caracteres.');
      production.tasks.push({ id: nextId('ETAPA', production.tasks), productId: command.productId, title: command.title.trim(), status: 'todo' });
    }
    if (command.type === 'task-remove') {
      ensure(production.status === 'planned' || production.status === 'running', 'Não é possível remover etapas de uma ordem encerrada.');
      const task = production.tasks.find(entry => entry.id === command.taskId);
      ensure(task && task.status === 'todo', 'Só é possível remover etapas que ainda não começaram.');
      ensure(production.tasks.filter(entry => entry.productId === task.productId).length > 1, 'Mantenha ao menos uma etapa por produto.');
      production.tasks = production.tasks.filter(entry => entry.id !== task.id);
    }
  }
  if (command.type === 'ship') {
    const order = database.orders.find(entry => entry.id === command.orderId);
    const production = database.productions.find(entry => entry.orderId === command.orderId);
    ensure(order && !order.shipped && production?.status === 'completed', 'Expedição exige pedido não expedido com OP concluída.');
    ensure(command.recipient.trim(), 'Informe o destinatário.');
    ensure(order.items.every(item => database.products.find(product => product.id === item.productId)!.stock >= item.quantity), 'Estoque insuficiente para expedir todos os itens.');
    const id = nextId('EXP', database.shipments);
    for (const item of order.items) {
      database.products.find(product => product.id === item.productId)!.stock -= item.quantity;
      movement(id, item.productId, 'produto', -item.quantity, `Expedição do ${order.id}`);
    }
    order.shipped = true;
    database.shipments.unshift({ id, orderId: order.id, recipient: command.recipient, date: timestamp, items: structuredClone(order.items) });
  }
  if (command.type === 'price') {
    ensure(nonnegative(command.price), 'Informe um preço válido.');
    const product = database.products.find(entry => entry.id === command.productId);
    ensure(product, 'Produto não encontrado.');
    product.price = command.price;
  }
  if (command.type === 'profiles') {
    const user = database.users.find(entry => entry.id === command.userId);
    ensure(user && command.profiles.length > 0, 'Selecione ao menos um perfil.');
    user.profiles = [...new Set(command.profiles)];
  }
  return database;
}
