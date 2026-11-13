import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import { Button } from './button';
import { Menu, type MenuItemDef } from './feedback';

export interface SplitButtonProps {
  /** Label of the main action, verb first: "Kontakt", "Create request". */
  children: React.ReactNode;
  /** Runs the main action. */
  onClick?: () => void;
  /** Related actions behind the arrow. The first one should repeat or extend the main action. */
  items: MenuItemDef[];
  /** Accessible name of the arrow button and its menu, such as "More ways to add". */
  menuLabel: string;
  /** Emphasis, same as Button. Hydra Button Select has Primary and Secondary. */
  variant?: 'primary' | 'secondary';
  /** Height, same scale as Button: `small` 28, `medium` 38 (default), `large` 44. */
  size?: 'small' | 'medium' | 'large';
  /** Icon before the label, such as `plus` for create actions. */
  icon?: IconName;
  /** Disables both parts. */
  disabled?: boolean;
}

/**
 * Main action plus a menu of related actions, split by a divider (Hydra "Button Select").
 * Use it when one action is the usual choice and a few others belong to it, such as "Kontakt" with "Import".
 */
export function SplitButton({
  children,
  onClick,
  items,
  menuLabel,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled,
}: SplitButtonProps) {
  return (
    <span role="group" className={cn('eu-split', `eu-split--${variant}`, `eu-split--${size}`)}>
      <Button variant={variant} size={size} icon={icon} disabled={disabled} onClick={onClick} className="eu-split__main">
        {children}
      </Button>
      <Menu
        label={menuLabel}
        items={items}
        trigger={
          <Button variant={variant} size={size} disabled={disabled} aria-label={menuLabel} className="eu-split__toggle">
            <Icon name="nav-down" size="md" />
          </Button>
        }
      />
    </span>
  );
}
