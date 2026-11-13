import * as React from 'react';

export type View = 'contacts' | 'organisations' | 'timeline';
export type Route = { name: 'list'; view: View; contactId?: string } | { name: 'organisation'; id: string };

/** Hash routes: #/kontakte, #/kontakte/<id>, #/organisationen, #/timeline, #/organisationen/<id>. */
export function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'organisationen' && parts[1]) return { name: 'organisation', id: parts[1] };
  if (parts[0] === 'organisationen') return { name: 'list', view: 'organisations' };
  if (parts[0] === 'kontakte' && parts[1]) return { name: 'list', view: 'contacts', contactId: parts[1] };
  // Timeline has no page yet, so its address shows Kontakte.
  return { name: 'list', view: 'contacts' };
}

export const hrefFor = {
  view: (v: View) => (v === 'organisations' ? '#/organisationen' : v === 'timeline' ? '#/timeline' : '#/kontakte'),
  organisation: (id: string) => `#/organisationen/${encodeURIComponent(id)}`,
  /** The Kontakte list narrowed to one contact record. */
  contact: (id: string) => `#/kontakte/${encodeURIComponent(id)}`,
};

export function useRoute(): [Route, (href: string) => void] {
  const [route, setRoute] = React.useState<Route>(() => parse(window.location.hash));
  React.useEffect(() => {
    const on = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = React.useCallback((href: string) => { window.location.hash = href.replace(/^#/, ''); }, []);
  return [route, go];
}
