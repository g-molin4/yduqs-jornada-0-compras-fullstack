import {
  isValidBirthDate,
  isValidFullName,
  isValidPhone,
} from '../student.validation';

describe('validacao de estudante', () => {
  describe('isValidBirthDate', () => {
    it('deve aceitar uma data passada', () => {
      expect(isValidBirthDate(new Date('1999-06-20T00:00:00.000Z'))).toBe(true);
    });

    it('deve aceitar a data de hoje', () => {
      expect(isValidBirthDate(new Date())).toBe(true);
    });

    it('deve rejeitar uma data futura', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(isValidBirthDate(tomorrow)).toBe(false);
    });

    it('deve rejeitar uma data invalida', () => {
      expect(isValidBirthDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('deve aceitar um celular valido', () => {
      expect(isValidPhone('(21) 98765-4321')).toBe(true);
    });

    it('deve aceitar um telefone fixo valido', () => {
      expect(isValidPhone('(19) 3456-7890')).toBe(true);
    });

    it('deve rejeitar digitos repetidos', () => {
      expect(isValidPhone('(11) 11111-1111')).toBe(false);
    });

    it('deve rejeitar ddd invalido', () => {
      expect(isValidPhone('(10) 98765-4321')).toBe(false);
    });

    it('deve rejeitar tamanhos invalidos', () => {
      expect(isValidPhone('(21) 9999-999')).toBe(false);
    });
  });

  describe('isValidFullName', () => {
    it('deve aceitar nomes com pelo menos duas partes', () => {
      expect(isValidFullName('Gabriel Silva')).toBe(true);
    });

    it('deve aceitar nomes com espacos extras ao redor', () => {
      expect(isValidFullName('  Maria   Souza  ')).toBe(true);
    });

    it('deve rejeitar um nome unico', () => {
      expect(isValidFullName('Gabriel')).toBe(false);
    });

    it('deve rejeitar valores em branco', () => {
      expect(isValidFullName('   ')).toBe(false);
    });
  });
});
