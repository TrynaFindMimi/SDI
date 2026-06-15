import { useAuth } from '../lib/auth';
import { useFolders } from '../hooks/useData';
import { Badge } from './ui';
import { Ship, LogOut, ChevronRight } from 'lucide-react';

export function AppHeader({ activeFolderId }: { activeFolderId: string | null }) {
  const { user, logout } = useAuth();
  const { folders } = useFolders();
  const activeFolder = folders.find(f => f.id === activeFolderId);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/40 glass" style={{ backdropFilter: 'blur(20px) saturate(200%)' }}>
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/18 border border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent" />
            <Ship size={19} className="text-primary relative z-10" />
          </div>
          <span className="font-bold text-[17px] tracking-tight text-foreground/95">LogiCost Pro</span>
          {activeFolder && (
            <div className="hidden sm:flex items-center gap-2.5 ml-3 pl-3 border-l border-border/50 text-sm">
              <span className="font-mono text-sm text-foreground/75 bg-secondary/60 px-2.5 py-1 rounded-lg font-medium">{activeFolder.folder_number}</span>
              <ChevronRight size={13} className="text-muted-foreground/35" />
              <Badge variant={activeFolder.status === 'en_proceso' ? 'warning' : 'success'}>
                {activeFolder.status === 'en_proceso' ? 'En Proceso' : 'Cerrado'}
              </Badge>
            </div>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-5">
            <div className="text-right leading-tight hidden sm:block">
              <div className="font-medium text-[15px] text-foreground/90">{user.name}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">{user.role}</div>
            </div>
            <button onClick={logout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground/65 hover:text-foreground/80 transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04] font-medium">
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
