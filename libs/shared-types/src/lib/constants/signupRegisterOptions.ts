import * as Joi from 'joi';

export const passwordPattern = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^*+=-]).{8,20}$/;
export const adminPasswordPattern = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^*+=-]).{10,20}$/;

export const emailRegisterOptions = {
  required: '이메일을 작성해주세요.',
  validate: {
    noUppercase: (v: string) =>
      v.toLowerCase() === v || '영문 대문자는 사용할 수 없습니다.',
    isValidEmail: (v: string) => {
      const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }), // IANA 등록안된 top level domain 허용 => false로 안하면 오류남 https://github.com/sideway/joi/issues/2390
      });
      const { error } = schema.validate({ email: v });
      if (!error) return true;
      return `유효하지 않은 이메일 형식입니다.`;
    },
  },
};

export const passwordRegisterOptions = {
  required: '암호를 작성해주세요.',
  minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
  maxLength: { value: 20, message: '비밀번호는 20자 이하여야 합니다.' },
  pattern: {
    value: passwordPattern,
    message: '형식이 올바르지 않습니다.',
  },
};

export const adminPasswordRegisterOptions = {
  required: '암호를 작성해주세요.',
  minLength: { value: 8, message: '비밀번호는 10자 이상이어야 합니다.' },
  maxLength: { value: 20, message: '비밀번호는 20자 이하여야 합니다.' },
  pattern: {
    value: adminPasswordPattern,
    message: '형식이 올바르지 않습니다.',
  },
};

export const emailCodeRegisterOptions = {
  required: '인증 코드를 입력해주세요.',
  minLength: {
    value: 6,
    message: '인증코드는 6자 입니다.',
  },
  maxLength: {
    value: 6,
    message: '인증코드는 6자 입니다.',
  },
};
