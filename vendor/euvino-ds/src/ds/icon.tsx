import * as React from 'react';
import {
  ArrowLeft, ArrowRight, Bell, Box, Calendar, Check, CheckCircle, Clock, CloudSync, Copy, Download, EditPencil, Eye, EyeClosed,
  Filter, Globe, Group, HelpCircle, Home, InfoCircle, Link, Lock, LogOut, Mail, Menu, Minus, MoreHoriz, MoreVert, NavArrowDown,
  NavArrowLeft, NavArrowRight, NavArrowUp, Page, Plus, Refresh, Search, Settings, SidebarCollapse, SidebarExpand, Sort, Star,
  Trash, Upload, User, WarningCircle, WarningTriangle, Xmark,
  BoxIso, ChatBubbleCheck, Coins, CreditCards, List, PageEdit, PrecisionTool, SendMail, Shop, StatsDownSquare, ViewGrid,
} from 'iconoir-react';

const ICONS = {
  'arrow-left': ArrowLeft, 'arrow-right': ArrowRight, bell: Bell, box: Box, calendar: Calendar, check: Check, 'check-circle': CheckCircle,
  clock: Clock, 'cloud-sync': CloudSync, copy: Copy, download: Download, edit: EditPencil, eye: Eye, 'eye-off': EyeClosed, filter: Filter,
  globe: Globe, group: Group, help: HelpCircle, home: Home, info: InfoCircle, link: Link, lock: Lock, logout: LogOut, mail: Mail, menu: Menu,
  minus: Minus, 'more-horiz': MoreHoriz, 'more-vert': MoreVert, 'nav-down': NavArrowDown, 'nav-left': NavArrowLeft, 'nav-right': NavArrowRight,
  'nav-up': NavArrowUp, page: Page, plus: Plus, refresh: Refresh, search: Search, settings: Settings, 'sidebar-collapse': SidebarCollapse,
  'sidebar-expand': SidebarExpand, sort: Sort, star: Star, trash: Trash, upload: Upload, user: User, 'warning-circle': WarningCircle,
  'warning-triangle': WarningTriangle, close: Xmark,
  // Added for the CRM screens (Pipedrive New). Names match the Figma Iconoir layers.
  'box-iso': BoxIso, 'chat-bubble-check': ChatBubbleCheck, coin: Coins, 'credit-cards': CreditCards, list: List, 'page-edit': PageEdit,
  'precision-tool': PrecisionTool, 'send-mail': SendMail, shop: Shop, 'stats-down-square': StatsDownSquare, 'view-grid': ViewGrid,
} as const;

/** Every icon name the system ships. The Figma library's Iconoir set has more; add a name here when a screen needs it. */
export type IconName = keyof typeof ICONS;

export interface IconProps {
  /** Which icon to draw, in Iconoir naming: `trash`, `check`, `warning-triangle`, `close`. */
  name: IconName;
  /** Size token: `xs` 12, `sm` 16, `md` 20, `lg` 24. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Accessible name. Leave empty when the icon is decoration next to text; it is then hidden from screen readers. */
  label?: string;
  /** Extra class on the svg. The colour comes from the surrounding text colour. */
  className?: string;
}

/** Draws one icon from the system's Iconoir set. It takes the surrounding text colour. Import icons through this, never from an icon package. */
export function Icon({ name, size = 'md', label, className }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      className={['eu-icon', `eu-icon--${size}`, className].filter(Boolean).join(' ')}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  );
}
