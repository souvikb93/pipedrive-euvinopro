import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import { Button } from './button';
import { CloseButton } from './field-action';

export type Status = 'default' | 'success' | 'info' | 'warning' | 'error';
const STATUS_ICON: Record<Status, IconName> = {
  default: 'info',
  success: 'check-circle',
  info: 'info',
  warning: 'warning-triangle',
  error: 'warning-circle',
};

export interface LoaderProps {
  /** `tiny` 16, `small` 20, `medium` 24, `large` 32, `giant` 48. */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  /** Announced to screen readers. Pass an empty string only when the parent already announces loading, such as a busy Button. */
  label?: string;
}

/** Indeterminate loading indicator. Use Skeleton when the layout is known and ProgressBar when the duration is known. */
export function Loader({ size = 'medium', label = 'Loading' }: LoaderProps) {
  return (
    <span
      className={cn('eu-loader', `eu-loader--${size}`)}
      role={label ? 'status' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    />
  );
}

export interface SkeletonProps {
  /** `text` lines, a `row` with a thumbnail, or a `card` block. */
  type?: 'text' | 'row' | 'card';
  /** How many to repeat. */
  count?: number;
}

/** Placeholder while content loads. Match the layout that will appear. Hidden from screen readers; announce loading with `aria-busy` on the region. */
export function Skeleton({ type = 'text', count = 1 }: SkeletonProps) {
  return (
    <span className="eu-skel-wrap" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={cn('eu-skel', `eu-skel--${type}`)} />
      ))}
    </span>
  );
}

export interface ProgressBarProps {
  /** 0 to 100. */
  value: number;
  /** Accessible name, and the visible label when `showLabel` is on. */
  label: string;
  /** Show the label above the bar. */
  showLabel?: boolean;
  /** Show the percent value. */
  showValue?: boolean;
  /** Greys it out. */
  disabled?: boolean;
}

/** Progress when the duration or amount is known. */
export function ProgressBar({ value, label, showLabel, showValue, disabled }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('eu-progress', disabled && 'is-disabled')}>
      {showLabel || showValue ? (
        <div className="eu-field__foot">
          {showLabel ? <span className="eu-type-body-small">{label}</span> : <span />}
          {showValue ? <span className="eu-type-body-caption">{v}%</span> : null}
        </div>
      ) : null}
      <span className="eu-bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
        <span className="eu-bar__fill" style={{ width: `${v}%` }} />
      </span>
    </div>
  );
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'style'> {
  /** Meaning. Always paired with its icon, so colour is not the only signal. */
  status?: Status;
  /** `outline` (default) or `filled` tint. */
  variant?: 'outline' | 'filled';
  /** Short bold line. */
  title?: React.ReactNode;
  /** Actions, such as a Button. */
  actions?: React.ReactNode;
  /** Shows a close button. */
  onDismiss?: () => void;
  /** Accessible name of the close button. */
  dismissLabel?: string;
}

/** A message that stays on the page until resolved. `error` and `warning` announce themselves. Use Toast for a passing confirmation. */
export function Alert({
  status = 'default',
  variant = 'outline',
  title,
  actions,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  children,
  role,
  ...rest
}: AlertProps) {
  return (
    <div
      {...rest}
      role={role ?? (status === 'error' || status === 'warning' ? 'alert' : 'status')}
      className={cn('eu-alert', `eu-alert--${status}`, `eu-alert--${variant}`, className)}
    >
      <Icon name={STATUS_ICON[status]} size="md" className="eu-alert__icon" />
      <div className="eu-alert__body">
        {title ? <div className="eu-type-ui-label eu-alert__title">{title}</div> : null}
        {children ? <div className="eu-type-body-small eu-alert__text">{children}</div> : null}
        {actions ? <div className="eu-alert__actions">{actions}</div> : null}
      </div>
      {onDismiss ? <CloseButton label={dismissLabel} size="small" onClick={onDismiss} /> : null}
    </div>
  );
}

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Meaning. */
  status?: Status;
  /** `subtle` tint (default), `filled` or `outline`. */
  variant?: 'subtle' | 'filled' | 'outline';
  /** `tiny`, `small` or `medium`. */
  size?: 'tiny' | 'small' | 'medium';
  /** Icon before the text. Pair status with text or an icon, never colour alone. */
  icon?: IconName;
}

/** Shows a status, count or category. It is not interactive; use Chip for something people click. */
export function Badge({ status = 'default', variant = 'subtle', size = 'small', icon, className, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cn('eu-badge', `eu-badge--${status}`, `eu-badge--${variant}`, `eu-badge--${size}`, className)}>
      {icon ? <Icon name={icon} size={size === 'medium' ? 'sm' : 'xs'} /> : null}
      {children}
    </span>
  );
}

// ---- Toast
export interface ToastOptions {
  /** Short confirmation. */
  title: string;
  /** Optional second line. */
  description?: string;
  /** Meaning. */
  status?: Status;
  /** Milliseconds before it disappears. Defaults to 5000. Use 0 to keep it until dismissed. */
  duration?: number;
  /** An undo or view action. */
  action?: { label: string; onClick: () => void };
}
interface ToastItem extends ToastOptions {
  id: number;
}
const ToastCtx = React.createContext<((t: ToastOptions) => void) | null>(null);

export interface ToastProviderProps {
  /** Your app or screen. */
  children: React.ReactNode;
  /** Accessible name of each close button. */
  dismissLabel?: string;
}

/** Wrap the app or screen once. Then call `useToast()` anywhere inside. It renders the announcing region for you. */
export function ToastProvider({ children, dismissLabel = 'Dismiss' }: ToastProviderProps) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const next = React.useRef(1);
  const remove = React.useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const show = React.useCallback(
    (t: ToastOptions) => {
      const id = next.current++;
      setItems((l) => [...l, { ...t, id }]);
      if ((t.duration ?? 5000) > 0) window.setTimeout(() => remove(id), t.duration ?? 5000);
    },
    [remove],
  );
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="eu-toasts" role="region" aria-label="Notifications" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} role={t.status === 'error' ? 'alert' : 'status'} className={cn('eu-toast', `eu-alert--${t.status ?? 'default'}`)}>
            <Icon name={STATUS_ICON[t.status ?? 'default']} size="md" className="eu-alert__icon" />
            <div className="eu-alert__body">
              <div className="eu-type-ui-card-title eu-alert__title">{t.title}</div>
              {t.description ? <div className="eu-type-body-small eu-alert__text">{t.description}</div> : null}
            </div>
            {t.action ? (
              <button
                type="button"
                className="eu-link eu-link--primary eu-type-ui-button"
                onClick={() => {
                  t.action?.onClick();
                  remove(t.id);
                }}
              >
                {t.action.label}
              </button>
            ) : null}
            <CloseButton label={dismissLabel} size="small" onClick={() => remove(t.id)} />
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/** Returns `toast({ title, status, description, duration, action })`. Must be called under ToastProvider. */
export function useToast(): (t: ToastOptions) => void {
  const c = React.useContext(ToastCtx);
  if (!c) throw new Error('useToast must be used inside ToastProvider');
  return c;
}

// ---- Dialog family
function useDialog(open: boolean, onClose: () => void) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal?.();
      // Start in the content, not on the close button: first field, else whatever the dialog chose.
      const first = d.querySelector<HTMLElement>(
        '.eu-modal__body input:not([type=hidden]):not(:disabled), .eu-modal__body textarea:not(:disabled), .eu-drawer__body input:not([type=hidden]):not(:disabled), .eu-drawer__body textarea:not(:disabled)',
      );
      first?.focus();
    }
    if (!open && d.open) d.close?.();
  }, [open]);
  return {
    ref,
    onCancel: (e: React.SyntheticEvent) => {
      e.preventDefault();
      onClose();
    },
  };
}

export interface ModalProps {
  /** Controls visibility. Render it always and flip this. Focus is trapped and returns to the opener on close. */
  open: boolean;
  /** Called on Escape, the close button or a backdrop press. */
  onClose: () => void;
  /** Heading. */
  title: string;
  /** Line under the heading. */
  description?: React.ReactNode;
  /** Footer actions, rightmost is the main one. */
  footer?: React.ReactNode;
  /** Secondary footer action on the left, away from the main actions, such as Import. */
  footerStart?: React.ReactNode;
  /** Width: `small` 400, `medium` 560, `large` 720, `xlarge` 960 for landscape forms in two or three columns. */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Free content area. */
  children?: React.ReactNode;
}

/** A focused task above the page, with a free content area such as a short form. For a yes-or-no confirmation use ConfirmDialog. */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  footerStart,
  size = 'medium',
  closeLabel = 'Close',
  children,
}: ModalProps) {
  const d = useDialog(open, onClose);
  const tid = React.useId();
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click closes; keyboard closes with Escape (native dialog cancel)
    <dialog
      ref={d.ref}
      onCancel={d.onCancel}
      aria-labelledby={tid}
      className={cn('eu-modal', `eu-modal--${size}`)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {open ? (
        <div className="eu-modal__box">
          <header className="eu-modal__head">
            <div>
              <h2 id={tid} className="eu-type-desktop-h5 eu-modal__title">
                {title}
              </h2>
              {description ? <div className="eu-type-body-small eu-check__desc">{description}</div> : null}
            </div>
            <CloseButton label={closeLabel} onClick={onClose} />
          </header>
          {children ? <div className="eu-modal__body">{children}</div> : null}
          {footer || footerStart ? (
            <footer className="eu-modal__foot">
              {footerStart ? <div className="eu-modal__foot-start">{footerStart}</div> : null}
              {footer}
            </footer>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}

export interface ConfirmDialogProps {
  /** Controls visibility. */
  open: boolean;
  /** Called when the person backs out: Cancel, Escape or the backdrop. */
  onCancel: () => void;
  /** Called when the person confirms. */
  onConfirm: () => void;
  /** The question, naming the thing: "Delete this account?". */
  title: string;
  /** The consequence in plain words. Say what cannot be undone. */
  children: React.ReactNode;
  /** Confirm label naming the action: "Delete account", never "OK" or "Yes". */
  confirmLabel: string;
  /** Back-out label. */
  cancelLabel?: string;
  /** `danger` for anything irreversible: red confirm, and focus starts on Cancel. `default` for a normal confirmation. */
  tone?: 'default' | 'danger';
  /** Shows progress on the confirm button while the action runs. */
  busy?: boolean;
}

/** The Pop-Up in Figma: a short confirmation before a consequential action. Use it for every delete or anything that cannot be undone. Focus starts on the safe choice. */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  busy,
}: ConfirmDialogProps) {
  const d = useDialog(open, onCancel);
  const tid = React.useId();
  const did = React.useId();
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click cancels; keyboard cancels with Escape (native dialog cancel)
    <dialog
      ref={d.ref}
      onCancel={d.onCancel}
      role="alertdialog"
      aria-labelledby={tid}
      aria-describedby={did}
      className="eu-modal eu-modal--small"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {open ? (
        <div className="eu-modal__box">
          <header className="eu-modal__head">
            <h2 id={tid} className="eu-type-desktop-h5 eu-modal__title">
              {title}
            </h2>
          </header>
          <div id={did} className="eu-modal__body eu-type-body-small eu-check__desc">
            {children}
          </div>
          <footer className="eu-modal__foot">
            {/* eslint-disable-next-line jsx-a11y/no-autofocus -- a danger confirmation starts on Cancel, the safe choice */}
            <Button variant="secondary" autoFocus onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={busy} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </footer>
        </div>
      ) : null}
    </dialog>
  );
}

export interface DrawerProps {
  /** Controls visibility. */
  open: boolean;
  /** Called on Escape, close or backdrop. */
  onClose: () => void;
  /** Heading. */
  title: string;
  /** Side it slides from. */
  position?: 'right' | 'left';
  /** Footer actions. */
  footer?: React.ReactNode;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Content. */
  children?: React.ReactNode;
}

/** Side panel for details or edits while keeping the page in view. */
export function Drawer({ open, onClose, title, position = 'right', footer, closeLabel = 'Close', children }: DrawerProps) {
  const d = useDialog(open, onClose);
  const tid = React.useId();
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click closes; keyboard closes with Escape (native dialog cancel)
    <dialog
      ref={d.ref}
      onCancel={d.onCancel}
      aria-labelledby={tid}
      className={cn('eu-drawer', `eu-drawer--${position}`)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {open ? (
        <div className="eu-drawer__box">
          <header className="eu-modal__head">
            <h2 id={tid} className="eu-type-desktop-h5 eu-modal__title">
              {title}
            </h2>
            <CloseButton label={closeLabel} onClick={onClose} />
          </header>
          <div className="eu-modal__body eu-drawer__body">{children}</div>
          {footer ? <footer className="eu-modal__foot">{footer}</footer> : null}
        </div>
      ) : null}
    </dialog>
  );
}

export interface TooltipProps {
  /** Short hint with no actions. */
  content: string;
  /** Exactly one focusable element, such as an IconButton. */
  children: React.ReactElement;
  /** Side it opens on. */
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/** Short hint on hover or focus. It never holds the only copy of important text. For richer content use Popover. */
export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- hover and focus of the trigger inside open the tooltip; the trigger is the focusable element
    <span
      className="eu-tip-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      {React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, { 'aria-describedby': open ? id : undefined })}
      {open ? (
        <span id={id} role="tooltip" className={cn('eu-tip', `eu-tip--${position}`, 'eu-type-body-caption')}>
          {content}
        </span>
      ) : null}
    </span>
  );
}

export interface PopoverProps {
  /** Element that opens it, usually a Button. */
  trigger: React.ReactElement;
  /** Heading. */
  title?: string;
  /** Content. */
  children?: React.ReactNode;
  /** Controlled open state. Omit to let it manage itself. */
  open?: boolean;
  /** Called when the state changes. */
  onOpenChange?: (open: boolean) => void;
}

/** Small panel attached to a control, with richer content than a Tooltip. Escape and an outside press close it. */
export function Popover({ trigger, title, children, open: controlled, onOpenChange }: PopoverProps) {
  const [own, setOwn] = React.useState(false);
  const open = controlled ?? own;
  const set = (v: boolean) => {
    setOwn(v);
    onOpenChange?.(v);
  };
  const root = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) set(false);
    };
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') set(false);
    };
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', k);
    return () => {
      document.removeEventListener('mousedown', h);
      document.removeEventListener('keydown', k);
    };
  });
  const t = trigger as React.ReactElement<{ onClick?: () => void; 'aria-expanded'?: boolean; 'aria-haspopup'?: 'dialog' }>;
  return (
    <span className="eu-tip-wrap" ref={root}>
      {React.cloneElement(t, {
        onClick: () => {
          t.props.onClick?.();
          set(!open);
        },
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
      })}
      {open ? (
        <div role="dialog" aria-label={title} className="eu-popover">
          {title ? <div className="eu-type-ui-card-title eu-alert__title">{title}</div> : null}
          <div className="eu-type-body-small eu-check__desc">{children}</div>
        </div>
      ) : null}
    </span>
  );
}

export interface MenuItemDef {
  /** Visible text. */
  label: string;
  /** Called when chosen. */
  onSelect: () => void;
  /** Optional icon. */
  icon?: IconName;
  /** Cannot be chosen. */
  disabled?: boolean;
  /** Marks a destructive command with error colour. */
  danger?: boolean;
  /** For a choice such as a sort order or filter: `true` shows a check on the current one. Set it on every item of the group. */
  selected?: boolean;
}

export interface MenuProps {
  /** Element that opens it, usually an IconButton. */
  trigger: React.ReactElement;
  /** Commands in order. */
  items: MenuItemDef[];
  /** Accessible name of the list. */
  label: string;
}

/** Runs a command from a list, such as a row's actions. Arrow keys and Escape work. To choose a value use Dropdown. */
export function Menu({ trigger, items, label }: MenuProps) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const root = React.useRef<HTMLSpanElement>(null);
  const list = React.useRef<HTMLUListElement>(null);
  React.useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const h = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const t = trigger as React.ReactElement<{ onClick?: () => void; 'aria-expanded'?: boolean; 'aria-haspopup'?: 'menu' }>;
  const pick = (i: number) => {
    const it = items[i];
    if (it && !it.disabled) {
      setOpen(false);
      it.onSelect();
    }
  };
  return (
    <span className="eu-tip-wrap" ref={root}>
      {React.cloneElement(t, {
        onClick: () => {
          t.props.onClick?.();
          setActive(0);
          setOpen((o) => !o);
        },
        'aria-expanded': open,
        'aria-haspopup': 'menu',
      })}
      {open ? (
        <ul
          ref={list}
          role="menu"
          aria-label={label}
          tabIndex={-1}
          className="eu-menu eu-menu--pop"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
            else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => (a + 1) % items.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => (a - 1 + items.length) % items.length);
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              pick(active);
            }
          }}
        >
          {items.map((it, i) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- menu keys (arrows, Enter, Escape) are handled on the menu list
            <li
              key={it.label}
              role={it.selected === undefined ? 'menuitem' : 'menuitemradio'}
              aria-checked={it.selected === undefined ? undefined : it.selected}
              aria-disabled={it.disabled || undefined}
              className={cn(
                'eu-menu__item eu-type-body-small',
                i === active && 'is-active',
                it.disabled && 'is-disabled',
                it.danger && 'is-danger',
                it.selected && 'is-selected',
              )}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(i)}
            >
              {it.icon ? <Icon name={it.icon} size="md" /> : null}
              <span className="eu-menu__label">{it.label}</span>
              {it.selected ? <Icon name="check" size="md" className="eu-menu__check" /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  );
}
