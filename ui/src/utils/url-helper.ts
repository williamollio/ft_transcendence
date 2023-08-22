export function getBaseUrl(): string {
  const currentHostName = window.location.origin;
  return `${currentHostName}/`;
}

export function getBaseUrlServer(): string {
  const currentHostName = window.location.origin;
  return `${currentHostName}/api/`;
}
