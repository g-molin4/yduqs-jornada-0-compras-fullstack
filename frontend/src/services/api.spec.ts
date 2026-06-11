import { apiRequest } from './api'

describe('apiRequest', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
  })

  it('deve requisitar o caminho da api com cabecalhos json quando houver body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: 'course-1' }),
    })

    globalThis.fetch = fetchMock

    await expect(
      apiRequest('/course', {
        method: 'POST',
        body: JSON.stringify({ test: true }),
      }),
    ).resolves.toEqual({ id: 'course-1' })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/course', {
      method: 'POST',
      body: JSON.stringify({ test: true }),
      headers: expect.any(Headers),
    })

    const headers = fetchMock.mock.calls[0][1]?.headers as Headers
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('deve retornar undefined para respostas sem conteudo', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    }) as typeof fetch

    await expect(apiRequest('/course')).resolves.toBeUndefined()
  })

  it('deve exibir mensagens de erro da api vindas em array', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        message: ['Erro 1', 'Erro 2'],
      }),
    }) as typeof fetch

    await expect(apiRequest('/course')).rejects.toThrow('Erro 1, Erro 2')
  })

  it('deve usar a mensagem padrao quando o payload de erro nao puder ser lido', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error('invalid json')),
    }) as typeof fetch

    await expect(apiRequest('/course')).rejects.toThrow(
      'Nao foi possivel concluir a requisicao.',
    )
  })
})
