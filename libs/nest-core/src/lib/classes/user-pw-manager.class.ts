import { BadRequestException, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

export interface IUserPwManager {
  checkPassword(user: { password: string }, password: string): Promise<boolean>;
  hashPassword(purePw: string): Promise<string>;
  validatePassword(pwInput: string, hashedPw: string): Promise<boolean>;
}

@Injectable()
export class UserPwManager implements IUserPwManager {
  /**
   * 입력된 이메일을 가진 유저가 본인 인증을 하기 위해 비밀번호를 확인함
   * @param user 비밀번호 필드를 포함하는 유저 정보
   * @param pwInput 본인 비밀번호
   * @returns boolean 비밀번호가 맞는지
   */
  async checkPassword(user: { password: string }, pwInput: string): Promise<boolean> {
    if (!user.password) {
      throw new BadRequestException(
        '소셜계정으로 가입된 회원입니다. 비밀번호를 등록해주세요.',
      );
    }
    return this.validatePassword(pwInput, user.password);
  }

  /**
   * 비밀번호를 단방향 암호화 합니다.
   * @param purePw 비밀번호 문자열
   * @returns {string} 비밀번호 해시값
   */
  public async hashPassword(purePw: string): Promise<string> {
    const hashed = await hash(purePw);
    return hashed;
  }

  /**
   * 입력한 비밀번호를 해시된 비밀번호와 비교합니다.
   * @param pwInput 입력한 비밀번호 문자열
   * @param hashedPw 해시된 비밀번호 값
   * @returns {boolean} 올바른 비밀번호인지 여부
   */
  async validatePassword(pwInput: string, hashedPw: string): Promise<boolean> {
    const isCorrect = await verify(hashedPw, pwInput);
    return isCorrect;
  }
}
