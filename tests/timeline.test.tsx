import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Timeline } from '@euvino/ds';
import { HistoryCard, type HistoryHandlers } from '../src/views/timeline/HistoryCard';
import type { HistoryEntry } from '../src/data/history';

afterEach(cleanup);

const handlers = (): HistoryHandlers => ({
  onDetails: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onReply: vi.fn(),
  onShare: vi.fn(),
  onLink: vi.fn(),
  onPerson: vi.fn(),
});

const email: HistoryEntry = {
  id: 'e1',
  kind: 'email',
  day: '2026-10-28',
  time: '10:24',
  title: 'Produktdaten Saison 2027',
  by: { name: 'Johannes Finzer' },
  to: [
    { name: 'info@weingut.de', email: 'info@weingut.de' },
    { name: 'Andreas Geil', email: 'a@geil.de' },
    { name: 'Monika Geil', email: 'm@geil.de' },
  ],
  preview: 'Hallo, anbei die Daten. @Andreas Geil prüft sie.',
  attachments: [{ name: 'Produktdaten_2027.pdf', size: '4,2 MB' }],
};

const renderCard = (e: HistoryEntry, h = handlers()) => {
  render(
    <Timeline label="Verlauf">
      <HistoryCard e={e} h={h} />
    </Timeline>,
  );
  return h;
};

describe('HistoryCard', () => {
  it('shows subject, sender → first recipient with an exact +N, and the attachment', () => {
    renderCard(email);
    expect(screen.getByRole('heading', { name: 'Produktdaten Saison 2027' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Johannes Finzer' })).toBeNull();
    expect(screen.getByRole('link', { name: 'info@weingut.de' }).getAttribute('href')).toBe('mailto:info@weingut.de');
    const more = screen.getByRole('button', { name: '2 weitere Personen' });
    fireEvent.click(more);
    expect(screen.getByRole('link', { name: 'Andreas Geil' }).getAttribute('href')).toMatch(/^#\/kontakte\//);
    expect(screen.getByRole('button', { name: 'Produktdaten_2027.pdf herunterladen' })).toBeTruthy();
  });
  it('opens the details from the card and replies without opening them', () => {
    const h = renderCard(email);
    fireEvent.click(screen.getByRole('button', { name: 'Produktdaten Saison 2027' }));
    expect(h.onDetails).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /Antworten/ }));
    expect(h.onReply).toHaveBeenCalledWith(email, 'reply');
    expect(h.onDetails).toHaveBeenCalledTimes(1);
  });
  it('links mentions of contacts and gives a note only its menu', () => {
    const note: HistoryEntry = {
      id: 'n1',
      kind: 'note',
      day: '2026-10-20',
      time: '11:15',
      title: 'Nachfassen',
      by: { name: 'Johannes Finzer' },
      preview: 'Mit @Andreas Geil gesprochen.',
    };
    renderCard(note);
    expect(screen.getByRole('link', { name: '@Andreas Geil' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Antworten/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'Aktionen für Nachfassen' })).toBeTruthy();
  });
});
