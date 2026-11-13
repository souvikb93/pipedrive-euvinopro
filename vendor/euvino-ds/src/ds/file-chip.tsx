import { Icon } from './icon';
import { IconButton } from './button';

export interface FileChipProps {
  /** File name, shown in full on hover when it is cut. */
  name: string;
  /** Downloads the file. */
  onDownload: () => void;
  /** Accessible name of the download button. Pass it in the page's language. Default: "Download <name>". */
  downloadLabel?: string;
}

/** An attached file as a compact pill: name and its own download button. Size and type live in the detail view. Use FileItem for uploads. */
export function FileChip({ name, onDownload, downloadLabel }: FileChipProps) {
  return (
    <span className="eu-filechip">
      <Icon name="attachment" size="sm" />
      <span className="eu-type-body-caption eu-filechip__name" title={name}>
        {name}
      </span>
      <IconButton icon="download" size="tiny" label={downloadLabel ?? `Download ${name}`} onClick={onDownload} />
    </span>
  );
}

export interface FileChipListProps {
  /** Files in order. */
  files: Array<{ name: string }>;
  /** Downloads one file. */
  onDownload: (name: string) => void;
  /** Accessible name of each download button. Pass it in the page's language. */
  downloadLabel?: (name: string) => string;
  /** Accessible name of the list, such as "Anhänge". */
  label?: string;
}

/** Attachments on one wrapping line, such as in an ActivityItem footer. */
export function FileChipList({ files, onDownload, downloadLabel, label = 'Attachments' }: FileChipListProps) {
  return (
    <ul className="eu-filechips" aria-label={label}>
      {files.map((f) => (
        <li key={f.name}>
          <FileChip name={f.name} onDownload={() => onDownload(f.name)} downloadLabel={downloadLabel?.(f.name)} />
        </li>
      ))}
    </ul>
  );
}
