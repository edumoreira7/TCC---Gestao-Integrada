import type { Item, Production, ProductionTask, TaskStatus } from './types.ts';

const templates: Record<string, string[]> = {
  'PRD-001': ['Separar e pesar insumos', 'Preparar a massa', 'Modelar e fermentar', 'Assar os pães', 'Resfriar e conferir'],
  'PRD-002': ['Separar e pesar insumos', 'Preparar a massa de brownie', 'Assar os brownies', 'Resfriar, cortar e conferir'],
  'PRD-003': ['Separar e pesar insumos', 'Preparar a massa do bolo', 'Assar o bolo', 'Resfriar e finalizar'],
};

export const taskColumns: { id: TaskStatus; label: string; description: string }[] = [
  { id: 'todo', label: 'A fazer', description: 'Etapas que ainda vão começar' },
  { id: 'doing', label: 'Em andamento', description: 'O que está sendo feito agora' },
  { id: 'done', label: 'Concluído', description: 'Etapas já finalizadas' },
];

export function createTasks(items: Item[], status: TaskStatus = 'todo'): ProductionTask[] {
  return items.flatMap(item => (templates[item.productId] ?? ['Separar insumos', 'Preparar o produto', 'Finalizar e conferir']).map((title, index) => ({ id: `${item.productId}-etapa-${index + 1}`, productId: item.productId, title, status })));
}

export function productionTasks(production: Production): ProductionTask[] {
  return production.tasks ?? createTasks(production.items, production.status === 'completed' ? 'done' : 'todo');
}

export function taskProgress(production: Production) {
  const tasks = productionTasks(production);
  const done = tasks.filter(task => task.status === 'done').length;
  return { total: tasks.length, done, percent: tasks.length ? Math.round(done / tasks.length * 100) : 0, ready: tasks.length > 0 && done === tasks.length };
}
