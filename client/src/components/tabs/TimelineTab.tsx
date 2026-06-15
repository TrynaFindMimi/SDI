import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useFolders } from '../../hooks/useData';
import { ImportFolder } from '../../lib/entities';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Badge } from '../ui';
import { differenceInDays, format } from 'date-fns';
import { Clock } from 'lucide-react';

export function TimelineTab() {
  const { isAdmin } = useAuth();
  const { folders, refresh } = useFolders();
  const activeFolders = folders.filter(f => f.status === 'en_proceso');
  const closedFolders = folders.filter(f => f.status === 'cerrado');
  const [newEvent, setNewEvent] = useState<{ folderId: string; event: string }>({ folderId: '', event: '' });

  const addEvent = async () => {
    if (!newEvent.folderId || !newEvent.event) return;
    const folder = folders.find(f => f.id === newEvent.folderId);
    if (!folder) return;
    const events = [...(folder.timeline_events || []), { date: new Date().toISOString().split('T')[0], event: newEvent.event, status: 'pendiente' as const }];
    await ImportFolder.update(newEvent.folderId, { timeline_events: events });
    setNewEvent({ folderId: '', event: '' });
    await refresh();
  };

  return (
    <div className="space-y-7">
      {activeFolders.map(f => {
        const total = differenceInDays(new Date(f.estimated_close_date), new Date(f.start_date));
        const elapsed = differenceInDays(new Date(), new Date(f.start_date));
        const pct = Math.min(100, Math.round((elapsed / total) * 100));
        const barColor = pct > 80 ? 'bg-amber-500' : 'bg-emerald-500';
        const glowColor = pct > 80
          ? 'shadow-[0_0_14px_rgba(245,158,11,0.2)]'
          : 'shadow-[0_0_14px_rgba(52,211,153,0.2)]';
        return (
          <Card key={f.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-sm">{f.folder_number}</CardTitle>
                <Badge variant="warning">En Proceso</Badge>
              </div>
              <p className="text-sm text-muted-foreground/65 mt-1">{f.supplier || 'Sin proveedor'}</p>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="flex justify-between text-sm text-muted-foreground/70 font-medium">
                <span>{format(new Date(f.start_date), 'dd/MM/yy')}</span>
                <span className="font-bold text-foreground/85">{pct}%</span>
                <span>{format(new Date(f.estimated_close_date), 'dd/MM/yy')}</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div className={`h-full ${barColor} ${glowColor} transition-all duration-700 ease-out rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground/55 font-semibold uppercase tracking-wider">
                <span>{elapsed} días transcurridos</span>
                <span>{Math.max(0, total - elapsed)} días restantes</span>
              </div>
              {f.timeline_events && f.timeline_events.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/30">
                  {f.timeline_events.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        ev.status === 'completado'
                          ? 'bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.3)]'
                          : 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.3)]'
                      }`} />
                      <span className="text-muted-foreground/60 w-[5.5rem] flex-shrink-0 text-xs">{ev.date}</span>
                      <span className="text-foreground/80">{ev.event}</span>
                    </div>
                  ))}
                </div>
              )}
              {isAdmin && (
                <div className="flex gap-2 pt-1.5">
                  <Input
                    placeholder="Nuevo evento..."
                    value={newEvent.folderId === f.id ? newEvent.event : ''}
                    onChange={e => setNewEvent({ folderId: f.id!, event: e.target.value })}
                  />
                  <Button size="sm" onClick={addEvent} disabled={newEvent.folderId !== f.id || !newEvent.event}>
                    Agregar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {activeFolders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-muted-foreground/15 mb-4"><Clock size={56} /></div>
          <p className="text-base font-semibold text-muted-foreground/65">No hay importaciones en proceso</p>
          <p className="text-sm text-muted-foreground/40 mt-2">Las importaciones activas aparecerán aquí</p>
        </div>
      )}

      {closedFolders.length > 0 && (
        <div>
          <h3 className="text-[15px] font-semibold mb-3 text-muted-foreground/75">Importaciones Cerradas</h3>
          <div className="grid gap-2.5">
            {closedFolders.map(f => (
              <Card key={f.id} className="opacity-80">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-foreground/75 font-medium">{f.folder_number}</span>
                    <span className="text-sm text-muted-foreground/60">{f.supplier}</span>
                  </div>
                  <div className="text-sm text-muted-foreground/50">
                    {differenceInDays(new Date(f.close_date || f.estimated_close_date), new Date(f.start_date))} días
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
