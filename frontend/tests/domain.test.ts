import test from 'node:test';
import assert from 'node:assert/strict';
import { freshData } from '../src/data.ts';
import { execute, productCost, productionStatus, requirements, today } from '../src/domain.ts';
import { productionTasks, taskProgress } from '../src/workflow.ts';
import type { Database } from '../src/types.ts';

function finishStages(current: Database, id: string) {
  return productionTasks(current.productions.find(production => production.id === id)!).reduce((database, task) => execute(database, { type: 'task-move', id, taskId: task.id, status: 'done' }), current);
}

test('pedido multiproduto gera uma única OP e edição atualiza a mesma ordem', () => {
  let database = freshData();
  const initialOrders = database.productions.length;
  const items = [{ productId: 'PRD-001', quantity: 30, price: 12 }, { productId: 'PRD-002', quantity: 20, price: 9.5 }];
  database = execute(database, { type: 'order', customerId: 'CLI-001', delivery: today(), items });
  const order = database.orders[0];
  assert.equal(database.productions.length, initialOrders + 1);
  assert.equal(database.productions.filter(entry => entry.orderId === order.id).length, 1);
  assert.deepEqual(database.productions[0].items, items);
  database = execute(database, { type: 'order', id: order.id, customerId: 'CLI-001', delivery: today(), items: [{ ...items[0], quantity: 10 }] });
  assert.equal(database.productions.length, initialOrders + 1);
  assert.equal(database.productions[0].items[0].quantity, 10);
  assert.equal(database.orders[0].items.length, 1);
});

test('necessidades somam insumos compartilhados e consideram rendimento', () => {
  const database = freshData();
  const needed = requirements(database, database.productions[0].items);
  assert.equal(needed.find(entry => entry.material.id === 'INS-001')!.quantity, 8.5);
  assert.equal(needed.find(entry => entry.material.id === 'INS-001')!.missing, 6.5);
  assert.equal(productionStatus(database, database.productions[0]), 'Aguardando reposição');
});

test('compra não altera saldo, recebimento é único e libera a reavaliação', () => {
  let database = freshData();
  const stock = database.materials[0].stock;
  database = execute(database, { type: 'purchase', supplierId: 'FOR-001', date: today(), items: [{ materialId: 'INS-001', quantity: 20, price: 7 }] });
  const purchase = database.purchases[0];
  assert.equal(database.materials[0].stock, stock);
  assert.equal(database.materials[0].lastPrice, 7);
  database = execute(database, { type: 'receive', id: purchase.id });
  assert.equal(database.materials[0].stock, stock + 20);
  assert.equal(productionStatus(database, database.productions[0]), 'Pronta para iniciar');
  assert.throws(() => execute(database, { type: 'receive', id: purchase.id }), /já recebida/);
});

test('início bloqueia falta e concorrência, sem movimentar saldo; edição pós-início bloqueada', () => {
  let database = freshData();
  assert.throws(() => execute(database, { type: 'start', id: 'OP-001' }), /Insumos insuficientes/);
  const initialStock = database.materials.map(entry => entry.stock);
  database = execute(database, { type: 'start', id: 'OP-004' });
  assert.deepEqual(database.materials.map(entry => entry.stock), initialStock);
  assert.throws(() => execute(database, { type: 'order', id: 'PED-002', customerId: 'CLI-002', delivery: today(), items: database.orders[1].items }), /antes do início/);
  database = execute(database, { type: 'manual', items: [{ productId: 'PRD-001', quantity: 10, price: 12 }], notes: '' });
  assert.throws(() => execute(database, { type: 'start', id: database.productions[0].id }), /comprometidos/);
});

test('conclusão integral realiza ambas movimentações uma única vez', () => {
  const original = freshData();
  const needed = requirements(original, original.productions[1].items);
  const database = execute(finishStages(original, 'OP-002'), { type: 'complete', id: 'OP-002' });
  for (const item of needed) assert.ok(Math.abs(database.materials.find(entry => entry.id === item.material.id)!.stock - (item.material.stock - item.quantity)) < 1e-6);
  assert.equal(database.products[1].stock, original.products[1].stock + 20);
  assert.equal(original.productions[1].status, 'running');
  assert.throws(() => execute(database, { type: 'complete', id: 'OP-002' }), /Inicie a produção/);
});

test('expedição exige OP concluída, pedido e estoque integral; bloqueia repetição', () => {
  let database = freshData();
  assert.throws(() => execute(database, { type: 'ship', orderId: 'PED-001', recipient: 'Cliente' }), /OP concluída/);
  const stock = database.products[2].stock;
  database = execute(database, { type: 'ship', orderId: 'PED-003', recipient: 'Empório da Serra' });
  assert.equal(database.products[2].stock, stock - 4);
  assert.equal(database.shipments[0].items[0].quantity, 4);
  assert.throws(() => execute(database, { type: 'ship', orderId: 'PED-003', recipient: 'Cliente' }), /OP concluída/);
  const insufficient = freshData();
  insufficient.products[2].stock = 3;
  assert.throws(() => execute(insufficient, { type: 'ship', orderId: 'PED-003', recipient: 'Cliente' }), /Estoque insuficiente/);
  assert.equal(insufficient.shipments.length, 0);
});

test('custo respeita rendimento, preço ausente e preserva preço histórico do pedido', () => {
  let database = freshData();
  assert.ok(Math.abs(productCost(database, 'PRD-001')! - 2.072) < 1e-6);
  database = execute(database, { type: 'price', productId: 'PRD-001', price: 15 });
  assert.equal(database.orders[0].items[0].price, 12);
  database.materials[0].lastPrice = null;
  assert.equal(productCost(database, 'PRD-001'), null);
});

test('cancelamento registra motivo e situações sem inventar consumo/perdas', () => {
  let database = freshData();
  assert.throws(() => execute(database, { type: 'cancel', id: 'OP-002', reason: '', materials: 'Em análise', products: 'Em análise' }), /Registre motivo/);
  const snapshot = structuredClone(database.materials);
  database = execute(database, { type: 'cancel', id: 'OP-002', reason: 'Falha do forno', materials: 'Consumo a conferir', products: 'Aproveitamento a avaliar' });
  assert.deepEqual(database.materials, snapshot);
  assert.equal(database.productions[1].cancellation!.reason, 'Falha do forno');
  assert.throws(() => execute(database, { type: 'start', id: 'OP-002' }), /não pode ser iniciada/);
});

test('cadastros inativos bloqueiam novos vínculos e perfis podem acumular', () => {
  const database = freshData();
  assert.throws(() => execute(database, { type: 'order', customerId: 'CLI-004', delivery: today(), items: [{ productId: 'PRD-001', quantity: 10, price: 12 }] }), /cliente ativo/);
  const updated = execute(database, { type: 'profiles', userId: 'USR-002', profiles: ['Compras', 'Estoque', 'PCP'] });
  assert.equal(updated.users[1].profiles.length, 3);
});

test('quantidades inválidas e produtos repetidos não geram operações', () => {
  const database = freshData();
  for (const quantity of [0, -2, NaN, Infinity, 1.5]) assert.throws(() => execute(database, { type: 'manual', items: [{ productId: 'PRD-001', quantity, price: 12 }], notes: '' }));
  assert.throws(() => execute(database, { type: 'manual', items: [{ productId: 'PRD-001', quantity: 10, price: 12 }, { productId: 'PRD-001', quantity: 5, price: 12 }], notes: '' }), /Agrupe/);
  assert.equal(database.productions.length, 4);
});

test('fluxo completo pedido, reposição, produção e expedição', () => {
  let database = freshData();
  database = execute(database, { type: 'order', customerId: 'CLI-001', delivery: today(), items: [{ productId: 'PRD-001', quantity: 40, price: 12 }, { productId: 'PRD-002', quantity: 20, price: 9.5 }] });
  const orderId = database.orders[0].id;
  const productionId = database.productions[0].id;
  database = execute(database, { type: 'receive', id: 'CMP-001' });
  database = execute(database, { type: 'start', id: productionId });
  database = finishStages(database, productionId);
  database = execute(database, { type: 'complete', id: productionId });
  database = execute(database, { type: 'ship', orderId, recipient: 'Café da Vila' });
  assert.equal(database.orders[0].shipped, true);
  assert.equal(database.productions[0].status, 'completed');
  assert.equal(database.materials[0].stock, 13.5);
  assert.equal(database.products[0].stock, 18);
  assert.equal(database.products[1].stock, 24);
});

test('kanban agrega etapas por produto e só a conclusão integral movimenta estoque', () => {
  let database = freshData();
  const stock = structuredClone(database.materials);
  const products = structuredClone(database.products);
  const tasks = productionTasks(database.productions[1]);
  assert.equal(tasks.length, 4);
  assert.throws(() => execute(database, { type: 'complete', id: 'OP-002' }), /Finalize todas as etapas/);
  database = execute(database, { type: 'task-move', id: 'OP-002', taskId: tasks[0].id, status: 'doing' });
  database = execute(database, { type: 'task-move', id: 'OP-002', taskId: tasks[0].id, status: 'done' });
  assert.deepEqual(database.materials, stock);
  assert.deepEqual(database.products, products);
  assert.equal(taskProgress(database.productions[1]).percent, 25);
  assert.throws(() => execute(database, { type: 'complete', id: 'OP-002' }), /Finalize todas as etapas/);
  database = finishStages(database, 'OP-002');
  assert.deepEqual(database.materials, stock);
  assert.deepEqual(database.products, products);
  database = execute(database, { type: 'complete', id: 'OP-002' });
  assert.equal(database.products[1].stock, products[1].stock + 20);
  assert.throws(() => execute(database, { type: 'task-move', id: 'OP-002', taskId: tasks[0].id, status: 'todo' }), /Ordens encerradas/);
});

test('etapas de uma OP não alteram outra; bloqueia avanço antes de iniciar e após cancelar', () => {
  let database = freshData();
  const plannedTask = productionTasks(database.productions[3])[0];
  assert.throws(() => execute(database, { type: 'task-move', id: 'OP-004', taskId: plannedTask.id, status: 'doing' }), /Inicie a OP/);
  const originalOther = structuredClone(database.productions[0]);
  const task = productionTasks(database.productions[1])[0];
  database = execute(database, { type: 'task-move', id: 'OP-002', taskId: task.id, status: 'doing' });
  assert.deepEqual(database.productions[0], originalOther);
  assert.throws(() => execute(database, { type: 'task-move', id: 'OP-002', taskId: 'ETAPA-INEXISTENTE', status: 'done' }), /não encontrada/);
  database = execute(database, { type: 'cancel', id: 'OP-002', reason: 'Falha', materials: 'A conferir', products: 'A conferir' });
  assert.throws(() => execute(database, { type: 'task-move', id: 'OP-002', taskId: task.id, status: 'done' }), /Ordens encerradas/);
});

test('etapas novas validam produto e título, preservam registros antigos e não são perdidas ao editar pedido', () => {
  let database = freshData();
  assert.equal(database.productions[0].tasks, undefined);
  assert.equal(productionTasks(database.productions[0]).length, 9);
  assert.equal(taskProgress(database.productions[2]).percent, 100);
  assert.throws(() => execute(database, { type: 'task-add', id: 'OP-001', productId: 'PRD-003', title: 'Fazer recheio' }), /produto desta OP/);
  assert.throws(() => execute(database, { type: 'task-add', id: 'OP-001', productId: 'PRD-001', title: '  ' }), /título/);
  database = execute(database, { type: 'task-add', id: 'OP-001', productId: 'PRD-001', title: 'Conferir apresentação' });
  database = execute(database, { type: 'order', id: 'PED-001', customerId: 'CLI-001', delivery: today(), items: database.orders[0].items });
  assert.ok(productionTasks(database.productions[0]).some(task => task.title === 'Conferir apresentação'));
  const addedTask = productionTasks(database.productions[0]).find(task => task.title === 'Conferir apresentação')!;
  database = execute(database, { type: 'task-remove', id: 'OP-001', taskId: addedTask.id });
  assert.equal(productionTasks(database.productions[0]).length, 9);
  assert.equal(database.orders.length, 3);
  assert.equal(database.purchases.length, 1);
});

test('conclusão multiproduto exige etapas de todos os produtos, mesmo com filtro de interface', () => {
  let database = execute(freshData(), { type: 'receive', id: 'CMP-001' });
  database = execute(database, { type: 'start', id: 'OP-001' });
  for (const task of productionTasks(database.productions[0]).filter(entry => entry.productId === 'PRD-001')) database = execute(database, { type: 'task-move', id: 'OP-001', taskId: task.id, status: 'done' });
  assert.equal(taskProgress(database.productions[0]).done, 5);
  assert.throws(() => execute(database, { type: 'complete', id: 'OP-001' }), /Finalize todas as etapas/);
  database = finishStages(database, 'OP-001');
  database = execute(database, { type: 'complete', id: 'OP-001' });
  assert.equal(database.productions[0].status, 'completed');
  assert.equal(database.products[0].stock, 58);
  assert.equal(database.products[1].stock, 44);
});
