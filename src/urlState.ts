const QUERY_PARAM = 'text';

/** Builds a query string (including leading "?") encoding the given text, or "" if empty. */
export function encodeTextToQuery(text: string): string {
  if (text.length === 0) return '';
  return `?${QUERY_PARAM}=${encodeURIComponent(text)}`;
}

/** Extracts and decodes the shared text from a location.search string, if present. */
export function decodeTextFromQuery(search: string): string | null {
  const params = new URLSearchParams(search);
  const value = params.get(QUERY_PARAM);
  return value !== null && value.length > 0 ? value : null;
}
