export const emailPattern = /^[\w]+@[\w]+\.[\w][\w]+$/;

export const passwordPattern = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^*+=-]).{8,20}$/;

export const emailRegisterOptions = {
  required: '이메일을 작성해주세요.',
  pattern: {
    value: emailPattern,
    message: '이메일 형식이 올바르지 않습니다.',
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
