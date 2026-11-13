import type { Attachment } from '../../data/history';

/** Saves an attachment. The prototype has no file store, so the file holds a short placeholder text. */
export function download(a: Attachment) {
  const blob = new Blob([`${a.name}\nBeispieldatei aus dem EuvinoPRO-Prototyp.`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = a.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Downloads one of an entry's attachments by name. */
export const downloadByName = (list: Attachment[]) => (name: string) => {
  const a = list.find((x) => x.name === name);
  if (a) download(a);
};
