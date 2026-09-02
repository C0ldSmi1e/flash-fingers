// Browser-side fetch helper for our own API routes: unwraps the standard
// response envelope and throws the envelope error as an Error.
const api = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const body = (await response.json()) as { data: T; error: string | null };
  if (body.error !== null) {
    throw new Error(body.error);
  }
  return body.data;
};

export { api };
