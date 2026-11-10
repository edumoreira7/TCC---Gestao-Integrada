import { ArrowUpRight, BookOpen, Boxes, ChevronDown, CircleHelp, ClipboardList, Factory, LayoutDashboard, Leaf, Package, PackageCheck, ShoppingBag, ShoppingCart, SlidersHorizontal, Truck, Users, UsersRound, Wallet, Warehouse } from 'lucide-react';

const navigation = [
  { section: 'VISÃO GERAL', items: [{ id: 'dashboard', name: 'Visão geral', icon: LayoutDashboard }] },
  { section: 'OPERAÇÃO', items: [{ id: 'orders', name: 'Pedidos', icon: ShoppingBag }, { id: 'productions', name: 'Ordens de produção', icon: ClipboardList }, { id: 'pcp', name: 'Planejamento · PCP', icon: SlidersHorizontal }, { id: 'production', name: 'Quadro de produção', icon: Factory }, { id: 'shipments', name: 'Expedição', icon: Truck }] },
  { section: 'SUPRIMENTOS & ESTOQUE', items: [{ id: 'purchases', name: 'Compras', icon: ShoppingCart }, { id: 'receipts', name: 'Recebimentos', icon: PackageCheck }, { id: 'materials', name: 'Insumos', icon: Boxes }, { id: 'products', name: 'Produtos acabados', icon: Package }, { id: 'recipes', name: 'Fichas técnicas', icon: BookOpen }] },
  { section: 'GESTÃO', items: [{ id: 'customers', name: 'Clientes', icon: Users }, { id: 'suppliers', name: 'Fornecedores', icon: Warehouse }, { id: 'finance', name: 'Custos e preços', icon: Wallet }, { id: 'users', name: 'Usuários e perfis', icon: UsersRound }] },
];

export function Sidebar({ page, navigate, waiting, open }: { page: string; navigate: (page: string) => void; waiting: number; open: boolean }) {
  return <aside className={`sidebar ${open ? 'open' : ''}`}>
    <button className="brand" onClick={() => navigate('dashboard')}><span className="brand-symbol"><Boxes size={25}/></span><span>integra<span className="brand-dot">.</span><small>ESTOQUE & PRODUÇÃO</small></span></button>
    <div className="workspace"><span className="workspace-icon"><Leaf size={18}/></span><div><strong>Operação alimentícia</strong><small>Ambiente de demonstração</small></div><ChevronDown size={14}/></div>
    <nav aria-label="Menu principal">{navigation.map(group => <div className="nav-group" key={group.section}>
      <div className="nav-section">{group.section}</div>
      {group.items.map(item => <button className={`nav-link ${page === item.id ? 'active' : ''}`} key={item.id} aria-current={page === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}><item.icon size={18}/><span>{item.name}</span>{item.id === 'pcp' && waiting > 0 && <small>{waiting}</small>}</button>)}
    </div>)}</nav>
    <div className="sidebar-bottom"><button className={`nav-link ${page === 'guide' ? 'active' : ''}`} onClick={() => navigate('guide')}><CircleHelp size={18}/><span>Roteiro e decisões</span><ArrowUpRight size={14}/></button><div className="demo-label"><span/>PROTÓTIPO · TCC 2026</div></div>
  </aside>;
}
