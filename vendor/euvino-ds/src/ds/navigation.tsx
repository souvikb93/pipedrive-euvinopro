import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import { Avatar } from './display';
import { BottleMark } from './brand-mark';

export interface TopNavItem {
  /** Visible text. */
  label: string;
  /** Link target. */
  href?: string;
  /** Click handler when it is not a link. */
  onClick?: () => void;
  /** The current view; sets `aria-current`. */
  selected?: boolean;
}

export interface TopNavProps {
  /** Between 3 and 7 links. */
  items: TopNavItem[];
  /** Accessible name of the navigation. */
  label: string;
}

/** Links between views within a section, with a navy underline on the current one. This is also what other libraries call Tabs. */
export function TopNav({ items, label }: TopNavProps) {
  return (
    <nav aria-label={label} className="eu-topnav">
      {items.map((i) => <a key={i.label} href={i.href ?? '#'} aria-current={i.selected ? 'page' : undefined} onClick={i.onClick ? (e) => { e.preventDefault(); i.onClick?.(); } : undefined} className={cn('eu-topnav__item eu-type-ui-nav-link-mobile', i.selected && 'is-selected')}>{i.label}</a>)}
    </nav>
  );
}

export interface SideNavItem {
  /** Visible text. */
  label: string;
  /** Icon. */
  icon?: IconName;
  /** Link target. */
  href?: string;
  /** Click handler when it is not a link. */
  onClick?: () => void;
  /** Current page. */
  selected?: boolean;
  /** Counter badge text. */
  count?: number;
  /** Counter colour: `info` (default) or `error` for something that needs attention. */
  countStatus?: 'info' | 'error';
}

export interface SideNavProps {
  /** Items in order. */
  items: SideNavItem[];
  /** Accessible name. */
  label: string;
  /** Icon-only rail, 72 wide. */
  collapsed?: boolean;
  /** Surface. `light` is white (default). `dark` is the navy rail from Figma's Side Nav Theme=Dark. */
  theme?: 'light' | 'dark';
  /** Shows the bottle mark in a tile with a divider above the items (Figma Side Nav Logo). */
  logo?: boolean;
  /** Stays in view at full window height while the page scrolls. The nav itself never scrolls. */
  sticky?: boolean;
  /** Footer slot, such as a help card. */
  footer?: React.ReactNode;
}

/** Left navigation between app sections, 240 wide or a 72 rail when collapsed. Counts show as a badge on the rail. */
export function SideNav({ items, label, collapsed, theme = 'light', logo, sticky, footer }: SideNavProps) {
  return (
    <nav aria-label={label} className={cn('eu-sidenav', collapsed && 'is-collapsed', theme === 'dark' && 'eu-sidenav--dark', sticky && 'is-sticky')}>
      {logo ? <div className="eu-sidenav__brand"><span className="eu-sidenav__tile"><BottleMark className="eu-sidenav__mark" /></span><span className="eu-sidenav__rule" /></div> : null}
      <ul>
        {items.map((i) => (
          <li key={i.label}>
            <a href={i.href ?? '#'} aria-current={i.selected ? 'page' : undefined} aria-label={collapsed ? (i.count !== undefined ? `${i.label}, ${i.count}` : i.label) : undefined} onClick={i.onClick ? (e) => { e.preventDefault(); i.onClick?.(); } : undefined} className={cn('eu-sidenav__item eu-type-ui-card-title', i.selected && 'is-selected')}>
              {i.icon ? <Icon name={i.icon} size={collapsed ? 'lg' : 'md'} /> : null}
              {collapsed ? null : <span className="eu-sidenav__text">{i.label}</span>}
              {i.count !== undefined ? <span aria-hidden={collapsed || undefined} className={cn('eu-sidenav__count', i.countStatus === 'error' && 'is-error')}>{i.count}</span> : null}
            </a>
          </li>
        ))}
      </ul>
      {footer ? <div className="eu-sidenav__foot">{footer}</div> : null}
    </nav>
  );
}

export interface BreadcrumbsProps {
  /** Trail from the root to the current page. The last item is the current page. */
  items: Array<{ label: string; href?: string }>;
  /** Accessible name. */
  label?: string;
}

/** Shows where a page sits and links back up the trail. */
export function Breadcrumbs({ items, label = 'Breadcrumb' }: BreadcrumbsProps) {
  return (
    <nav aria-label={label}>
      <ol className="eu-crumbs eu-type-body-small">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return <li key={`${i}-${it.label}`}>{last ? <span aria-current="page" className="eu-crumbs__cur">{it.label}</span> : <a href={it.href ?? '#'}>{it.label}</a>}{last ? null : <Icon name="nav-right" size="sm" />}</li>;
        })}
      </ol>
    </nav>
  );
}

export interface PaginationProps {
  /** Current page, starting at 1. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the new page. */
  onChange: (page: number) => void;
  /** Accessible names in the page's language. */
  labels?: { nav?: string; previous?: string; next?: string; page?: string };
}

/** Moves through a long list page by page. It collapses long ranges with an ellipsis. Place it below the Table, never inside. */
export function Pagination({ page, pageCount, onChange, labels }: PaginationProps) {
  const pages: Array<number | '...'> = [];
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  return (
    <nav aria-label={labels?.nav ?? 'Pagination'} className="eu-pages">
      <button type="button" className="eu-pages__item" aria-label={labels?.previous ?? 'Previous page'} disabled={page <= 1} onClick={() => onChange(page - 1)}><Icon name="nav-left" size="md" /></button>
      {pages.map((p, i) => p === '...' ? <span key={`e${i}`} className="eu-pages__gap" aria-hidden="true">...</span> : (
        <button key={p} type="button" className={cn('eu-pages__item eu-type-ui-button', p === page && 'is-selected')} aria-label={`${labels?.page ?? 'Page'} ${p}`} aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button type="button" className="eu-pages__item" aria-label={labels?.next ?? 'Next page'} disabled={page >= pageCount} onClick={() => onChange(page + 1)}><Icon name="nav-right" size="md" /></button>
    </nav>
  );
}

export interface StepDef {
  /** Step name. */
  title: string;
  /** Optional second line. */
  description?: string;
}

export interface StepsProps {
  /** Steps in order. */
  steps: StepDef[];
  /** Index of the current step, starting at 0. Earlier steps show as complete. */
  current: number;
  /** Direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Index of a step that has an error. */
  errorStep?: number;
  /** Accessible name. */
  label?: string;
}

/** Shows progress through a multi-step process and marks the current step with `aria-current`. It shows progress only; the Back and Next buttons are yours. */
export function Steps({ steps, current, orientation = 'horizontal', errorStep, label = 'Progress' }: StepsProps) {
  return (
    <ol aria-label={label} className={cn('eu-steps', `eu-steps--${orientation}`)}>
      {steps.map((s, i) => {
        const state = i === errorStep ? 'error' : i < current ? 'complete' : i === current ? 'current' : 'upcoming';
        return (
          <li key={s.title} aria-current={i === current ? 'step' : undefined} className={cn('eu-step', `is-${state}`)}>
            <span className="eu-step__mark eu-type-body-caption-strong">{state === 'complete' ? <Icon name="check" size="sm" label="Completed" /> : state === 'error' ? <Icon name="warning-circle" size="sm" label="Error" /> : i + 1}</span>
            <span><span className="eu-type-ui-card-title eu-step__title">{s.title}</span>{s.description ? <span className="eu-type-body-caption eu-check__desc eu-step__desc">{s.description}</span> : null}</span>
          </li>
        );
      })}
    </ol>
  );
}

export interface UserMenuProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Person's name. */
  name: string;
  /** Second line, such as a company. */
  subtitle?: string;
  /** Picture URL. Initials show without one. */
  src?: string;
  /** Avatar and chevron only. Name stays available to screen readers. */
  compact?: boolean;
  /** `medium` 32 avatar (default) or `large` 48 avatar (Figma User Menu Size=Large). */
  size?: 'medium' | 'large';
}

/** Profile trigger for the Header. Wrap it in Menu to add the account commands. */
export const UserMenu = React.forwardRef<HTMLButtonElement, UserMenuProps>(function UserMenu({ name, subtitle, src, compact, size = 'medium', className, ...rest }, ref) {
  return (
    <button {...rest} ref={ref} type="button" aria-label={compact ? name : undefined} className={cn('eu-usermenu', className)}>
      <Avatar name={name} src={src} size={size === 'large' ? 'large' : 'small'} />
      {compact ? null : <span className="eu-usermenu__text"><span className="eu-type-ui-card-title eu-usermenu__name">{name}</span>{subtitle ? <span className="eu-type-body-caption eu-check__desc">{subtitle}</span> : null}</span>}
      <Icon name="nav-down" size={size === 'large' ? 'md' : 'sm'} />
    </button>
  );
});

export interface BrandLogoProps {
  /** Which product mark. */
  brand?: 'EuvinoPRO' | 'WIN';
  /** `default` on light surfaces, `inverse` on dark. */
  color?: 'default' | 'inverse';
  /** Scale. */
  size?: 'small' | 'medium' | 'large';
}

/** The product wordmark. */
export function BrandLogo({ brand = 'EuvinoPRO', color = 'default', size = 'medium' }: BrandLogoProps) {
  return <span className={cn('eu-logo', `eu-logo--${color}`, `eu-logo--${size}`)}>{brand}</span>;
}

export interface HeaderProps {
  /** Left slot. Defaults to BrandLogo. */
  brand?: React.ReactNode;
  /** Middle slot, usually TopNav or a search Input. */
  children?: React.ReactNode;
  /** Right slot: actions and UserMenu. */
  actions?: React.ReactNode;
  /** Height: `small` 56, `medium` 64, `large` 72. */
  size?: 'small' | 'medium' | 'large';
  /** `fill`: the middle slot takes the free space (TopNav). `between`: the middle slot keeps its own width (size/field-lg) and sits between the ends, as for a search. */
  layout?: 'fill' | 'between';
}

/** App header bar. Renders a `header` landmark. */
export function Header({ brand, children, actions, size = 'medium', layout = 'fill' }: HeaderProps) {
  return <header className={cn('eu-header', `eu-header--${size}`, layout === 'between' && 'eu-header--between')}>{brand ?? <BrandLogo />}<div className="eu-header__mid">{children}</div><div className="eu-header__actions">{actions}</div></header>;
}

export interface PageHeaderProps {
  /** Page title, the one H1. */
  title: string;
  /** Line under the title. */
  subtitle?: React.ReactNode;
  /** Breadcrumbs slot above the title. */
  breadcrumbs?: React.ReactNode;
  /** Primary action Button slot, on the right. */
  actions?: React.ReactNode;
}

/** Page title, subtitle and primary action. Use one per page, at the top of the content. */
export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="eu-pagehead">
      {breadcrumbs}
      <div className="eu-pagehead__row">
        <div><h1 className="eu-type-mobile-h4 eu-pagehead__title">{title}</h1>{subtitle ? <p className="eu-type-body-small eu-check__desc eu-text">{subtitle}</p> : null}</div>
        {actions ? <div className="eu-pagehead__actions">{actions}</div> : null}
      </div>
    </div>
  );
}

export interface FooterProps {
  /** Legal text. */
  legal: React.ReactNode;
  /** Links on the right. */
  links?: Array<{ label: string; href: string }>;
}

/** Page footer with legal text and links. */
export function Footer({ legal, links }: FooterProps) {
  return <footer className="eu-footer eu-type-ui-footer-link"><span>{legal}</span><nav aria-label="Legal">{links?.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}</nav></footer>;
}
