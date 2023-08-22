export function getBaseUrl(): string {
  const currentHostName = import.meta.env.VITE_DOMAIN;
  return `${currentHostName}/`;
}

export function getBaseUrlServer(): string {
  const currentHostName = import.meta.env.VITE_DOMAIN;
  return `${currentHostName}/api/`;
}
