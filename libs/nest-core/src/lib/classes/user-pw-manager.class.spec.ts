import { BadRequestException } from '@nestjs/common';
import { hash } from 'argon2';
import { UserPwManager } from './user-pw-manager.class';

describe('UserPwManager', () => {
  const userPwManager = new UserPwManager();

  describe('checkPassword', () => {
    it('should throw error if user not contains password field', async () => {
      try {
        const data: any = { nickname: 'asdf' };
        await userPwManager.checkPassword(data, 'asdf');
      } catch (err) {
        expect(err).toEqual(
          new BadRequestException(
            '소셜계정으로 가입된 회원입니다. 비밀번호를 등록해주세요.',
          ),
        );
      }
    });

    it('should return true', async () => {
      const pwMocked = await hash('asdf');
      const result = await userPwManager.checkPassword({ password: pwMocked }, 'asdf');
      expect(result).toBeTruthy();
    });

    it('should return false', async () => {
      const pwMocked = await hash('asdf');
      const result = await userPwManager.checkPassword(
        { password: pwMocked },
        'incorrectpassword',
      );
      expect(result).toBeFalsy();
    });
  });

  describe('hashPassword', () => {
    it('should return hashed password', async () => {
      const result = await userPwManager.hashPassword('testpassword');
      expect(result).toBeDefined();
      expect(result.startsWith('$argon2')).toBeTruthy();
    });
  });

  describe('validatePassword', () => {
    it('should return true', async () => {
      const pwMocked = await hash('asdf');
      const result = await userPwManager.validatePassword('asdf', pwMocked);
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
    });

    it('should return false if wrong password was submitted', async () => {
      const pwMocked = await hash('asdf');
      const result = await userPwManager.validatePassword('asdf1234', pwMocked);
      expect(result).toBeDefined();
      expect(result).toBeFalsy();
    });
  });
});
