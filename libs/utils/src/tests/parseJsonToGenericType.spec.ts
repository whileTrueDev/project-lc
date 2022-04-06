import { parseJsonToGenericType } from '../lib/parseJsonToGenericType';

const dummy = { example: 'done' };
type Dummy = typeof dummy;
describe('parseJsonToGenericType', () => {
  test('JSON을 변환', () => {
    const result = parseJsonToGenericType<Dummy>(dummy);
    expect(result).toMatchObject(dummy);
  });

  test('JSON을 반환2', () => {
    const dummy2 = JSON.stringify(dummy);
    const result = parseJsonToGenericType<Dummy>(dummy2);
    expect(result).toMatchObject<Dummy>(dummy);
  });
});
