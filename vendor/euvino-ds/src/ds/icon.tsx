import * as React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Box,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  CloudSync,
  Copy,
  Download,
  EditPencil,
  Eye,
  EyeClosed,
  Filter,
  Globe,
  Group,
  HelpCircle,
  Home,
  InfoCircle,
  Link,
  Lock,
  LogOut,
  Mail,
  Menu,
  Minus,
  NavArrowDown,
  NavArrowLeft,
  NavArrowRight,
  NavArrowUp,
  Page,
  Plus,
  Refresh,
  Search,
  Settings,
  SidebarCollapse,
  SidebarExpand,
  Sort,
  Star,
  Trash,
  Upload,
  User,
  WarningCircle,
  WarningTriangle,
  Xmark,
  AppWindow,
  Attachment,
  Book,
  Building,
  OpenNewWindow,
  Suitcase,
  ArrowSeparateVertical,
  ChatBubble,
  Phone,
  Reply,
  UserCircle,
  Label,
  MapPin,
  AtSign,
  Bold,
  FloppyDisk,
  Italic,
  NumberedListLeft,
  Underline,
  BoxIso,
  ChatBubbleCheck,
  Coins,
  CreditCards,
  List,
  PageEdit,
  PrecisionTool,
  SendMail,
  Shop,
  StatsDownSquare,
  ViewGrid,
} from 'iconoir-react';

/** ID card: not in Iconoir, drawn on the same 24 grid with round 1.5 strokes so it sits with the others. Also in Figma (Icons, "id-card"). */
function IdCard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1.5em"
      height="1.5em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2.75" y="5" width="18.5" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="2" />
      <path d="M5.5 16c.45-1.6 1.6-2.5 3-2.5s2.55.9 3 2.5" />
      <path d="M14.5 10h4M14.5 13.5h2.5" />
    </svg>
  );
}

/** Organisation: building with a roof sign and a base line. Not in Iconoir; drawn from the EuvinoPRO artwork, filled, in its own 67×100 box. Also used as the organisation page mark. */
function Organisation(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1.5em" height="1.5em" viewBox="0 0 67 100" fill="currentColor" {...props}>
      <path d="M15.207 0H51.352C51.7583 0 52.0864 0.40625 52.0864 0.73438V4.58598C52.0864 4.99223 51.7583 5.32035 51.352 5.32035H15.207C14.8008 5.32035 14.4727 4.9141 14.4727 4.58598V0.73438C14.4727 0.32813 14.8008 0 15.207 0Z" />
      <path d="M50.4062 25.7378H63.4843C63.8905 25.7378 64.2264 25.4058 64.2264 25.0035V21.148C64.2264 20.7456 63.8944 20.4136 63.4843 20.4136H50.4062V25.7378Z" />
      <path d="M3.07813 25.7378H16.1561V20.4136H3.07813C2.67188 20.4136 2.34375 20.7456 2.34375 21.148V25.0035C2.34375 25.4058 2.67187 25.7378 3.07813 25.7378Z" />
      <path d="M61.6172 95.281V27.496H49.5272C49.285 27.496 49.0663 27.3984 48.91 27.2382C48.8905 27.2187 48.871 27.1952 48.8553 27.1757C48.7264 27.0234 48.6522 26.8281 48.6522 26.6171L48.6483 7.07812H17.9103V26.6171C17.9103 27.1015 17.5158 27.496 17.0314 27.496H4.94141V95.281H25.6054V80.926H32.3984V95.281H34.1562V80.926H40.9492V95.281L61.6172 95.281ZM49.7582 34.918H56.0473V41.2071H49.7582V34.918ZM49.7582 48.106H56.0473V54.3951H49.7582V48.106ZM49.7582 61.294H56.0473V67.5831H49.7582V61.294ZM49.7582 75.849H56.0473V82.1381H49.7582V75.849ZM16.8052 82.1381H10.5161V75.849H16.8052V82.1381ZM16.8052 67.5831H10.5161V61.294H16.8052V67.5831ZM16.8052 54.3951H10.5161V48.106H16.8052V54.3951ZM16.8052 41.2071H10.5161V34.918H16.8052V41.2071ZM42.9652 67.5821H36.68V61.293H42.9652V67.5821ZM42.9652 54.3941H36.68V48.105H42.9652V54.3941ZM42.9652 41.2061H36.68V34.917H42.9652V41.2061ZM23.9612 16.6591H42.5982V28.1281H23.9612V16.6591ZM23.594 34.9171H29.8831V41.2062H23.594V34.9171ZM23.594 48.1051H29.8831V54.3942H23.594V48.1051ZM23.594 61.2931H29.8831V67.5822H23.594V61.2931ZM23.594 79.1681V75.8478H42.961V79.1681H23.594Z" />
      <path d="M62.9573 97.0391C62.8245 97.125 62.6604 97.1719 62.4924 97.1719H4.06644C3.89847 97.1719 3.73441 97.1211 3.6016 97.0391H0V100H66.566V97.0391H62.9573Z" />
    </svg>
  );
}

/**
 * "More" dots drawn as solid circles, about twice the diameter of the Iconoir outline dots, so the menu trigger is easy to see at
 * 16 and 20 px. Same drawing in Figma (Icons & Brand › more-horiz, more-vert).
 */
function MoreHoriz(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <circle cx="5" cy="12" r="2.25" />
      <circle cx="12" cy="12" r="2.25" />
      <circle cx="19" cy="12" r="2.25" />
    </svg>
  );
}

function MoreVert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <circle cx="12" cy="5" r="2.25" />
      <circle cx="12" cy="12" r="2.25" />
      <circle cx="12" cy="19" r="2.25" />
    </svg>
  );
}

const ICONS = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  bell: Bell,
  box: Box,
  calendar: Calendar,
  check: Check,
  'check-circle': CheckCircle,
  clock: Clock,
  'cloud-sync': CloudSync,
  copy: Copy,
  download: Download,
  edit: EditPencil,
  eye: Eye,
  'eye-off': EyeClosed,
  filter: Filter,
  globe: Globe,
  group: Group,
  help: HelpCircle,
  home: Home,
  info: InfoCircle,
  link: Link,
  lock: Lock,
  logout: LogOut,
  mail: Mail,
  menu: Menu,
  minus: Minus,
  'more-horiz': MoreHoriz,
  'more-vert': MoreVert,
  'nav-down': NavArrowDown,
  'nav-left': NavArrowLeft,
  'nav-right': NavArrowRight,
  'nav-up': NavArrowUp,
  page: Page,
  plus: Plus,
  refresh: Refresh,
  search: Search,
  settings: Settings,
  'sidebar-collapse': SidebarCollapse,
  'sidebar-expand': SidebarExpand,
  sort: Sort,
  star: Star,
  trash: Trash,
  upload: Upload,
  user: User,
  'warning-circle': WarningCircle,
  'warning-triangle': WarningTriangle,
  close: Xmark,
  // Added for the CRM screens (Pipedrive New). Names match the Figma Iconoir layers.
  'box-iso': BoxIso,
  'chat-bubble-check': ChatBubbleCheck,
  coin: Coins,
  'credit-cards': CreditCards,
  list: List,
  'page-edit': PageEdit,
  'precision-tool': PrecisionTool,
  'send-mail': SendMail,
  shop: Shop,
  'stats-down-square': StatsDownSquare,
  'view-grid': ViewGrid,
  // Search categories.
  'app-window': AppWindow,
  attachment: Attachment,
  book: Book,
  building: Building,
  'open-new-window': OpenNewWindow,
  suitcase: Suitcase,
  // Organisation detail.
  'arrow-separate-vertical': ArrowSeparateVertical,
  'chat-bubble': ChatBubble,
  'id-card': IdCard,
  phone: Phone,
  reply: Reply,
  'user-circle': UserCircle,
  label: Label,
  'map-pin': MapPin,
  organisation: Organisation,
  // Editor toolbar.
  at: AtSign,
  bold: Bold,
  italic: Italic,
  'numbered-list': NumberedListLeft,
  save: FloppyDisk,
  underline: Underline,
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
