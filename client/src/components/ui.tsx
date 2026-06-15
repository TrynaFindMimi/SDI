import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

/* ── Button ── */
const buttonVariants: Record<string, string> = {
  default: 'glass-btn text-primary-foreground font-semibold',
  secondary: 'bg-secondary/70 text-secondary-foreground hover:bg-secondary/90 border border-border/50 hover:border-border/70 shadow-sm font-medium',
  destructive: 'bg-destructive/80 text-destructive-foreground shadow-sm hover:bg-destructive border border-destructive/15 font-medium',
  ghost: 'hover:bg-white/6 text-muted-foreground hover:text-foreground font-medium',
  outline: 'border border-border/60 bg-transparent shadow-sm hover:bg-white/[0.05] hover:border-border hover:text-foreground font-medium',
  success: 'bg-emerald-600/35 text-emerald-200 border border-emerald-500/25 hover:bg-emerald-600/45 shadow-sm font-medium',
};

const buttonSizes: Record<string, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  default: 'h-10 px-5 py-2 text-sm gap-2',
  lg: 'h-12 px-7 text-[15px] gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'success'; size?: 'sm' | 'default' | 'lg' }>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg relative overflow-hidden',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'transition-all duration-200',
        'disabled:pointer-events-none disabled:opacity-30',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';

/* ── Input ── */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-border/60 glass-input px-3.5 py-2 text-sm transition-all duration-200',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground/40',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-30',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

/* ── Textarea ── */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-border/60 glass-input px-3.5 py-2.5 text-sm transition-all duration-200',
        'placeholder:text-muted-foreground/40',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-30',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

/* ── Select ── */
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-border/60 glass-input px-3.5 py-2 text-sm transition-all duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-30',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

/* ── Label ── */
export function Label({ className, children, ...props }: { className?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <label className={cn('text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block', className)} {...props}>
      {children}
    </label>
  );
}

/* ── Card ── */
export function Card({ className, children, ...props }: { className?: string; children: ReactNode; [key: string]: any }) {
  return (
    <div className={cn('rounded-xl glass shimmer relative overflow-hidden card-elevated', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h3 className={cn('text-[15px] font-semibold tracking-tight text-foreground/95', className)}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn('text-sm text-muted-foreground/75', className)}>{children}</p>;
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-5 pt-0', className)}>{children}</div>;
}

/* ── Badge ── */
const BADGE_VARIANTS: Record<string, string> = {
  default: 'bg-primary/20 text-primary border-primary/25',
  secondary: 'bg-white/8 text-foreground/75 border-white/8',
  destructive: 'bg-red-500/15 text-red-300 border-red-500/15',
  outline: 'text-foreground/70 border-border/60',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/15',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/15',
  info: 'bg-sky-500/15 text-sky-300 border-sky-500/15',
};

export function Badge({ className, children, variant = 'default' }: { className?: string; children: ReactNode; variant?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider',
      BADGE_VARIANTS[variant] || BADGE_VARIANTS.default,
      className
    )}>
      {children}
    </span>
  );
}

/* ── Dialog ── */
export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-2xl glass card-elevated p-6 animate-in-scale">
        {children}
      </div>
    </div>
  );
}

/* ── AlertDialog ── */
export function AlertDialog({ open, onClose, onConfirm, title, description }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl glass card-elevated p-6 animate-in-scale">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2.5 text-sm text-foreground/75">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }}>Continuar</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Separator ── */
export function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px bg-border/60', className)} />;
}

/* ── KpiCard ── */
export function KpiCard({
  label, value, subtitle, trend, className
}: {
  label: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}) {
  return (
    <Card className={cn('p-5', className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/65">{label}</p>
      <div className="flex items-baseline gap-2.5 mt-2">
        <p className="text-[26px] font-bold tracking-tight text-foreground">{value}</p>
        {trend && (
          <span className={cn('text-xs font-semibold', trend.positive ? 'text-emerald-400' : 'text-red-400')}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground/55 mt-1">{subtitle}</p>}
    </Card>
  );
}

/* ── Table ── */
export function Table({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <thead>
      <tr className={cn('border-b border-border/40 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold', className)}>
        {children}
      </tr>
    </thead>
  );
}

export function Th({ className, children, align = 'left' }: { className?: string; children: ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <th className={cn('p-3', align === 'right' && 'text-right', align === 'center' && 'text-center', className)}>{children}</th>;
}

export function Td({ className, children, align = 'left' }: { className?: string; children: ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <td className={cn('p-3', align === 'right' && 'text-right', align === 'center' && 'text-center', className)}>{children}</td>;
}

/* ── EmptyState ── */
export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {icon && <div className="text-muted-foreground/20 mb-5">{icon}</div>}
      <p className="text-[15px] font-medium text-muted-foreground/70">{title}</p>
      <p className="text-sm text-muted-foreground/45 mt-2 max-w-sm">{description}</p>
    </div>
  );
}
