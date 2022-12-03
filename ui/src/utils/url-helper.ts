enum HostName {
    LOCAL = "localhost",
}

export function getBaseUrl(): string {
    const currentHostName = window.location.hostname
    if (currentHostName === HostName.LOCAL) {
        return "http://localhost:8080/"
    } else {
        console.error("Unknown hostname")
        return ""
    }
}