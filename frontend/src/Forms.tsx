import { useState } from 'react';
import { Plus, Trash2, ArrowRight, Check } from 'lucide-react';
import type { Database, Item, Partner, Production, Purchase, User } from './types.ts';
import { profiles } from './data.ts';
import { today, total, type Command } from './domain.ts';
import { Button, Field, money, Notice, number } from './ui.tsx';

export type FormKind = { type: 'customer' | 'supplier'; partner?: Partner } | { type: 'order'; id?: string } | { type: 'manual' } | { type: 'purchase' } | { type: 'receive'; purchase: Purchase } | { type: 'cancel'; production: Production } | { type: 'notes'; production: Production } | { type: 'ship'; orderId: string } | { type: 'price'; productId: string } | { type: 'profiles'; user: User };
type Props = { database: Database; kind: FormKind; submit: (command: Command) => void; close: () => void };

export function OperationForm({ database, kind, submit, close }: Props) {
  const order = kind.type === 'order' ? database.orders.find(entry => entry.id === kind.id) : undefined;
  const partner = kind.type === 'customer' || kind.type === 'supplier' ? kind.partner : undefined;
  const [name, setName] = useState(partner?.name ?? '');
  const [document, setDocument] = useState(partner?.document ?? '');
  const [email, setEmail] = useState(partner?.email ?? '');
  const [phone, setPhone] = useState(partner?.phone ?? '');
  const [active, setActive] = useState(partner?.active ?? true);
  const [customerId, setCustomerId] = useState(order?.customerId ?? database.customers.find(entry => entry.active)?.id ?? '');
  const [supplierId, setSupplierId] = useState(database.suppliers.find(entry => entry.active)?.id ?? '');
  const [operationDate, setOperationDate] = useState(order?.delivery && order.delivery >= today() ? order.delivery : today());
  const [items, setItems] = useState<Item[]>(order ? structuredClone(order.items) : [{ productId: database.products[0].id, quantity: 10, price: database.products[0].price }]);
  const [purchaseItems, setPurchaseItems] = useState<Purchase['items']>([{ materialId: database.materials[0].id, quantity: 20, price: database.materials[0].lastPrice ?? 1 }]);
  const [notes, setNotes] = useState(kind.type === 'notes' ? kind.production.notes : '');
  const [reason, setReason] = useState('');
  const [materials, setMaterials] = useState('');
  const [products, setProducts] = useState('');
  const shipmentOrder = kind.type === 'ship' ? database.orders.find(entry => entry.id === kind.orderId) : undefined;
  const [recipient, setRecipient] = useState(database.customers.find(entry => entry.id === shipmentOrder?.customerId)?.name ?? '');
  const [price, setPrice] = useState(kind.type === 'price' ? database.products.find(entry => entry.id === kind.productId)!.price : 0);
  const [selectedProfiles, setSelectedProfiles] = useState(kind.type === 'profiles' ? kind.user.profiles : []);
  const [confirmed, setConfirmed] = useState(false);

  const updateItem = (index: number, changes: Partial<Item>) => setItems(previous => previous.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));
  const updatePurchase = (index: number, changes: Partial<Purchase['items'][number]>) => setPurchaseItems(previous => previous.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));

  function save() {
    if (kind.type === 'customer' || kind.type === 'supplier') submit({ type: 'partner', collection: kind.type === 'customer' ? 'customers' : 'suppliers', partner: { id: partner?.id ?? '', name: name.trim(), document: document.trim(), email: email.trim(), phone: phone.trim(), active } });
    if (kind.type === 'order') submit({ type: 'order', id: kind.id, customerId, delivery: operationDate, items });
    if (kind.type === 'manual') submit({ type: 'manual', items, notes });
    if (kind.type === 'purchase') submit({ type: 'purchase', supplierId, date: operationDate, items: purchaseItems });
    if (kind.type === 'receive' && confirmed) submit({ type: 'receive', id: kind.purchase.id });
    if (kind.type === 'cancel') submit({ type: 'cancel', id: kind.production.id, reason, materials, products });
    if (kind.type === 'notes') submit({ type: 'notes', id: kind.production.id, notes });
    if (kind.type === 'ship' && confirmed) submit({ type: 'ship', orderId: kind.orderId, recipient });
    if (kind.type === 'price') submit({ type: 'price', productId: kind.productId, price });
    if (kind.type === 'profiles') submit({ type: 'profiles', userId: kind.user.id, profiles: selectedProfiles });
  }

  return <form onSubmit={event => { event.preventDefault(); save(); }}>
    <div className="form-body">
      {(kind.type === 'customer' || kind.type === 'supplier') && <div className="form-grid">
        <Field label="Nome / razão social *" wide><input required value={name} onChange={event => setName(event.target.value)}/></Field>
        <Field label="CPF / CNPJ (demonstração)"><input value={document} onChange={event => setDocument(event.target.value)}/></Field>
        <Field label="Telefone"><input value={phone} onChange={event => setPhone(event.target.value)}/></Field>
        <Field label="E-mail *" wide><input type="email" required value={email} onChange={event => setEmail(event.target.value)}/></Field>
        <label className="check"><input type="checkbox" checked={active} onChange={event => setActive(event.target.checked)}/> Cadastro ativo</label>
        <Notice>O cadastro preserva o histórico. Clientes e fornecedores não acessam o sistema.</Notice>
      </div>}
      {(kind.type === 'order' || kind.type === 'manual') && <>
        {kind.type === 'order' && <div className="form-grid"><Field label="Cliente *"><select required value={customerId} onChange={event => setCustomerId(event.target.value)}><option value="">Selecione</option>{database.customers.filter(entry => entry.active).map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></Field><Field label="Previsão de entrega *"><input type="date" required min={today()} value={operationDate} onChange={event => setOperationDate(event.target.value)}/></Field></div>}
        <h3>Produtos e quantidades</h3>
        <div className="line-labels"><span>Produto</span><span>Quantidade</span><span>{kind.type === 'order' ? 'Preço unitário' : 'Unidade'}</span><span/></div>
        {items.map((item, index) => <div className="item-line" key={index}>
          <select aria-label={`Produto ${index + 1}`} value={item.productId} onChange={event => { const product = database.products.find(entry => entry.id === event.target.value)!; updateItem(index, { productId: product.id, price: product.price }); }}>{database.products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select>
          <input aria-label={`Quantidade do produto ${index + 1}`} type="number" min="1" step="1" required value={item.quantity} onChange={event => updateItem(index, { quantity: Number(event.target.value) })}/>
          {kind.type === 'order' ? <input aria-label={`Preço do produto ${index + 1}`} type="number" min="0" step="0.01" required value={item.price} onChange={event => updateItem(index, { price: Number(event.target.value) })}/> : <span>un</span>}
          <button className="icon-button" type="button" aria-label={`Remover produto ${index + 1}`} disabled={items.length === 1} onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={16}/></button>
        </div>)}
        <Button secondary disabled={items.length >= database.products.length} onClick={() => { const product = database.products.find(entry => !items.some(item => item.productId === entry.id)); if (product) setItems([...items, { productId: product.id, quantity: 10, price: product.price }]); }}><Plus size={16}/>Adicionar produto</Button>
        {kind.type === 'order' ? <><div className="form-total"><span>Total do pedido</span><strong>{money(total(items))}</strong></div><Notice>{kind.id ? 'A OP existente e suas necessidades serão atualizadas junto com este pedido.' : 'Ao registrar, uma única ordem de produção será criada automaticamente com todos os produtos.'}</Notice></> : <Field label="Observações"><textarea value={notes} onChange={event => setNotes(event.target.value)}/></Field>}
      </>}
      {kind.type === 'purchase' && <>
        <div className="form-grid"><Field label="Fornecedor *"><select required value={supplierId} onChange={event => setSupplierId(event.target.value)}><option value="">Selecione</option>{database.suppliers.filter(entry => entry.active).map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></Field><Field label="Data da compra *"><input type="date" required max={today()} value={operationDate} onChange={event => setOperationDate(event.target.value)}/></Field></div>
        <h3>Itens da compra</h3><div className="line-labels"><span>Insumo / unidade</span><span>Quantidade</span><span>Preço unitário</span><span/></div>
        {purchaseItems.map((item, index) => <div className="item-line" key={index}><select aria-label={`Insumo ${index + 1}`} value={item.materialId} onChange={event => { const material = database.materials.find(entry => entry.id === event.target.value)!; updatePurchase(index, { materialId: material.id, price: material.lastPrice ?? 1 }); }}>{database.materials.map(material => <option key={material.id} value={material.id}>{material.name} ({material.unit})</option>)}</select><input required aria-label={`Quantidade do insumo ${index + 1}`} type="number" min="0.001" step={database.materials.find(material => material.id === item.materialId)?.unit === 'un' ? '1' : '0.001'} value={item.quantity} onChange={event => updatePurchase(index, { quantity: Number(event.target.value) })}/><input required aria-label={`Preço do insumo ${index + 1}`} type="number" min="0.01" step="0.01" value={item.price} onChange={event => updatePurchase(index, { price: Number(event.target.value) })}/><button className="icon-button" type="button" aria-label={`Remover insumo ${index + 1}`} disabled={purchaseItems.length === 1} onClick={() => setPurchaseItems(purchaseItems.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={16}/></button></div>)}
        <Button secondary disabled={purchaseItems.length >= database.materials.length} onClick={() => { const material = database.materials.find(entry => !purchaseItems.some(item => item.materialId === entry.id)); if (material) setPurchaseItems([...purchaseItems, { materialId: material.id, quantity: 1, price: material.lastPrice ?? 1 }]); }}><Plus size={16}/>Adicionar insumo</Button><div className="form-total"><span>Valor da compra</span><strong>{money(total(purchaseItems))}</strong></div><Notice warning>Registrar a compra não altera o estoque. A entrada ocorre em Recebimentos.</Notice>
      </>}
      {kind.type === 'receive' && <><Notice>Confirme a conferência integral dos itens de {kind.purchase.id}. A entrada será registrada uma única vez.</Notice><div className="review-list">{kind.purchase.items.map(item => { const material = database.materials.find(entry => entry.id === item.materialId)!; return <div key={item.materialId}><span>{material.name}</span><strong>{number(item.quantity)} {material.unit}</strong></div>; })}</div><label className="check"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)}/> Conferi e recebi todos os itens.</label></>}
      {kind.type === 'cancel' && <><Notice warning>As movimentações de cancelamento estão em definição. Este registro não ajusta saldos; ficará sinalizado para reconciliação.</Notice><Field label="Motivo do cancelamento *"><textarea required value={reason} onChange={event => setReason(event.target.value)}/></Field><Field label="Situação dos insumos (consumo, sobra, perdas) *"><textarea required value={materials} onChange={event => setMaterials(event.target.value)}/></Field><Field label="Situação dos produtos (aproveitamento, perdas) *"><textarea required value={products} onChange={event => setProducts(event.target.value)}/></Field></>}
      {kind.type === 'notes' && <Field label="Acompanhamento da produção"><textarea rows={5} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Registre etapas realizadas e observações..."/></Field>}
      {kind.type === 'ship' && shipmentOrder && <><Field label="Destinatário *"><input required value={recipient} onChange={event => setRecipient(event.target.value)}/></Field><div className="review-list">{shipmentOrder.items.map(item => <div key={item.productId}><span>{database.products.find(entry => entry.id === item.productId)?.name}</span><strong>{number(item.quantity)} un</strong></div>)}</div><Notice>Expedição integral de {shipmentOrder.id}. Todos os produtos sairão do estoque na confirmação.</Notice><label className="check"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)}/> Conferi o destinatário e todos os produtos.</label></>}
      {kind.type === 'price' && <><Field label="Preço de venda por unidade (R$) *"><input type="number" min="0" step="0.01" required value={price} onChange={event => setPrice(Number(event.target.value))}/></Field><Notice>Preço informado manualmente. Pedidos já registrados mantêm seus preços históricos.</Notice></>}
      {kind.type === 'profiles' && <><Notice>Perfis acumuláveis de demonstração. A matriz definitiva de permissões será validada com o grupo.</Notice><div className="profile-options">{profiles.map(profile => <label className="check" key={profile}><input type="checkbox" checked={selectedProfiles.includes(profile)} onChange={event => setSelectedProfiles(event.target.checked ? [...selectedProfiles, profile] : selectedProfiles.filter(entry => entry !== profile))}/>{profile}</label>)}</div></>}
    </div>
    <footer className="modal-footer"><Button secondary onClick={close}>Voltar</Button><Button type="submit" danger={kind.type === 'cancel'} disabled={(kind.type === 'receive' || kind.type === 'ship') && !confirmed}>{kind.type === 'cancel' ? 'Registrar cancelamento' : kind.type === 'receive' ? 'Confirmar recebimento' : kind.type === 'ship' ? 'Confirmar expedição' : kind.type === 'order' && !kind.id ? 'Registrar pedido' : 'Salvar'}{kind.type === 'order' ? <ArrowRight size={16}/> : <Check size={16}/>}</Button></footer>
  </form>;
}
