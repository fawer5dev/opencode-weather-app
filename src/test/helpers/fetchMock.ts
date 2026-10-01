import { mock } from "bun:test";

const originalFetch = globalThis.fetch;

export type FetchHandler = (url: string) => Response | Promise<Response>;

export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
}

export function installFetchMock(handler: FetchHandler) {
  const fetchMock = mock(async (input: string | URL | Request, _init?: RequestInit): Promise<Response> => {
    return handler(String(input));
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

export function restoreFetch(): void {
  globalThis.fetch = originalFetch;
}
