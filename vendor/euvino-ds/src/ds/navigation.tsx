import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import { Avatar } from './display';
import { BottleMark } from './brand-mark';
import { Tooltip } from './feedback';

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
  /** Items in order of priority: the first ones stay visible longest. */
  items: SideNavItem[];
  /** Accessible name. */
  label: string;
  /** Icon-only rail, 72 wide. Each icon shows its name in a tooltip. */
  collapsed?: boolean;
  /** Surface. `light` is white (default). `dark` is the navy rail from Figma's Side Nav Theme=Dark. */
  theme?: 'light' | 'dark';
  /** Shows the bottle mark in a tile with a divider above the items (Figma Side Nav Logo). The row is as tall as the small Header. */
  logo?: boolean;
  /** Product name next to the mark while the nav is expanded. */
  logoLabel?: string;
  /** Stays in view at full window height while the page scrolls. The nav itself never scrolls. */
  sticky?: boolean;
  /**
   * With `collapsed`: a toggle at the bottom (and the `[` key) slides the nav out over the page to show names and counts.
   * A modal-style layer dims and blurs the page; choosing an item, clicking the layer or Escape folds it back. The page does not move.
   */
  expandable?: boolean;
  /**
   * Adds a More (⋯) button as the last item. Items that do not fit the height move into its menu from the end of the
   * list, and come back when there is room. The selected item always stays visible. Use with `sticky`.
   */
  overflow?: boolean;
  /** Items that always sit in the More menu, after any that moved there. */
  moreItems?: SideNavItem[];
  /** Names of the built-in parts. Pass them in the page's language. */
  labels?: { expand?: string; collapse?: string; more?: string };
  /** Footer slot, such as a help card. */
  footer?: React.ReactNode;
}

function useFit(list: React.RefObject<HTMLUListElement | null>, enabled: boolean, total: number) {
  const [fit, setFit] = React.useState(total);
  React.useLayoutEffect(() => {
    const ul = list.current;
    if (!enabled || !ul || typeof ResizeObserver === 'undefined') { setFit(total); return; }
    const measure = () => {
      const first = ul.querySelector(':scope > li');
      if (!first) return;
      const gap = parseFloat(getComputedStyle(ul).rowGap) || 0;
      const slot = first.getBoundingClientRect().height + gap;
      if (!slot) return;
      const slots = Math.floor((ul.clientHeight + gap) / slot);
      setFit(Math.max(1, Math.min(total, slots - 1)));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    measure();
    return () => ro.disconnect();
  }, [list, enabled, total]);
  return fit;
}

/** Left navigation between app sections, 240 wide or a 72 rail when collapsed. A collapsed rail can be `expandable`; with `overflow` it never runs out of room. */
export function SideNav({ items, label, collapsed, theme = 'light', logo, logoLabel, sticky, expandable, overflow, moreItems, labels, footer }: SideNavProps) {
  const [open, setOpen] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const nav = React.useRef<HTMLElement>(null);
  const toggle = React.useRef<HTMLButtonElement>(null);
  const more = React.useRef<HTMLButtonElement>(null);
  const menuList = React.useRef<HTMLUListElement>(null);
  const refocus = React.useRef(false);
  const list = React.useRef<HTMLUListElement>(null);
  const canExpand = Boolean(collapsed && expandable);
  const rail = Boolean(collapsed && !open);
  const hasMore = Boolean(overflow || moreItems?.length);

  const fit = useFit(list, Boolean(overflow), items.length);
  let shown = items.slice(0, fit);
  const sel = items.findIndex((i) => i.selected);
  if (sel >= fit && fit > 0) shown = [...items.slice(0, fit - 1), items[sel]];
  const hidden = items.filter((i) => !shown.includes(i));
  const menuItems = [...hidden, ...(moreItems ?? [])];
  const moreSelected = menuItems.some((i) => i.selected);

  React.useEffect(() => {
    if (!canExpand) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (e.key === '[' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    };
    const onDown = (e: MouseEvent) => { if (open && !nav.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [canExpand, open]);

  React.useEffect(() => {
    if (!menu) {
      if (refocus.current) { refocus.current = false; more.current?.focus(); }
      return;
    }
    (menuList.current?.querySelectorAll('a')[0] as HTMLElement | undefined)?.focus();
    setActive(0);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuList.current?.contains(t) && !more.current?.contains(t)) setMenu(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menu]);

  const done = () => { setMenu(false); setOpen(false); };
  const onMenuKey = (e: React.KeyboardEvent) => {
    const links = Array.from(menuList.current?.querySelectorAll('a') ?? []) as HTMLElement[];
    const move = (n: number) => { e.preventDefault(); const i = (n + links.length) % links.length; setActive(i); links[i]?.focus(); };
    if (e.key === 'ArrowDown') move(active + 1);
    else if (e.key === 'ArrowUp') move(active - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(links.length - 1);
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); refocus.current = true; setMenu(false); }
    else if (e.key === 'Tab') setMenu(false);
  };

  const link = (i: SideNavItem) => (
    <a
      href={i.href ?? '#'} aria-current={i.selected ? 'page' : undefined}
      aria-label={rail ? (i.count !== undefined ? `${i.label}, ${i.count}` : i.label) : undefined}
      onClick={(e) => { if (i.onClick) { e.preventDefault(); i.onClick(); } done(); }}
      className={cn('eu-sidenav__item', i.selected && 'is-selected eu-mode-icon-weight-selected')}
    >
      {i.icon ? <Icon name={i.icon} size={collapsed ? 'lg' : 'md'} /> : null}
      {rail ? null : <span className="eu-sidenav__text">{i.label}</span>}
      {i.count !== undefined ? <span aria-hidden={rail || undefined} className={cn('eu-sidenav__count', i.countStatus === 'error' && 'is-error')}>{i.count}</span> : null}
    </a>
  );

  const moreLabel = labels?.more ?? 'More';
  const hiddenCount = menuItems.reduce((n, i) => n + (i.count ?? 0), 0);
  const moreButton = (
    <button
      ref={more} type="button" aria-haspopup="menu" aria-expanded={menu} aria-label={rail ? moreLabel : undefined}
      className={cn('eu-sidenav__item', (menu || moreSelected) && 'is-selected', moreSelected && 'eu-mode-icon-weight-selected')}
      onClick={() => setMenu((m) => !m)}
    >
      <Icon name="more-horiz" size={collapsed ? 'lg' : 'md'} />
      {rail ? null : <span className="eu-sidenav__text">{moreLabel}</span>}
      {hiddenCount > 0 ? <span aria-hidden="true" className={cn('eu-sidenav__count', menuItems.some((i) => i.countStatus === 'error' && i.count) && 'is-error')}>{hiddenCount}</span> : null}
    </button>
  );

  return (
    <nav ref={nav} aria-label={label} className={cn('eu-sidenav', collapsed && 'is-collapsed', rail && 'is-rail', open && 'is-open', theme === 'dark' && 'eu-sidenav--dark', sticky && 'is-sticky')}>
      {open ? <div className="eu-sidenav__scrim" aria-hidden="true" onMouseDown={() => setOpen(false)} /> : null}
      <div className="eu-sidenav__panel">
        {logo ? (
          <div className="eu-sidenav__brand">
            <span className="eu-sidenav__tile"><BottleMark className="eu-sidenav__mark" /></span>
            {!rail && logoLabel ? <span className="eu-type-desktop-h6 eu-sidenav__name">{logoLabel}</span> : null}
          </div>
        ) : null}
        <ul ref={list} className={cn('eu-sidenav__list', overflow && 'is-fitted')}>
          {shown.map((i) => <li key={i.label}>{rail ? <Tooltip content={i.label} position="right">{link(i)}</Tooltip> : link(i)}</li>)}
          {hasMore && menuItems.length > 0 ? (
            <li className="eu-sidenav__more">
              {rail && !menu ? <Tooltip content={moreLabel} position="right">{moreButton}</Tooltip> : moreButton}
              {menu ? (
                <ul ref={menuList} role="menu" aria-label={moreLabel} className="eu-menu eu-sidenav__menu" onKeyDown={onMenuKey}>
                  {menuItems.map((i, n) => (
                    <li key={i.label} role="none">
                      <a
                        role="menuitem" href={i.href ?? '#'} tabIndex={n === active ? 0 : -1} aria-current={i.selected ? 'page' : undefined}
                        className={cn('eu-menu__item eu-type-body-small', i.selected && 'is-selected')}
                        onClick={(e) => { if (i.onClick) { e.preventDefault(); i.onClick(); } done(); }}
                      >
                        {i.icon ? <Icon name={i.icon} size="md" /> : null}
                        <span className="eu-sidenav__text">{i.label}</span>
                        {i.count !== undefined ? <span className={cn('eu-sidenav__count', i.countStatus === 'error' && 'is-error')}>{i.count}</span> : null}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ) : null}
        </ul>
        {footer ? <div className="eu-sidenav__foot">{footer}</div> : null}
        {canExpand ? (
          <button
            ref={toggle} type="button" aria-expanded={open} aria-keyshortcuts="["
            aria-label={rail ? labels?.expand ?? 'Expand navigation' : undefined}
            className="eu-sidenav__item eu-sidenav__toggle" onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'sidebar-collapse' : 'sidebar-expand'} size="lg" />
            {rail ? null : <span className="eu-sidenav__text">{labels?.collapse ?? 'Collapse'}</span>}
          </button>
        ) : null}
      </div>
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
      {compact ? null : <span className="eu-usermenu__text"><span className="eu-type-ui-card-title eu-usermenu__name">{name}</span>{subtitle ? <span className="eu-type-body-caption eu-usermenu__sub">{subtitle}</span> : null}</span>}
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
