import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import { Loader } from './feedback';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /**
   * Emphasis. `primary` = the main action of a view. `secondary` = a real alternative. `tertiary` = the least emphasis: a way out such as Cancel.
   * `primary-2` = the orange marketing or commercial call to action, at most one per view; never for a normal form save.
   * `danger` = the final irreversible action inside a confirmation. `danger-secondary` = the entry point that opens that confirmation.
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'primary-2' | 'danger' | 'danger-secondary';
  /** Height: `tiny` 24, `small` 32, `medium` 40 (default), `large` 48, `giant` 56. */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  /** Which icon to show. Buttons are text-only by default; add an icon only when it adds meaning. Pick the side with `iconPosition`. */
  icon?: IconName;
  /** Which side of the label the `icon` goes on. Defaults to `left`. */
  iconPosition?: 'left' | 'right';
  /** Shows a Loader, sets `aria-busy` and blocks clicks while keeping the label and width. */
  loading?: boolean;
  /** Stretches to the container width. */
  fullWidth?: boolean;
}

/** Runs an action. Start the label with a verb and name the result: "Create request", not "OK". Default type is `button`, so set `type="submit"` in forms. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'medium', icon, iconPosition = 'left', loading, fullWidth, className, children, disabled, type = 'button', onClick, ...rest },
  ref,
) {
  const iconSize = size === 'tiny' || size === 'small' ? 'sm' : 'md';
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      className={cn('eu-btn', `eu-btn--${variant}`, `eu-btn--${size}`, fullWidth && 'eu-btn--full', loading && 'eu-btn--loading', className)}
    >
      {loading ? <Loader size="tiny" label="" /> : icon && iconPosition === 'left' ? <Icon name={icon} size={iconSize} /> : null}
      {children}
      {icon && iconPosition === 'right' ? <Icon name={icon} size={iconSize} /> : null}
    </button>
  );
});

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style' | 'children'> {
  /** The icon to show. */
  icon: IconName;
  /** Required accessible name, such as "Remove file". */
  label: string;
  /** Same emphasis as Button. Defaults to `tertiary`. */
  variant?: ButtonProps['variant'];
  /** Square size, same scale as Button. */
  size?: ButtonProps['size'];
  /** Small dot in the corner: something behind this button is on, such as an active filter or sort. Say so in `label` too. */
  indicator?: boolean;
}

/** A Button that shows only an icon (Content = Only Icons in Figma). The label is required because nothing else names it. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'tertiary', size = 'medium', indicator, className, type = 'button', ...rest }, ref,
) {
  return (
    <button {...rest} ref={ref} type={type} aria-label={label} title={label} className={cn('eu-btn', 'eu-btn--icon', `eu-btn--${variant}`, `eu-btn--${size}`, className)}>
      <Icon name={icon} size={size === 'tiny' || size === 'small' ? 'sm' : size === 'giant' ? 'lg' : 'md'} />
      {indicator ? <span className="eu-btn__dot" aria-hidden="true" /> : null}
    </button>
  );
});

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `primary` uses text/link, `secondary` uses text/body. `link` is an inline text link in foreground/link (emails, phone numbers): it keeps the surrounding text style. `plain` keeps the surrounding colour and style and underlines on hover, for names that open a record. */
  variant?: 'primary' | 'secondary' | 'link' | 'plain';
}

/** A text link that navigates. Use Button when it runs an action. */
export function LinkButton({ variant = 'primary', className, ...rest }: LinkButtonProps) {
  return <a {...rest} className={cn('eu-link', `eu-link--${variant}`, variant !== 'link' && variant !== 'plain' && 'eu-type-ui-button', className)} />;
}

export interface SegmentOption {
  /** Value reported by `onChange`. */
  value: string;
  /** Visible label. */
  label: string;
  /** Optional icon. */
  icon?: IconName;
}

export interface SegmentedControlProps {
  /** Between 2 and 4 options. */
  options: SegmentOption[];
  /** The selected value. One segment is always selected. */
  value: string;
  /** Called with the new value. */
  onChange: (value: string) => void;
  /** Accessible name of the group, such as "View". */
  label: string;
  /** Extra class. */
  className?: string;
}

/** Switches the display of the same content in place, such as List and Grid. Not for page navigation (TopNav). Segments share the width equally, sized to the longest label. */
export function SegmentedControl({ options, value, onChange, label, className }: SegmentedControlProps) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('eu-seg', className)}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className={cn('eu-seg__item eu-type-body-small', o.value === value && 'is-selected eu-mode-icon-weight-selected')} onClick={() => onChange(o.value)}>
          {o.icon ? <Icon name={o.icon} size="sm" /> : null}
          <span className="eu-seg__label" data-label={o.label}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Selected filter state, announced with `aria-pressed`. */
  selected?: boolean;
  /** Icon before the text. */
  icon?: IconName;
  /** When set, shows a remove button with this handler. Needs `removeLabel`. */
  onRemove?: () => void;
  /** Accessible name of the remove button, such as "Remove Germany". */
  removeLabel?: string;
}

/** An interactive pill for filters and tags. Use Badge for something that only shows a status. */
export function Chip({ selected, icon, onRemove, removeLabel = 'Remove', className, children, disabled, ...rest }: ChipProps) {
  return (
    <span className={cn('eu-chip', selected && 'is-selected', disabled && 'is-disabled', className)}>
      <button {...rest} type="button" disabled={disabled} aria-pressed={selected === undefined ? undefined : selected} className="eu-chip__main eu-type-body-small">
        {icon ? <Icon name={icon} size="sm" /> : null}
        {children}
      </button>
      {onRemove ? <button type="button" className="eu-chip__remove" aria-label={removeLabel} disabled={disabled} onClick={onRemove}><Icon name="close" size="xs" /></button> : null}
    </span>
  );
}
