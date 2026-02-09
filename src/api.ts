const DEFAULT_API_BASE =
  "https://cma-gallery-worker.cheezy2000.workers.dev/api/exhibits";

export const API_BASE =
  import.meta.env.VITE_API_BASE?.trim() || DEFAULT_API_BASE;

const apiRoot = API_BASE.endsWith("/exhibits")
  ? API_BASE.slice(0, -"/exhibits".length)
  : API_BASE.replace(/\/$/, "");

export const buildExhibitsUrl = (params: Record<string, string>) => {
  const search = new URLSearchParams(params);
  return `${API_BASE}?${search.toString()}`;
};

export const AI_ENDPOINT = `${apiRoot}/ai`;
