import { differenceInDays, format } from 'date-fns';
import type { ImportFolder, TimelineEvent } from '../lib/types';

export function FolderTimeline({ folder }: { folder: ImportFolder | null }) {
  if (!folder) return null;
  const total = differenceInDays(new Date(folder.estimated_close_date), new Date(folder.start_date));
  const elapsed = differenceInDays(new Date(), new Date(folder.start_date));
  const remaining = Math.max(0, total - elapsed);
  const pct = folder.status === 'cerrado' ? 100 : Math.min(100, Math.round((elapsed / total) * 100));
  const barColor = folder.status === 'cerrado'
    ? 'bg-slate-500'
    : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500';
  const glowColor = folder.status === 'cerrado'
    ? 'shadow-[0_0_14px_rgba(148,163,184,0.15)]'
    : pct > 80
      ? 'shadow-[0_0_14px_rgba(245,158,11,0.2)]'
      : 'shadow-[0_0_18px_rgba(52,211,153,0.2)]';

  return (
    <div className="rounded-xl glass shimmer relative overflow-hidden p-5 space-y-3.5">
      <div className="flex justify-between text-sm text-muted-foreground/75 font-medium">
        <span>{format(new Date(folder.start_date), 'dd/MM/yy')}</span>
        <span className="font-bold text-foreground/90 text-base">{pct}%</span>
        <span>{format(new Date(folder.estimated_close_date), 'dd/MM/yy')}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className={`h-full ${barColor} ${glowColor} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {folder.status !== 'cerrado' && (
        <div className="flex justify-between text-[11px] uppercase tracking-wider text-muted-foreground/55 font-semibold">
          <span>{elapsed} días transcurridos</span>
          <span>{remaining} días restantes</span>
        </div>
      )}
      {folder.timeline_events && folder.timeline_events.length > 0 && (
        <div className="pt-3 space-y-2 border-t border-border/35">
          {folder.timeline_events.slice(-5).map((ev: TimelineEvent, i: number) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                ev.status === 'completado'
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                  : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
              }`} />
              <span className="text-muted-foreground/65 font-mono text-xs w-[5.5rem] flex-shrink-0">{ev.date}</span>
              <span className="text-foreground/85">{ev.event}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
