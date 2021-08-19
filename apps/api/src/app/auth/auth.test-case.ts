// ES6 version
import { hash } from 'argon2';

export async function findOne({ email }: { email: string }) {
  const testPw = await hash('올바른비밀번호입력');
  const repository = [
    {
      id: 3,
      email: 'qkrcksdn0208@naver.com',
      name: 'authtestuser',
      password: testPw,
    },
  ];

  const emailList = repository.map((element) => element.email);

  if (!emailList.includes(email)) {
    return null;
  }

  return repository[emailList.indexOf(email)];
}

export class MockSellerService {
  findOne = findOne;
}

export const authTestCases = [
  {
    param: { email: 'qkrcksdn0208@naver.com', pwdInput: '올바른비밀번호입력' },
    result: { sub: 'qkrcksdn0208@naver.com' },
  },
  {
    param: { email: 'qkrcksdn0208@naver.com', pwdInput: '' },
    result: null,
  },
  {
    param: { email: 'qkrcksdn0208@naver.com', pwdInput: '잘못된비밀번호입력' },
    result: null,
  },
  {
    param: { email: '존재하지않는이메일입력', pwdInput: '올바른비밀번호입력' },
    result: null,
  },
];
