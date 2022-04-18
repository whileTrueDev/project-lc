/**
 * axios, react-query 요청이후 에러핸들러에서 에러코드, 메시지 추출하기 위한 함수
 * */
export const parseErrorObject = (error?: any): { status?: number; message?: string } => {
  const response = error?.response?.data?.response;

  if (response) {
    // nestjs 내부 에러 객체
    return {
      status: error?.response?.data?.response.statusCode,
      message: error?.response?.data?.response.message,
    };
  }

  return {
    status: error?.response?.data?.statusCode,
    message: error?.response?.data?.message,
  };
};
