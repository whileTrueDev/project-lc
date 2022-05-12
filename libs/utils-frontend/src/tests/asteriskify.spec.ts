import { asteriskify } from '../lib/asteriskify';

describe('asteriskify', () => {
  test('별표처리', () => {
    const result1 = asteriskify('맵찌리침착맨');
    const result3 = asteriskify('침착맨');
    const result4 = asteriskify('과학민수');
    expect(result1).toBe('맵****맨');
    expect(result3).toBe('침*맨');
    expect(result4).toBe('과**수');
  });
});
