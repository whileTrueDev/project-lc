import { Prisma } from '@prisma/client';
import { getLocaleNumber } from '../lib/getLocaleNumber';

describe('getLocaleNumber', () => {
  it('should return "0"', () => {
    const result3 = getLocaleNumber(0);
    const result4 = getLocaleNumber('0');
    expect(result3).toBe('0');
    expect(result4).toBe('0');
  });

  it('should return empty string', () => {
    const result = getLocaleNumber(undefined);
    const result2 = getLocaleNumber(null);
    expect(result).toBe('');
    expect(result2).toBe('');
  });

  it('should convert String to locale numberstring', () => {
    const result = getLocaleNumber('28000');
    expect(result).toBe('28,000');
  });

  it('should convert Number to locale numberstring', () => {
    const result = getLocaleNumber(355000);
    expect(result).toBe('355,000');
  });

  describe('getLocaleNumber - convert Decimal instance', () => {
    it('should convert Decimal instance to locale numberstring1', () => {
      const decimal = new Prisma.Decimal(9000.0);
      const result = getLocaleNumber(decimal);
      expect(result).toBe('9,000');
    });

    it('should convert Decimal instance to locale numberstring2', () => {
      const decimal = new Prisma.Decimal(9000.5);
      const result = getLocaleNumber(decimal);
      expect(result).toBe('9,000.5');
    });
  });
});
