const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const prismaPgMock = jest.fn();

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation((options) => {
    prismaPgMock(options);
    return { options };
  }),
}));

jest.mock('@prisma/client/index', () => ({
  PrismaClient: jest.fn().mockImplementation(function PrismaClient(this: {
    $connect: jest.Mock;
    $disconnect: jest.Mock;
    options?: unknown;
  }, options: unknown) {
    this.$connect = mockConnect;
    this.$disconnect = mockDisconnect;
    this.options = options;
  }),
}));

import { PrismaService } from '../prisma.service';

describe('PrismaService', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
      return;
    }

    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('deve lancar erro quando DATABASE_URL nao estiver definida', () => {
    delete process.env.DATABASE_URL;

    expect(() => new PrismaService()).toThrow('DATABASE_URL is not defined.');
  });

  it('deve criar o adaptador do prisma com a string de conexao configurada', () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';

    const service = new PrismaService();

    expect(service).toBeDefined();
    expect(prismaPgMock).toHaveBeenCalledWith({
      connectionString: 'postgresql://localhost:5432/test',
    });
  });

  it('deve conectar na inicializacao do modulo', async () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
    const service = new PrismaService();

    await service.onModuleInit();

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('deve desconectar ao destruir o modulo', async () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
    const service = new PrismaService();

    await service.onModuleDestroy();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
