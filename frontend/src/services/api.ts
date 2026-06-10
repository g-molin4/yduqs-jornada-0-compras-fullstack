export async function apiRequest<T>(factory: () => Promise<T>) {
  return factory()
}
