import type { ReactNode } from 'react';
import { ArrowUpRight, Inbox, X } from 'lucide-react';

export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const number = (value: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(value);
export const date = (value: string) => new Date(value.length === 10 ? `${value}T12:00:00` : value).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

export function Badge({ children }: { children: ReactNode }) {
  const label = String(children);
  const tone = /Cancelad|Inativ|Falta|baixo/.test(label) ? 'red' : /Aguardando|Pendente|reconciliação/.test(label) ? 'amber' : /produção|andamento/.test(label) ? 'blue' : 'green';
  return <span className={`badge ${tone}`}><span />{children}</span>;
}

export function Button({ children, onClick, secondary, danger, disabled, type = 'button', title }: { children: ReactNode; onClick?: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean; type?: 'button' | 'submit'; title?: string }) {
  return <button type={type} title={title} onClick={onClick} disabled={disabled} className={`button ${secondary ? 'secondary' : ''} ${danger ? 'danger' : ''}`}>{children}</button>;
}

export function Panel({ title, eyebrow, action, children }: { title: string; eyebrow?: string; action?: ReactNode; children: ReactNode }) {
  return <section className="panel"><div className="panel-head"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2></div>{action}</div>{children}</section>;
}

export function Table({ columns, rows, empty = 'Nenhum registro encontrado.' }: { columns: string[]; rows: ReactNode[][]; empty?: string }) {
  return <div className="table-scroll"><table><thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((cells, rowIndex) => <tr key={rowIndex}>{cells.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>{rows.length === 0 && <div className="empty"><Inbox size={30}/><p>{empty}</p></div>}</div>;
}

export function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={`field ${wide ? 'wide' : ''}`}><span>{label}</span>{children}</label>;
}

export function Notice({ children, warning = false }: { children: ReactNode; warning?: boolean }) {
  return <div className={`notice ${warning ? 'warning' : ''}`}>{children}</div>;
}

export function Modal({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={event => event.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">GESTÃO INTEGRADA</div><h2 id="modal-title">{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button type="button" autoFocus className="icon-button" aria-label="Fechar janela" onClick={onClose}><X size={21}/></button></div>{children}</section></div>;
}

export function Stat({ label, value, icon, detail, onClick, accent = false, tone = 'indigo' }: { label: string; value: number; icon: ReactNode; detail: string; onClick: () => void; accent?: boolean; tone?: 'indigo' | 'amber' | 'blue' | 'rose' | 'emerald' }) {
  return <button data-tone={tone} className={`stat ${accent ? 'accent' : ''}`} onClick={onClick}><div className="stat-top"><span className="stat-icon">{icon}</span><ArrowUpRight size={16}/></div><strong>{number(value)}</strong><span className="stat-label">{label}</span><small>{detail}</small></button>;
}
