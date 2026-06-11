const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

type ApiErrorResponse = {
  message?: string | string[]
  error?: string
}

function buildHeaders(init?: RequestInit) {
  const headers = new Headers(init?.headers)

  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json')
  }

  return headers
}

function getErrorMessage(payload: ApiErrorResponse | null, fallback: string) {
  if (!payload?.message) {
    return fallback
  }

  return Array.isArray(payload.message) ? payload.message.join(', ') : payload.message
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init),
  })

  if (!response.ok) {
    let payload: ApiErrorResponse | null = null

    try {
      payload = (await response.json()) as ApiErrorResponse
    } catch {
      payload = null
    }

    throw new Error(getErrorMessage(payload, 'Nao foi possivel concluir a requisicao.'))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
