export function getBaseUrl(): string {
  const currentHostName = window.location.hostname;
  return `https://${currentHostName}/api`;
}
