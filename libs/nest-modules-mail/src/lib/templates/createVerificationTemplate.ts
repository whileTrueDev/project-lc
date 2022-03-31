export const createVerificationTemplate = (code: string): string => `
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
  <div style="text-align: center;">

    <img width="200px" height="75px" src="https://${process.env.S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightMode.png" alt="kks-logo" />

    <h1 style="padding-top:32px;font-weight:800;">이메일 확인 코드 : ${code}</h1>

    <p>10분 이내에 코드(${code})를 입력하여 이메일 확인을 완료하세요</p>

    <div style="padding-top:32px;">
      <p>이 메일은 크크쇼에서 보낸 메일입니다.</p>
      <p>코드를 요청하지 않았거나 문제가 있다면 메일 회신바랍니다.</p>
      <p style="text-align:center; margin-top: 48px;">크크쇼</p>
    </div>
  </div>
</div>
`;
