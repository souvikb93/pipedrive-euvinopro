import * as React from 'react';
import { cn } from './cn';

type SpaceToken = '0' | '0-5' | '1' | '1-5' | '2' | '2-5' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24';

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** `vertical` for a column (default), `horizontal` for a row. */
  direction?: 'vertical' | 'horizontal';
  /** Space token between children, from `spacing/*`: form fields `4`, button rows `2`, page sections `8`. */
  gap?: SpaceToken;
  /** Padding from the same space tokens. */
  padding?: SpaceToken;
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main-axis distribution. `between` pushes children to both ends. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Wrap children onto new lines when they do not fit. */
  wrap?: boolean;
  /** Which element to render, such as `section`, `form` or `ul`. */
  as?: React.ElementType;
}

/** Lays out a row or column with a space token between children. Use it instead of hand-written flex and margins. It is the code form of auto layout in Figma. */
export function Stack({ direction = 'vertical', gap = '4', padding, align, justify, wrap, as: As = 'div', className, style, ...rest }: StackProps) {
  return (
    <As
      {...rest}
      className={cn('eu-stack', className)}
      style={{
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap: gap === '0' ? 0 : `var(--eu-spacing-${gap})`,
        padding: padding ? (padding === '0' ? 0 : `var(--eu-spacing-${padding})`) : undefined,
        alignItems: align && ({ start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' } as const)[align],
        justifyContent: justify && ({ start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' } as const)[justify],
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
    />
  );
}

/** Every text style in the Figma library. */
export type TextStyle =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-large' | 'body' | 'body-small' | 'caption' | 'caption-strong' | 'micro'
  | 'label' | 'card-title' | 'button';
/** Text colour tokens, from `text/*`. */
export type TextTone = 'primary' | 'body' | 'strong-body' | 'muted' | 'disabled' | 'inverse' | 'link' | 'success' | 'info' | 'warning' | 'error';

const TYPE_CLASS: Record<TextStyle, string> = {
  h1: 'desktop-h1', h2: 'desktop-h2', h3: 'desktop-h3', h4: 'desktop-h4', h5: 'desktop-h5', h6: 'desktop-h6',
  'body-large': 'body-large', body: 'body-base', 'body-small': 'body-small', caption: 'body-caption', 'caption-strong': 'body-caption-strong', micro: 'body-micro',
  label: 'ui-label', 'card-title': 'ui-card-title', button: 'ui-button',
};
const DEFAULT_ELEMENT: Partial<Record<TextStyle, React.ElementType>> = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6', caption: 'span', 'caption-strong': 'span', micro: 'span', label: 'span', 'card-title': 'h3', button: 'span' };

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Text style from the library. `h1` to `h6` are Roboto Condensed Bold; everything else is Roboto. */
  variant?: TextStyle;
  /** Colour token. Defaults to `primary` for headings and `body` for reading text. */
  tone?: TextTone;
  /** Element to render when it should differ from the style's default, such as an `h2` styled as `h4`. */
  as?: React.ElementType;
}

/** Any text set in a library text style and colour token. Use it for headings, paragraphs and captions instead of raw font sizes. */
export function Text({ variant = 'body', tone, as, className, style, ...rest }: TextProps) {
  const As = as ?? DEFAULT_ELEMENT[variant] ?? 'p';
  const heading = /^h\d$/.test(variant) || variant === 'label' || variant === 'card-title';
  return <As {...rest} className={cn(`eu-text eu-type-${TYPE_CLASS[variant]}`, className)} style={{ color: `var(--eu-text-${tone ?? (heading ? 'primary' : 'body')})`, ...style }} />;
}

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Text only screen readers should announce. */
  children: React.ReactNode;
}

/** Text for screen readers only, such as a table caption or a live status line. */
export function VisuallyHidden({ className, ...rest }: VisuallyHiddenProps) {
  return <span {...rest} className={cn('eu-sr', className)} />;
}

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Line direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Optional centred label, such as "or". */
  label?: string;
}

/** Separates groups of content. Prefer spacing first; add a line only when spacing is not enough. */
export function Divider({ orientation = 'horizontal', label, className, ...rest }: DividerProps) {
  return (
    <div {...rest} role="separator" aria-orientation={orientation} className={cn('eu-divider', `eu-divider--${orientation}`, className)}>
      {label ? <span className="eu-divider__label eu-type-body-caption">{label}</span> : null}
    </div>
  );
}
