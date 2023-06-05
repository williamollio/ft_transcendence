export function getBaseUrl(): string {
  const currentHostName = window.location.hostname;
  const protocol = window.location.protocol
  return `${protocol}://${currentHostName}/ft_transcendence/api/`;
}
