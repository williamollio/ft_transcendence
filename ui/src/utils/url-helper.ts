export function getBaseUrl(): string {
  const currentHostName = window.location.hostname;
  const protocol = window.location.protocol;
  return `${protocol}://${currentHostName}/`;
}

export function getBaseUrlServer(): string {
  const currentHostName = window.location.hostname;
  const protocol = window.location.protocol;
  return `${protocol}://${currentHostName}/api/`;
}
