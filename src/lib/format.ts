/** URL-safe id from a name, such as "Weingut Helmut Geil" → "weingut-helmut-geil". */
export const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, '');

/** "11.11.2026 · 09:00" as a sortable string. */
export const activityKey = (v: string) => v.replace(/^(\d{2})\.(\d{2})\.(\d{4}) · (.*)$/, '$3$2$1 $4');
