const DEFAULT_HTTP_BACKEND_URL = "http://127.0.0.1:7001";
const DEFAULT_WS_BACKEND_URL = "ws://127.0.0.1:7001";

function toWebSocketUrl(httpUrl: string): string {
  return httpUrl.replace(/^http/i, "ws");
}

const httpBackendUrl =
  import.meta.env.VITE_HTTP_BACKEND_URL || DEFAULT_HTTP_BACKEND_URL;

export const HTTP_BACKEND_URL = httpBackendUrl;

export const WS_BACKEND_URL =
  import.meta.env.VITE_WS_BACKEND_URL ||
  (import.meta.env.VITE_HTTP_BACKEND_URL
    ? toWebSocketUrl(import.meta.env.VITE_HTTP_BACKEND_URL)
    : DEFAULT_WS_BACKEND_URL);
