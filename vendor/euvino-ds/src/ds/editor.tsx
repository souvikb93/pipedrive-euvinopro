import * as React from 'react';
import { cn } from './cn';
import { Button, IconButton } from './button';
import { Divider } from './layout';
import type { IconName } from './icon';

type Format = 'bold' | 'italic' | 'underline' | 'bullets' | 'numbers' | 'link' | 'mention';
type Mark = 'bold' | 'italic' | 'underline';

/** Markdown for the three inline marks, and the pattern that finds them. */
const MARKS: Record<Mark, { open: string; close: string; find: RegExp }> = {
  bold: { open: '**', close: '**', find: /\*\*([\s\S]*?)\*\*/g },
  italic: { open: '_', close: '_', find: /(?<!\w)_([\s\S]*?)_(?!\w)/g },
  underline: { open: '<u>', close: '</u>', find: /<u>([\s\S]*?)<\/u>/g },
};

/** The span of `mark` around the selection [a, b], as [start of open marker, start of content, end of content, end of close marker]. */
export function markAround(value: string, mark: Mark, a: number, b: number): [number, number, number, number] | null {
  const m = MARKS[mark];
  for (const hit of value.matchAll(m.find)) {
    const start = (hit.index ?? 0) + hit[0].indexOf(m.open);
    const from = start + m.open.length;
    const to = from + hit[1].length;
    if (a >= from && b <= to) return [start, from, to, to + m.close.length];
  }
  return null;
}

export interface EditorLabels {
  /** Accessible name of the toolbar. */
  toolbar?: string;
  bold?: string;
  italic?: string;
  underline?: string;
  bullets?: string;
  numbers?: string;
  link?: string;
  mention?: string;
  cancel?: string;
  save?: string;
}

export interface EditorProps {
  /** Accessible name of the text field, such as "Note". */
  label: string;
  /** Current text. Formatting is written as Markdown (`**bold**`, `_italic_`, `- item`). */
  value: string;
  /** Called with the new text. */
  onChange: (value: string) => void;
  /** Called with the text when someone saves. Clear `value` afterwards. */
  onSave: (value: string) => void;
  /** Called after Cancel clears the text and closes the editor. */
  onCancel?: () => void;
  /** Hint in the empty field, such as "Write a note … Mention someone with @". */
  placeholder?: string;
  /** Starts open with the toolbar showing. By default it opens on focus and closes when empty and left. */
  defaultExpanded?: boolean;
  /** Names of the built-in parts. Pass them in the page's language. */
  labels?: EditorLabels;
}

const GROUPS: Array<Array<{ id: Format; icon: IconName }>> = [
  [
    { id: 'bold', icon: 'bold' },
    { id: 'italic', icon: 'italic' },
    { id: 'underline', icon: 'underline' },
  ],
  [
    { id: 'bullets', icon: 'list' },
    { id: 'numbers', icon: 'numbered-list' },
  ],
  [{ id: 'link', icon: 'link' }],
  [{ id: 'mention', icon: 'at' }],
];

const NAMES: Required<EditorLabels> = {
  toolbar: 'Formatting',
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  bullets: 'Bulleted list',
  numbers: 'Numbered list',
  link: 'Link',
  mention: 'Mention someone',
  cancel: 'Cancel',
  save: 'Save',
};

/**
 * Text editor for notes and messages: a field that opens into a formatting toolbar with Cancel and Save.
 * Closed it is one line; focus opens it. Toolbar buttons wrap the selection in Markdown. Bold, italic and underline are toggles:
 * they show as selected (aria-pressed) while the cursor is inside that mark, and pressing them again removes it. Cmd/Ctrl+Enter saves, Escape cancels.
 * Use Textarea for a plain form field without formatting.
 */
export function Editor({ label, value, onChange, onSave, onCancel, placeholder, defaultExpanded = false, labels }: EditorProps) {
  const t = { ...NAMES, ...labels };
  const field = React.useRef<HTMLTextAreaElement>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(defaultExpanded);
  const [sel, setSel] = React.useState<[number, number]>([0, 0]);
  const pending = React.useRef<[number, number] | null>(null);
  const track = () => {
    const el = field.current;
    if (el) setSel([el.selectionStart, el.selectionEnd]);
  };
  const active = (m: Mark) => markAround(value, m, sel[0], sel[1]) !== null;
  const expanded = open || value.length > 0;
  const canSave = value.trim().length > 0;

  const replace = (from: number, to: number, text: string, selStart: number, selEnd: number) => {
    const el = field.current;
    if (!el) return;
    pending.current = [selStart, selEnd];
    onChange(value.slice(0, from) + text + value.slice(to));
    setSel([selStart, selEnd]);
  };
  // Put the cursor back once the new value is on screen; setting it earlier lets the value update move it to the end.
  React.useLayoutEffect(() => {
    const el = field.current;
    if (!el || !pending.current) return;
    const [a, b] = pending.current;
    pending.current = null;
    el.focus();
    el.setSelectionRange(a, b);
  }, [value]);

  const format = (f: Format) => {
    const el = field.current;
    if (!el) return;
    const a = el.selectionStart;
    const b = el.selectionEnd;
    const picked = value.slice(a, b);
    if (f === 'bullets' || f === 'numbers') {
      const lineStart = value.lastIndexOf('\n', a - 1) + 1;
      const block = value.slice(lineStart, b) || '';
      const lines = block
        .split('\n')
        .map((l, i) => `${f === 'bullets' ? '- ' : `${i + 1}. `}${l}`)
        .join('\n');
      replace(lineStart, b, lines, lineStart + lines.length, lineStart + lines.length);
      return;
    }
    const wrap: Record<'bold' | 'italic' | 'underline' | 'mention', [string, string]> = {
      bold: ['**', '**'],
      italic: ['_', '_'],
      underline: ['<u>', '</u>'],
      mention: ['@', ''],
    };
    if (f === 'link') {
      const text = `[${picked}](https://)`;
      const urlStart = a + picked.length + 3;
      replace(a, b, text, urlStart, urlStart + 8);
      return;
    }
    // Bold, italic and underline toggle: inside a mark, the button removes it.
    if (f === 'bold' || f === 'italic' || f === 'underline') {
      const around = markAround(value, f, a, b);
      if (around) {
        const [start, from, to, end] = around;
        replace(start, end, value.slice(from, to), a - (from - start), b - (from - start));
        return;
      }
    }
    const [l, r] = wrap[f];
    replace(a, b, `${l}${picked}${r}`, a + l.length, a + l.length + picked.length);
  };

  const cancel = () => {
    onChange('');
    setOpen(false);
    field.current?.blur();
    onCancel?.();
  };
  const save = () => {
    if (canSave) {
      onSave(value);
      setOpen(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape' && expanded) {
      e.preventDefault();
      cancel();
    }
  };
  const onBlur = (e: React.FocusEvent) => {
    if (!value && !root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
  };

  return (
    <div ref={root} className={cn('eu-editor', expanded && 'is-open')} onBlur={onBlur}>
      <textarea
        ref={field}
        aria-label={label}
        placeholder={placeholder}
        value={value}
        rows={expanded ? 3 : 1}
        onChange={(e) => {
          onChange(e.target.value);
          setSel([e.target.selectionStart, e.target.selectionEnd]);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onSelect={track}
        onKeyUp={track}
        onMouseUp={track}
        className="eu-editor__field eu-type-body-small"
      />
      {expanded ? (
        <div className="eu-editor__bar">
          <div role="toolbar" aria-label={t.toolbar} className="eu-editor__tools">
            {GROUPS.map((g, i) => (
              <React.Fragment key={g[0].id}>
                {i > 0 ? <Divider orientation="vertical" /> : null}
                {g.map((b) => {
                  const toggle = b.id === 'bold' || b.id === 'italic' || b.id === 'underline';
                  const on = toggle && active(b.id as Mark);
                  return (
                    <IconButton
                      key={b.id}
                      icon={b.icon}
                      label={t[b.id]}
                      size="small"
                      aria-pressed={toggle ? on : undefined}
                      className={cn('eu-editor__tool', on && 'is-active eu-mode-icon-weight-selected')}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => format(b.id)}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="eu-editor__actions">
            <Button variant="tertiary" size="small" onClick={cancel}>
              {t.cancel}
            </Button>
            <Button variant="primary" size="small" disabled={!canSave} onClick={save}>
              {t.save}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
