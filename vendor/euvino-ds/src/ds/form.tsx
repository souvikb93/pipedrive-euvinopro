import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import { Chip } from './button';

function useFieldIds(id?: string) {
  const auto = React.useId();
  const base = id ?? auto;
  return { id: base, helpId: `${base}-help` };
}

interface FieldShellProps { label?: string; hideLabel?: boolean; required?: boolean; help?: React.ReactNode; error?: string; success?: string; htmlFor?: string; helpId: string; children: React.ReactNode; className?: string; counter?: string }

function FieldShell({ label, hideLabel, required, help, error, success, htmlFor, helpId, children, className, counter }: FieldShellProps) {
  const msg = error ?? success ?? help;
  return (
    <div className={cn('eu-field', className)}>
      {label ? <label htmlFor={htmlFor} className={cn('eu-field__label eu-type-ui-card-title', hideLabel && 'eu-sr')}>{label}{required ? <span className="eu-field__req" aria-hidden="true"> *</span> : null}</label> : null}
      {children}
      {msg || counter ? (
        <div className="eu-field__foot">
          {msg ? <span id={helpId} className={cn('eu-field__help eu-type-body-caption', error && 'is-error', success && !error && 'is-success')}>
            {error ? <Icon name="warning-circle" size="sm" /> : success ? <Icon name="check-circle" size="sm" /> : null}{msg}
          </span> : <span />}
          {counter ? <span className="eu-type-body-caption eu-field__counter">{counter}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'style'> {
  /** Visible label. Required unless you pass `aria-label`. */
  label?: string;
  /** Keeps the label for screen readers but hides it visually. Use sparingly, such as a search in a toolbar. */
  hideLabel?: boolean;
  /** Help text below the field. */
  help?: React.ReactNode;
  /** Error message. Sets the error state and `aria-invalid`. Say what is wrong and how to fix it. */
  error?: string;
  /** Success message below the field. */
  success?: string;
  /** Height: `medium` 40 (default), `large` 48. */
  size?: 'medium' | 'large';
  /** Icon inside the field on the left. */
  iconLeft?: IconName;
  /** Shows a clear button while there is text. Called when it is pressed. */
  onClear?: () => void;
  /** Accessible names of the built-in buttons. Pass them in the page's language. */
  labels?: { clear?: string; showPassword?: string; hidePassword?: string };
}

/** Single-line text entry. `type="password"` adds a built-in show or hide button, so never build one yourself. For choosing from a list use Dropdown. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hideLabel, help, error, success, size = 'medium', iconLeft, onClear, labels, id, className, type = 'text', required, value, ...rest }, ref,
) {
  const f = useFieldIds(id);
  const [shown, setShown] = React.useState(false);
  const isPw = type === 'password';
  return (
    <FieldShell label={label} hideLabel={hideLabel} required={required} help={help} error={error} success={success} htmlFor={f.id} helpId={f.helpId} className={className}>
      <span className={cn('eu-input', `eu-input--${size}`, error && 'is-error', success && !error && 'is-success', rest.disabled && 'is-disabled')}>
        {iconLeft ? <Icon name={iconLeft} size="md" className="eu-input__icon" /> : null}
        <input {...rest} ref={ref} id={f.id} value={value} required={required} type={isPw && shown ? 'text' : type} aria-invalid={error ? true : undefined} aria-describedby={error || success || help ? f.helpId : rest['aria-describedby']} className="eu-input__el eu-type-body-small" />
        {onClear && value ? <button type="button" className="eu-input__btn" aria-label={labels?.clear ?? 'Clear'} onClick={onClear}><Icon name="close" size="sm" /></button> : null}
        {isPw ? <button type="button" className="eu-input__btn" aria-pressed={shown} aria-label={shown ? labels?.hidePassword ?? 'Hide password' : labels?.showPassword ?? 'Show password'} onClick={() => setShown((s) => !s)}><Icon name={shown ? 'eye-off' : 'eye'} size="md" /></button> : null}
      </span>
    </FieldShell>
  );
});

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  /** Visible label. */
  label?: string;
  /** Help text. */
  help?: React.ReactNode;
  /** Error message. Sets the error state. */
  error?: string;
  /** Shows a character counter against this limit. */
  maxLength?: number;
}

/** Multi-line text entry for comments and descriptions. Use Input for single-line values. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, help, error, id, className, required, maxLength, value, ...rest }, ref) {
  const f = useFieldIds(id);
  const count = maxLength !== undefined ? `${String(value ?? '').length} / ${maxLength}` : undefined;
  return (
    <FieldShell label={label} required={required} help={help} error={error} htmlFor={f.id} helpId={f.helpId} className={className} counter={count}>
      <textarea {...rest} ref={ref} id={f.id} value={value} required={required} maxLength={maxLength} aria-invalid={error ? true : undefined} aria-describedby={error || help ? f.helpId : undefined} className={cn('eu-textarea eu-type-body-small', error && 'is-error')} />
    </FieldShell>
  );
});

export interface DropdownOption {
  /** Value reported by `onChange`. */
  value: string;
  /** Visible text. */
  label: string;
  /** Option cannot be picked. */
  disabled?: boolean;
  /** Optional icon. */
  icon?: IconName;
}

export interface DropdownProps {
  /** Options, one row each. */
  options: DropdownOption[];
  /** Selected value. */
  value?: string;
  /** Called with the picked value. */
  onChange?: (value: string) => void;
  /** Visible label. */
  label?: string;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Help text. */
  help?: React.ReactNode;
  /** Error message. */
  error?: string;
  /** Blocks interaction. */
  disabled?: boolean;
  /** Marks the field as required. */
  required?: boolean;
  /** Explicit id for the trigger. */
  id?: string;
  /** Extra class. */
  className?: string;
}

/** Choose one value from a list. It opens below the field and supports the arrow keys. To run commands use Menu; for two to four visible choices use Radio or SegmentedControl. */
export function Dropdown({ options, value, onChange, label, placeholder = 'Select', help, error, disabled, required, id, className }: DropdownProps) {
  const f = useFieldIds(id);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const root = React.useRef<HTMLDivElement>(null);
  const sel = options.find((o) => o.value === value);
  React.useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { setOpen(true); setActive(Math.max(0, options.findIndex((o) => o.value === value))); return; }
      const d = e.key === 'ArrowDown' ? 1 : -1;
      setActive((a) => (a + d + options.length) % options.length);
    } else if ((e.key === 'Enter' || e.key === ' ') && open) {
      e.preventDefault();
      const o = options[active];
      if (o && !o.disabled) { onChange?.(o.value); setOpen(false); }
    }
  };
  return (
    <FieldShell label={label} required={required} help={help} error={error} htmlFor={f.id} helpId={f.helpId} className={className}>
      <div className="eu-dd" ref={root}>
        <button id={f.id} type="button" disabled={disabled} role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-controls={`${f.id}-list`} aria-invalid={error ? true : undefined} aria-activedescendant={open ? `${f.id}-o${active}` : undefined}
          className={cn('eu-dd__field eu-type-body-small', error && 'is-error', !sel && 'is-placeholder')} onClick={() => setOpen((o) => !o)} onKeyDown={onKey}>
          {sel?.icon ? <Icon name={sel.icon} size="md" /> : null}
          <span className="eu-dd__value">{sel?.label ?? placeholder}</span>
          <Icon name={open ? 'nav-up' : 'nav-down'} size="md" />
        </button>
        {open ? (
          <ul id={`${f.id}-list`} role="listbox" className="eu-menu eu-dd__list">
            {options.map((o, i) => (
              <li key={o.value} id={`${f.id}-o${i}`} role="option" aria-selected={o.value === value} aria-disabled={o.disabled || undefined}
                className={cn('eu-menu__item eu-type-body-small', o.value === value && 'is-selected', i === active && 'is-active', o.disabled && 'is-disabled')}
                onMouseEnter={() => setActive(i)} onClick={() => { if (!o.disabled) { onChange?.(o.value); setOpen(false); } }}>
                {o.icon ? <Icon name={o.icon} size="md" /> : null}<span>{o.label}</span>{o.value === value ? <Icon name="check" size="md" className="eu-menu__check" /> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </FieldShell>
  );
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'style'> {
  /** Visible label. Pass `aria-label` instead only inside a table row. */
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: string;
  /** Shows a dash for a partly selected group. */
  indeterminate?: boolean;
  /** `small` 16 or `medium` 24. */
  size?: 'small' | 'medium';
  /** Error message below. */
  error?: string;
}

/** Pick several options that need saving. For one choice of several use Radio. For a setting that applies at once use Toggle. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, description, indeterminate, size = 'medium', error, className, ...rest }, ref) {
  const inner = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  React.useEffect(() => { if (inner.current) inner.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <label className={cn('eu-check', `eu-check--${size}`, rest.disabled && 'is-disabled', className)}>
      <input {...rest} ref={inner} type="checkbox" aria-invalid={error ? true : undefined} className="eu-check__el" />
      <span className="eu-check__box" aria-hidden="true"><Icon name={indeterminate ? 'minus' : 'check'} size="xs" /></span>
      {label || description ? <span className="eu-check__text">{label ? <span className="eu-type-body-small eu-check__label">{label}</span> : null}{description ? <span className="eu-type-body-caption eu-check__desc">{description}</span> : null}{error ? <span className="eu-type-body-caption eu-field__help is-error">{error}</span> : null}</span> : null}
    </label>
  );
});

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'style'> {
  /** Visible label. */
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: string;
}

/** One option of a set where exactly one is chosen. Group them in RadioGroup. */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, description, className, ...rest }, ref) {
  return (
    <label className={cn('eu-radio', rest.disabled && 'is-disabled', className)}>
      <input {...rest} ref={ref} type="radio" className="eu-radio__el" />
      <span className="eu-radio__dot" aria-hidden="true" />
      {label || description ? <span className="eu-check__text">{label ? <span className="eu-type-body-small eu-check__label">{label}</span> : null}{description ? <span className="eu-type-body-caption eu-check__desc">{description}</span> : null}</span> : null}
    </label>
  );
});

export interface RadioGroupProps {
  /** Group label, shown as the legend. */
  label: string;
  /** Shared input name. */
  name: string;
  /** Options to show. */
  options: Array<{ value: string; label: React.ReactNode; description?: string; disabled?: boolean }>;
  /** Selected value. */
  value?: string;
  /** Called with the picked value. */
  onChange?: (value: string) => void;
  /** Error message. */
  error?: string;
  /** Lay out in a row. */
  horizontal?: boolean;
}

/** A labelled set of Radio options. Use it for two to five visible choices. */
export function RadioGroup({ label, name, options, value, onChange, error, horizontal }: RadioGroupProps) {
  return (
    <fieldset className={cn('eu-group', horizontal && 'eu-group--row')}>
      <legend className="eu-type-ui-card-title eu-field__label">{label}</legend>
      <div className="eu-group__items">
        {options.map((o) => <Radio key={o.value} name={name} value={o.value} label={o.label} description={o.description} disabled={o.disabled} checked={value === o.value} onChange={() => onChange?.(o.value)} />)}
      </div>
      {error ? <span className="eu-field__help is-error eu-type-body-caption"><Icon name="warning-circle" size="sm" />{error}</span> : null}
    </fieldset>
  );
}

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'style'> {
  /** On or off. */
  checked: boolean;
  /** Called with the new state. Apply the setting straight away; a Toggle never waits for a Save button. */
  onChange: (checked: boolean) => void;
  /** Visible label. Required unless you pass `aria-label`. */
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: string;
  /** Which side the label sits on. */
  textSide?: 'left' | 'right';
}

/** A switch for a setting that takes effect immediately. If the change needs saving, use Checkbox. */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle({ checked, onChange, label, description, textSide = 'right', className, id, ...rest }, ref) {
  const auto = React.useId(); const lid = `${id ?? auto}-l`; const did = `${id ?? auto}-d`;
  return (
    <span className={cn('eu-toggle', textSide === 'left' && 'eu-toggle--left', rest.disabled && 'is-disabled', className)}>
      <button {...rest} ref={ref} id={id} type="button" role="switch" aria-checked={checked} aria-labelledby={label ? lid : undefined} aria-describedby={description ? did : undefined} className={cn('eu-toggle__track', checked && 'is-on')} onClick={() => onChange(!checked)}><span className="eu-toggle__thumb" /></button>
      {label || description ? <span className="eu-check__text" onClick={() => !rest.disabled && onChange(!checked)}>{label ? <span id={lid} className="eu-type-body-small eu-check__label">{label}</span> : null}{description ? <span id={did} className="eu-type-body-caption eu-check__desc">{description}</span> : null}</span> : null}
    </span>
  );
});

export interface StepperProps {
  /** Current number. */
  value: number;
  /** Called with the new number. */
  onChange: (value: number) => void;
  /** Lowest value. */
  min?: number;
  /** Highest value. */
  max?: number;
  /** Change per press. */
  step?: number;
  /** Accessible name, such as "Quantity". */
  label: string;
  /** Accessible names of the buttons in the page's language. */
  labels?: { increase?: string; decrease?: string };
  /** `filled` or `outline`. */
  variant?: 'filled' | 'outline';
}

/** Change a small number with plus and minus buttons, such as a quantity. */
export function Stepper({ value, onChange, min, max, step = 1, label, labels, variant = 'outline' }: StepperProps) {
  return (
    <span role="group" aria-label={label} className={cn('eu-stepper', `eu-stepper--${variant}`)}>
      <button type="button" aria-label={labels?.decrease ?? 'Decrease'} disabled={min !== undefined && value <= min} onClick={() => onChange(value - step)}><Icon name="minus" size="sm" /></button>
      <output aria-live="polite" className="eu-type-body-small">{value}</output>
      <button type="button" aria-label={labels?.increase ?? 'Increase'} disabled={max !== undefined && value >= max} onClick={() => onChange(value + step)}><Icon name="plus" size="sm" /></button>
    </span>
  );
}

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'style' | 'size'> {
  /** Visible label. */
  label: string;
  /** Show the current value next to the label. */
  showValue?: boolean;
}

/** Pick a value on a range. Use Input when an exact number is required. */
export function Slider({ label, showValue, id, className, value, ...rest }: SliderProps) {
  const f = useFieldIds(id);
  return (
    <div className={cn('eu-field', className)}>
      <div className="eu-field__foot"><label htmlFor={f.id} className="eu-field__label eu-type-ui-card-title">{label}</label>{showValue ? <span className="eu-type-body-small">{value}</span> : null}</div>
      <input {...rest} id={f.id} value={value} type="range" className="eu-slider" />
    </div>
  );
}

export interface FileDropzoneProps {
  /** Called with the chosen or dropped files. */
  onFiles: (files: File[]) => void;
  /** Main line, such as "Drop a file here or click to browse". */
  title: string;
  /** Accepted types and the size limit, in words. */
  description?: string;
  /** Native accept filter, such as ".csv,.xlsx". */
  accept?: string;
  /** Allow several files. */
  multiple?: boolean;
  /** Blocks interaction. */
  disabled?: boolean;
  /** Error message. */
  error?: string;
}

/** Drag-and-drop area over a real file input. List chosen files with FileItem. */
export function FileDropzone({ onFiles, title, description, accept, multiple, disabled, error }: FileDropzoneProps) {
  const [over, setOver] = React.useState(false);
  return (
    <div>
      <label className={cn('eu-drop', over && 'is-over', disabled && 'is-disabled', error && 'is-error')} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) onFiles(Array.from(e.dataTransfer.files)); }}>
        <input type="file" className="eu-sr" accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => onFiles(Array.from(e.target.files ?? []))} />
        <Icon name="upload" size="lg" />
        <span className="eu-type-ui-card-title">{title}</span>
        {description ? <span className="eu-type-body-caption eu-check__desc">{description}</span> : null}
      </label>
      {error ? <span className="eu-field__help is-error eu-type-body-caption"><Icon name="warning-circle" size="sm" />{error}</span> : null}
    </div>
  );
}

export interface FileItemProps {
  /** File name. */
  name: string;
  /** One line of meta: size or what went wrong. */
  meta?: string;
  /** Upload state. */
  state?: 'uploading' | 'complete' | 'error';
  /** Upload progress, 0 to 100, while uploading. */
  progress?: number;
  /** Shows a remove button. */
  onRemove?: () => void;
  /** Accessible name of the remove button. */
  removeLabel?: string;
}

/** One uploaded file with its progress, result and a remove action. */
export function FileItem({ name, meta, state = 'complete', progress, onRemove, removeLabel = 'Remove file' }: FileItemProps) {
  return (
    <div className={cn('eu-file', state === 'error' && 'is-error')}>
      <Icon name={state === 'error' ? 'warning-circle' : state === 'complete' ? 'check-circle' : 'page'} size="md" />
      <span className="eu-file__body">
        <span className="eu-type-ui-card-title eu-file__name">{name}</span>
        {meta ? <span className="eu-type-body-caption eu-check__desc">{meta}</span> : null}
        {state === 'uploading' ? <span className="eu-bar" role="progressbar" aria-label={name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span className="eu-bar__fill" style={{ width: `${progress ?? 0}%` }} /></span> : null}
      </span>
      {onRemove ? <button type="button" className="eu-input__btn" aria-label={removeLabel} onClick={onRemove}><Icon name="close" size="sm" /></button> : null}
    </div>
  );
}

export interface TagInputProps {
  /** Current tags. */
  value: string[];
  /** Called with the new list. */
  onChange: (value: string[]) => void;
  /** Visible label. */
  label: string;
  /** Placeholder for the text field. */
  placeholder?: string;
  /** Help text. */
  help?: string;
  /** Error message. */
  error?: string;
  /** Blocks interaction. */
  disabled?: boolean;
}

/** Enter several values as removable tags. Enter or comma adds, Backspace removes the last one. */
export function TagInput({ value, onChange, label, placeholder, help, error, disabled }: TagInputProps) {
  const f = useFieldIds();
  const [text, setText] = React.useState('');
  const add = () => { const t = text.trim(); if (t && !value.includes(t)) onChange([...value, t]); setText(''); };
  return (
    <FieldShell label={label} help={help} error={error} htmlFor={f.id} helpId={f.helpId}>
      <div className={cn('eu-taginput', error && 'is-error', disabled && 'is-disabled')}>
        {value.map((t) => <Chip key={t} disabled={disabled} onRemove={() => onChange(value.filter((x) => x !== t))} removeLabel={`Remove ${t}`}>{t}</Chip>)}
        <input id={f.id} disabled={disabled} value={text} placeholder={placeholder} className="eu-input__el eu-type-body-small" onChange={(e) => setText(e.target.value)} onBlur={add}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1)); }} />
      </div>
    </FieldShell>
  );
}

export interface CalendarProps {
  /** Selected day as ISO `YYYY-MM-DD`. */
  value?: string;
  /** Called with the picked ISO day. */
  onChange?: (iso: string) => void;
  /** First month to show, as ISO. Defaults to the selected day or today. */
  defaultMonth?: string;
  /** Earliest day that can be picked, as ISO. */
  min?: string;
  /** Latest day that can be picked, as ISO. */
  max?: string;
  /** BCP 47 locale for month and weekday names. */
  locale?: string;
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Month grid for picking one day. Use DatePicker for the field-plus-calendar pattern. */
export function Calendar({ value, onChange, defaultMonth, min, max, locale = 'en' }: CalendarProps) {
  const start = new Date((defaultMonth ?? value ?? iso(new Date())) + 'T00:00');
  const [view, setView] = React.useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const today = iso(new Date());
  const first = (view.getDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i - first + 1));
  const week = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }));
  return (
    <div className="eu-cal">
      <div className="eu-cal__head">
        <button type="button" className="eu-input__btn" aria-label="Previous month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}><Icon name="nav-left" size="md" /></button>
        <span className="eu-type-ui-card-title" aria-live="polite">{view.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</span>
        <button type="button" className="eu-input__btn" aria-label="Next month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}><Icon name="nav-right" size="md" /></button>
      </div>
      <div className="eu-cal__grid" role="grid">
        {week.map((w) => <span key={w} className="eu-cal__wd eu-type-body-caption">{w}</span>)}
        {days.map((d) => {
          const k = iso(d); const out = d.getMonth() !== view.getMonth(); const dis = (min && k < min) || (max && k > max);
          return <button key={k} type="button" disabled={!!dis} aria-pressed={k === value} aria-current={k === today ? 'date' : undefined} aria-label={d.toLocaleDateString(locale, { dateStyle: 'full' })} className={cn('eu-cal__day eu-type-body-small', k === value && 'is-selected', k === today && 'is-today', out && 'is-outside')} onClick={() => onChange?.(k)}>{d.getDate()}</button>;
        })}
      </div>
    </div>
  );
}

export interface DatePickerProps extends Omit<CalendarProps, 'defaultMonth'> {
  /** Visible label. */
  label: string;
  /** Text when empty. */
  placeholder?: string;
  /** Help text. */
  help?: string;
  /** Error message. */
  error?: string;
  /** Blocks interaction. */
  disabled?: boolean;
}

/** A field that opens a Calendar. Use it for dates near today; use Input for known dates such as birthdays. */
export function DatePicker({ label, placeholder = 'Select date', help, error, disabled, value, onChange, min, max, locale = 'en' }: DatePickerProps) {
  const f = useFieldIds();
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [open]);
  return (
    <FieldShell label={label} help={help} error={error} htmlFor={f.id} helpId={f.helpId}>
      <div className="eu-dd" ref={root}>
        <button id={f.id} type="button" disabled={disabled} aria-expanded={open} aria-haspopup="dialog" className={cn('eu-dd__field eu-type-body-small', error && 'is-error', !value && 'is-placeholder')} onClick={() => setOpen((o) => !o)}>
          <Icon name="calendar" size="md" /><span className="eu-dd__value">{value ? new Date(value + 'T00:00').toLocaleDateString(locale, { dateStyle: 'medium' }) : placeholder}</span>
        </button>
        {open ? <div role="dialog" aria-label={label} className="eu-dd__pop"><Calendar value={value} min={min} max={max} locale={locale} onChange={(d) => { onChange?.(d); setOpen(false); }} /></div> : null}
      </div>
    </FieldShell>
  );
}
