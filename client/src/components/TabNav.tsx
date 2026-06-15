import { FolderOpen, FileText, Package, DollarSign, BarChart3, BookOpen, TrendingUp, Clock, Printer, Users } from 'lucide-react';
import { cn } from '../lib/utils';

const TABS = [
  { id: 'folders', label: 'Carpetas', icon: FolderOpen },
  { id: 'operation', label: 'Operación', icon: FileText },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'costs', label: 'Costos', icon: DollarSign },
  { id: 'summary', label: 'Resumen', icon: BarChart3 },
  { id: 'catalog', label: 'Catálogo', icon: BookOpen },
  { id: 'reports', label: 'Reportes', icon: TrendingUp },
  { id: 'timeline', label: 'Línea de Tiempo', icon: Clock },
  { id: 'print', label: 'Imprimir', icon: Printer },
  { id: 'users', label: 'Usuarios', icon: Users },
];

export function TabNav({
  activeTab, onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasUnsaved: boolean;
}) {
  return (
    <nav className="no-print sticky top-16 z-30 border-b border-border/30 bg-background/70 backdrop-blur-xl">
      <div className="flex overflow-x-auto gap-1 px-4 py-2.5 scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all duration-200',
              activeTab === id
                ? 'bg-primary/15 text-primary border border-primary/15 shadow-sm'
                : 'text-muted-foreground/65 hover:text-foreground/85 hover:bg-white/[0.04] border border-transparent'
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
