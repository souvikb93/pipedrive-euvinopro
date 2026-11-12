import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';

export interface FieldActionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style' | 'type'> {
  /** What it adds or does, verb last in German UIs: "Telefonnummer hinzufügen". */
  children: React.ReactNode;
  /** Leading icon. Defaults to `plus`. */
  icon?: IconName;
}

/**
 * Inline action that belongs to the field above it, such as adding another phone number.
 * Not a button style: no padding or background, icon on the field's left edge, underline on hover.
 * Place it directly under the field in a `Stack gap="2"` (8, same as label to input). For standalone actions use Button.
 */
export function FieldAction({ children, icon = 'plus', className, ...rest }: FieldActionProps) {
  return (
    <button {...rest} type="button" className={cn('eu-field-action', className)}>
      <Icon name={icon} size="sm" className="eu-mode-icon-weight-selected" />
      <span className="eu-field-action__label">{children}</span>
    </button>
  );
}

export interface CloseButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style' | 'type' | 'children'> {
  /** Accessible name in the page's language, such as "Schließen". */
  label: string;
  /** `medium` for dialogs and drawers (32 area, 20 icon), `small` for toasts and alerts (24 area, 16 icon). */
  size?: 'medium' | 'small';
}

/** Closes a dialog, drawer, toast or alert. Regular icon weight, rounded-square hover, focus ring only when focused. */
export function CloseButton({ label, size = 'medium', className, ...rest }: CloseButtonProps) {
  return (
    <button {...rest} type="button" aria-label={label} title={label} className={cn('eu-close', `eu-close--${size}`, className)}>
      <Icon name="close" size={size === 'medium' ? 'md' : 'sm'} />
    </button>
  );
}
