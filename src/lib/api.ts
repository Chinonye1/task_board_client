const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.errorMessage ?? "Request failed");
  }

 
  if (response.status === 204) return null;

  return response.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, data: unknown) =>
    request(path, { method: "POST", body: JSON.stringify(data) }),
  put: (path: string, data: unknown) =>
    request(path, { method: "PUT", body: JSON.stringify(data) }),
  delete: (path: string) => request(path, { method: "DELETE" }),
};