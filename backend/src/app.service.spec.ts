import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('deve retornar a mensagem padrao de saudacao', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
