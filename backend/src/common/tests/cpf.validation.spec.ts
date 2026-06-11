import { digitsOnly, isValidCpf } from '../cpf.validation';

describe('validacao de cpf', () => {
  describe('digitsOnly', () => {
    it('deve remover todos os caracteres nao numericos', () => {
      expect(digitsOnly('091.685.659-45')).toBe('09168565945');
    });
  });

  describe('isValidCpf', () => {
    it('deve retornar verdadeiro para um cpf valido', () => {
      expect(isValidCpf('529.982.247-25')).toBe(true);
    });

    it('deve retornar falso para digitos repetidos', () => {
      expect(isValidCpf('111.111.111-11')).toBe(false);
    });

    it('deve retornar falso para digitos verificadores invalidos', () => {
      expect(isValidCpf('529.982.247-24')).toBe(false);
    });

    it('deve retornar falso quando o cpf tiver tamanho invalido', () => {
      expect(isValidCpf('123.456.789-0')).toBe(false);
    });
  });
});
