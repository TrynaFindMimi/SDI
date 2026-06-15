import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useFolders } from '../../hooks/useData';
import { ImportFolder } from '../../lib/entities';
import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle, Label } from '../ui';
import { formatDate } from '../../lib/utils';
import { Plus, Trash2, FolderOpen, CheckCircle2, Settings } from 'lucide-react';
import type { ImportFolder as IF } from '../../lib/types';

export function FoldersTab({
  activeFolderId, onSelectFolder, onRefresh,
}: {
  activeFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onRefresh: () => void;
}) {
  const { isAdmin } = useAuth();
  const { folders, loading, refresh } = useFolders();
  const [showCreate, setShowCreate] = useState(false);
  const [newFolder, setNewFolder] = useState({ supplier: '', notes: '' });
  const [editFolder, setEditFolder] = useState<IF | null>(null);
  const activeFolder = folders.find(f => f.id === activeFolderId);

  const activeFolders = folders.filter(f => f.status === 'en_proceso');
  const closedFolders = folders.filter(f => f.status === 'cerrado');

  const generateNumber = async () => {
    const all = await ImportFolder.list<IF>();
    const year = new Date().getFullYear().toString().slice(-2);
    const nums = all
      .filter(f => f.folder_number?.startsWith(year))
      .map(f => parseInt(f.folder_number.slice(-4)))
      .filter(n => !isNaN(n));
    const next = (Math.max(0, ...nums) + 1).toString().padStart(4, '0');
    return `${year}CT${next}`;
  };

  const handleCreate = async () => {
    const folder_num = await generateNumber();
    const now = new Date().toISOString().split('T')[0];
    const est = new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0];
    await ImportFolder.create({
      folder_number: folder_num,
      status: 'en_proceso',
      start_date: now,
      estimated_close_date: est,
      supplier: newFolder.supplier,
      broker: '', invoice_numbers: '', incoterm: 'FOB',
      transport_mode: 'Marítima', exchange_rate: 6.96, default_margin: 30,
      international_freight: 0, international_insurance: 0,
      notes: newFolder.notes,
      timeline_events: [{ date: now, event: 'Importación creada', status: 'completado' }],
      created_date: now,
    } as any);
    setShowCreate(false);
    setNewFolder({ supplier: '', notes: '' });
    await refresh();
    onRefresh();
  };

  const handleUpdate = async () => {
    if (!editFolder) return;
    await ImportFolder.update(editFolder.id!, {
      start_date: editFolder.start_date,
      estimated_close_date: editFolder.estimated_close_date,
      notes: editFolder.notes,
    });
    setEditFolder(null);
    await refresh();
    onRefresh();
  };

  const handleClose = async (f: IF) => {
    const now = new Date().toISOString().split('T')[0];
    await ImportFolder.update(f.id!, {
      status: 'cerrado',
      close_date: now,
      timeline_events: [...(f.timeline_events || []), { date: now, event: 'Importación cerrada', status: 'completado' }],
    });
    await refresh();
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta carpeta y todos sus datos?')) return;
    await ImportFolder.delete(id);
    if (activeFolderId === id) onSelectFolder(null);
    await refresh();
    onRefresh();
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <p className="text-base text-muted-foreground/60 animate-pulse font-medium">Cargando...</p>
    </div>
  );

  return (
    <div className="space-y-7">
      {isAdmin && !showCreate && (
        <div className="flex items-center justify-between">
          <p className="text-[15px] text-muted-foreground/65 font-medium">
            {activeFolders.length} en proceso · {closedFolders.length} cerradas
          </p>
          <Button onClick={() => setShowCreate(true)} size="sm">
            <Plus size={16} /> Nueva Carpeta
          </Button>
        </div>
      )}

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Carpeta de Importación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Proveedor / Exportador</Label>
              <Input value={newFolder.supplier} onChange={e => setNewFolder(p => ({ ...p, supplier: e.target.value }))} placeholder="Nombre del proveedor" />
            </div>
            <div>
              <Label>Notas</Label>
              <Textarea value={newFolder.notes} onChange={e => setNewFolder(p => ({ ...p, notes: e.target.value }))} placeholder="Notas iniciales" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate}>Crear Carpeta</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeFolders.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
              <CardTitle>En Proceso</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/35 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                  <th className="text-left p-3.5">N° Carpeta</th>
                  <th className="text-left p-3.5">Proveedor</th>
                  <th className="text-left p-3.5 hidden md:table-cell">Inicio</th>
                  <th className="text-left p-3.5 hidden md:table-cell">Est. Llegada</th>
                  <th className="text-right p-3.5">Acción</th>
                </tr>
              </thead>
              <tbody>
                {activeFolders.map(f => (
                  <tr key={f.id} className={`border-b border-border/20 last:border-0 transition-all duration-150 ${activeFolderId === f.id ? 'bg-primary/[0.06]' : 'hover:bg-white/[0.02]'}`}>
                    <td className="p-3.5 font-mono text-sm text-foreground/80 font-medium">{f.folder_number}</td>
                    <td className="p-3.5 font-semibold text-foreground/90">{f.supplier || '—'}</td>
                    <td className="p-3.5 text-muted-foreground/65 hidden md:table-cell text-sm">{formatDate(f.start_date)}</td>
                    <td className="p-3.5 text-muted-foreground/65 hidden md:table-cell text-sm">{formatDate(f.estimated_close_date)}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant={activeFolderId === f.id ? 'default' : 'outline'} onClick={() => onSelectFolder(f.id!)}>
                          <FolderOpen size={15} /> {activeFolderId === f.id ? 'Activa' : 'Cargar'}
                        </Button>
                        {isAdmin && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => setEditFolder(f)}>
                              <Settings size={15} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400/70 hover:text-red-400" onClick={() => handleDelete(f.id!)}>
                              <Trash2 size={15} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {closedFolders.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-[0_0_8px_rgba(148,163,184,0.15)]" />
              <CardTitle>Cerradas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/35 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                  <th className="text-left p-3.5">N° Carpeta</th>
                  <th className="text-left p-3.5">Proveedor</th>
                  <th className="text-left p-3.5 hidden md:table-cell">Inicio</th>
                  <th className="text-left p-3.5 hidden md:table-cell">Cierre</th>
                  <th className="text-right p-3.5">Acción</th>
                </tr>
              </thead>
              <tbody>
                {closedFolders.map(f => (
                  <tr key={f.id} className="border-b border-border/20 last:border-0 hover:bg-white/[0.02] transition-all duration-150 opacity-80">
                    <td className="p-3.5 font-mono text-sm text-foreground/60">{f.folder_number}</td>
                    <td className="p-3.5 text-foreground/70 font-medium">{f.supplier || '—'}</td>
                    <td className="p-3.5 text-muted-foreground/60 hidden md:table-cell text-sm">{formatDate(f.start_date)}</td>
                    <td className="p-3.5 text-muted-foreground/60 hidden md:table-cell text-sm">{f.close_date ? formatDate(f.close_date) : '—'}</td>
                    <td className="p-3.5 text-right">
                      <Button size="sm" variant="outline" onClick={() => onSelectFolder(f.id!)}>
                        <FolderOpen size={15} /> Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {editFolder && (
        <Card>
          <CardHeader><CardTitle>Editar Carpeta</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha de Inicio</Label>
                <Input type="date" value={editFolder.start_date} onChange={e => setEditFolder(f => f ? { ...f, start_date: e.target.value } : null)} />
              </div>
              <div>
                <Label>Fecha Est. Llegada</Label>
                <Input type="date" value={editFolder.estimated_close_date} onChange={e => setEditFolder(f => f ? { ...f, estimated_close_date: e.target.value } : null)} />
              </div>
            </div>
            <div>
              <Label>Notas</Label>
              <Textarea value={editFolder.notes} onChange={e => setEditFolder(f => f ? { ...f, notes: e.target.value } : null)} />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleUpdate}>Guardar Cambios</Button>
              {editFolder.status === 'en_proceso' && (
                <Button variant="destructive" onClick={() => { handleClose(editFolder); setEditFolder(null); }}>
                  <CheckCircle2 size={15} /> Cerrar Importación
                </Button>
              )}
              <Button variant="ghost" onClick={() => setEditFolder(null)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeFolder && (
        <div className="text-sm text-muted-foreground/60 text-center font-medium">
          Carpeta activa: <span className="font-mono font-semibold text-foreground/75">{activeFolder.folder_number}</span>
        </div>
      )}
    </div>
  );
}
