export function getBaseUrl(): string {
  const currentHostName = window.location.hostname;
    return `http://${currentHostName}:8080/`;
}
