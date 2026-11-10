import type { Database, Profile } from './types.ts';

export const profiles: Profile[] = ['Comercial', 'PCP', 'Compras', 'Estoque', 'Produção', 'Expedição', 'Financeiro', 'Administrador'];
export const initialData: Database = {
  version: 1,
  customers: [
    { id: 'CLI-001', name: 'Café da Vila', document: '12.345.678/0001-90', email: 'contato@cafedavila.example', phone: '(11) 4000-1001', active: true },
    { id: 'CLI-002', name: 'Mercado Aurora', document: '23.456.789/0001-01', email: 'compras@aurora.example', phone: '(11) 4000-1002', active: true },
    { id: 'CLI-003', name: 'Empório da Serra', document: '34.567.890/0001-12', email: 'ola@serra.example', phone: '(11) 4000-1003', active: true },
    { id: 'CLI-004', name: 'Bistrô Jardim', document: '45.678.901/0001-23', email: 'contato@jardim.example', phone: '(11) 4000-1004', active: false },
  ],
  suppliers: [
    { id: 'FOR-001', name: 'Distribuidora Boa Safra', document: '51.111.111/0001-10', email: 'vendas@boasafra.example', phone: '(11) 4000-2001', active: true },
    { id: 'FOR-002', name: 'Laticínios Campo Verde', document: '52.222.222/0001-20', email: 'vendas@campo.example', phone: '(11) 4000-2002', active: true },
  ],
  materials: [
    { id: 'INS-001', name: 'Farinha de trigo', unit: 'kg', stock: 2, minimum: 5, lastPrice: 6.1 },
    { id: 'INS-002', name: 'Açúcar refinado', unit: 'kg', stock: 12, minimum: 4, lastPrice: 4.2 },
    { id: 'INS-003', name: 'Manteiga', unit: 'kg', stock: 8, minimum: 2, lastPrice: 32 },
    { id: 'INS-004', name: 'Chocolate meio amargo', unit: 'kg', stock: 6, minimum: 2, lastPrice: 38 },
    { id: 'INS-005', name: 'Ovos', unit: 'un', stock: 120, minimum: 30, lastPrice: 0.85 },
    { id: 'INS-006', name: 'Fermento biológico', unit: 'kg', stock: 0.8, minimum: 1, lastPrice: 29 },
    { id: 'INS-007', name: 'Leite integral', unit: 'L', stock: 15, minimum: 5, lastPrice: 5.2 },
  ],
  products: [
    { id: 'PRD-001', name: 'Pão artesanal', category: 'Panificação', unit: 'un', stock: 18, price: 12 },
    { id: 'PRD-002', name: 'Brownie de chocolate', category: 'Confeitaria', unit: 'un', stock: 24, price: 9.5 },
    { id: 'PRD-003', name: 'Bolo de manteiga', category: 'Confeitaria', unit: 'un', stock: 6, price: 28 },
  ],
  recipes: [
    { productId: 'PRD-001', yield: 10, ingredients: [{ materialId: 'INS-001', quantity: 2 }, { materialId: 'INS-003', quantity: 0.1 }, { materialId: 'INS-006', quantity: 0.04 }, { materialId: 'INS-007', quantity: 0.8 }] },
    { productId: 'PRD-002', yield: 20, ingredients: [{ materialId: 'INS-001', quantity: 0.5 }, { materialId: 'INS-002', quantity: 0.8 }, { materialId: 'INS-003', quantity: 0.4 }, { materialId: 'INS-004', quantity: 0.8 }, { materialId: 'INS-005', quantity: 6 }] },
    { productId: 'PRD-003', yield: 4, ingredients: [{ materialId: 'INS-001', quantity: 1 }, { materialId: 'INS-002', quantity: 0.6 }, { materialId: 'INS-003', quantity: 0.5 }, { materialId: 'INS-005', quantity: 8 }, { materialId: 'INS-007', quantity: 0.5 }] },
  ],
  orders: [
    { id: 'PED-001', customerId: 'CLI-001', date: '2026-10-26', delivery: '2026-10-28', items: [{ productId: 'PRD-001', quantity: 40, price: 12 }, { productId: 'PRD-002', quantity: 20, price: 9.5 }], shipped: false },
    { id: 'PED-002', customerId: 'CLI-002', date: '2026-10-25', delivery: '2026-10-27', items: [{ productId: 'PRD-002', quantity: 20, price: 9.5 }], shipped: false },
    { id: 'PED-003', customerId: 'CLI-003', date: '2026-10-24', delivery: '2026-10-26', items: [{ productId: 'PRD-003', quantity: 4, price: 28 }], shipped: false },
  ],
  productions: [
    { id: 'OP-001', orderId: 'PED-001', date: '2026-10-26', items: [{ productId: 'PRD-001', quantity: 40, price: 12 }, { productId: 'PRD-002', quantity: 20, price: 9.5 }], status: 'planned', notes: '' },
    { id: 'OP-002', orderId: 'PED-002', date: '2026-10-25', items: [{ productId: 'PRD-002', quantity: 20, price: 9.5 }], status: 'running', startedAt: '2026-10-26T09:00:00-03:00', notes: 'Preparação e pesagem concluídas.' },
    { id: 'OP-003', orderId: 'PED-003', date: '2026-10-24', items: [{ productId: 'PRD-003', quantity: 4, price: 28 }], status: 'completed', startedAt: '2026-10-25T09:00:00-03:00', completedAt: '2026-10-25T11:00:00-03:00', notes: 'Produção finalizada e conferida.' },
    { id: 'OP-004', date: '2026-10-26', items: [{ productId: 'PRD-003', quantity: 4, price: 28 }], status: 'planned', notes: 'Reposição de estoque.' },
  ],
  purchases: [{ id: 'CMP-001', supplierId: 'FOR-001', date: '2026-10-26', items: [{ materialId: 'INS-001', quantity: 20, price: 6.1 }, { materialId: 'INS-006', quantity: 1, price: 29 }], received: false }],
  movements: [
    { id: 'MOV-001', date: '2026-10-25T11:00:00-03:00', reference: 'OP-003', entityId: 'PRD-003', kind: 'produto', quantity: 4, description: 'Conclusão de produção' },
    ...[{ id: 'INS-001', quantity: 1 }, { id: 'INS-002', quantity: 0.6 }, { id: 'INS-003', quantity: 0.5 }, { id: 'INS-005', quantity: 8 }, { id: 'INS-007', quantity: 0.5 }].map((item, index) => ({ id: `MOV-00${index + 2}`, date: '2026-10-25T11:00:00-03:00', reference: 'OP-003', entityId: item.id, kind: 'insumo' as const, quantity: -item.quantity, description: 'Consumo da produção' })),
  ],
  shipments: [],
  users: [
    { id: 'USR-001', name: 'Eduardo Moreira', email: 'eduardo@integra.example', profiles: ['Administrador', 'PCP', 'Comercial'], active: true },
    { id: 'USR-002', name: 'Gabriel Silva', email: 'gabriel@integra.example', profiles: ['Compras', 'Estoque', 'Financeiro'], active: true },
    { id: 'USR-003', name: 'David Batista', email: 'david@integra.example', profiles: ['Produção', 'Expedição'], active: true },
  ],
};

export const freshData = (): Database => structuredClone(initialData);
