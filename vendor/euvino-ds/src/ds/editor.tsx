import * as React from 'react';
import { cn } from './cn';
import { Button, IconButton } from './button';
import { Divider } from './layout';
import type { IconName } from './icon';

type Format = 'bold' | 'italic' | 'underline' | 'bullets' | 'numbers' | 'link' | 'mention';

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
  [{ id: 'bold', icon: 'bold' }, { id: 'italic', icon: 'italic' }, { id: 'underline', icon: 'underline' }],
  [{ id: 'bullets', icon: 'list' }, { id: 'numbers', icon: 'numbered-list' }],
  [{ id: 'link', icon: 'link' }],
  [{ id: 'mention', icon: 'at' }],
];

const NAMES: Required<EditorLabels> = {
  toolbar: 'Formatting', bold: 'Bold', italic: 'Italic', underline: 'Underline', bullets: 'Bulleted list', numbers: 'Numbered list',
  link: 'Link', mention: 'Mention someone', cancel: 'Cancel', save: 'Save',
};

/**
 * Text editor for notes and messages: a field that opens into a formatting toolbar with Cancel and Save.
 * Closed it is one line; focus opens it. Toolbar buttons wrap the selection in Markdown. Cmd/Ctrl+Enter saves, Escape cancels.
 * Use Textarea for a plain form field without formatting.
 */
export function Editor({ label, value, onChange, onSave, onCancel, placeholder, defaultExpanded = false, labels }: EditorProps) {
  const t = { ...NAMES, ...labels };
  const field = React.useRef<HTMLTextAreaElement>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(defaultExpanded);
  const expanded = open || value.length > 0;
  const canSave = value.trim().length > 0;

  const replace = (from: number, to: number, text: string, selStart: number, selEnd: number) => {
    const el = field.current;
    if (!el) return;
    onChange(value.slice(0, from) + text + value.slice(to));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(selStart, selEnd); });
  };

  const format = (f: Format) => {
    const el = field.current;
    if (!el) return;
    const a = el.selectionStart;
    const b = el.selectionEnd;
    const sel = value.slice(a, b);
    if (f === 'bullets' || f === 'numbers') {
      const lineStart = value.lastIndexOf('\n', a - 1) + 1;
      const block = value.slice(lineStart, b) || '';
      const lines = block.split('\n').map((l, i) => `${f === 'bullets' ? '- ' : `${i + 1}. `}${l}`).join('\n');
      replace(lineStart, b, lines, lineStart + lines.length, lineStart + lines.length);
      return;
    }
    const wrap: Record<'bold' | 'italic' | 'underline' | 'mention', [string, string]> = { bold: ['**', '**'], italic: ['_', '_'], underline: ['<u>', '</u>'], mention: ['@', ''] };
    if (f === 'link') {
      const text = `[${sel}](https://)`;
      const urlStart = a + sel.length + 3;
      replace(a, b, text, urlStart, urlStart + 8);
      return;
    }
    const [l, r] = wrap[f];
    replace(a, b, `${l}${sel}${r}`, a + l.length, a + l.length + sel.length);
  };

  const cancel = () => { onChange(''); setOpen(false); field.current?.blur(); onCancel?.(); };
  const save = () => { if (canSave) { onSave(value); setOpen(false); } };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
    else if (e.key === 'Escape' && expanded) { e.preventDefault(); cancel(); }
  };
  const onBlur = (e: React.FocusEvent) => {
    if (!value && !root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
  };

  return (
    <div ref={root} className={cn('eu-editor', expanded && 'is-open')} onBlur={onBlur}>
      <textarea
        ref={field} aria-label={label} placeholder={placeholder} value={value} rows={expanded ? 3 : 1}
        onChange={(e) => onChange(e.target.value)} onFocus={() => setOpen(true)} onKeyDown={onKeyDown}
        className="eu-editor__field eu-type-body-small"
      />
      {expanded ? (
        <div className="eu-editor__bar">
          <div role="toolbar" aria-label={t.toolbar} className="eu-editor__tools">
            {GROUPS.map((g, i) => (
              <React.Fragment key={g[0].id}>
                {i > 0 ? <Divider orientation="vertical" /> : null}
                {g.map((b) => <IconButton key={b.id} icon={b.icon} label={t[b.id]} size="small" onMouseDown={(e) => e.preventDefault()} onClick={() => format(b.id)} />)}
              </React.Fragment>
            ))}
          </div>
          <div className="eu-editor__actions">
            <Button variant="tertiary" size="small" onClick={cancel}>{t.cancel}</Button>
            <Button variant="primary" size="small" disabled={!canSave} onClick={save}>{t.save}</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
