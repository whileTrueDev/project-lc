export const createPreInactivateNoticeTemplate = (targetDetails): string => `
  <div style="text-align: center;">
    <table border="0" cellpadding="0" cellspacing="0" style="color:#1a1a1a; margin:0 auto; border-spacing:0; border-collapse:collapse; border:1px solid #cdcdcd; text-align:left; font-family:dotum; font-size:13px; line-height:1.3;" width="700px">
      <thead>
        <tr>
          <td valign="top">
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding:30px;">
            <a href="${
              targetDetails.userType === 'seller'
                ? 'https://xn--9z2b23wk2i.xn--hp4b17xa.com'
                : 'https://xn--vh3b23hfsf.xn--hp4b17xa.com'
            }" style="border:0" rel="noreferrer noopener" target="_blank">
              <img alt="크크쇼-로고" src="https://${
                process.env.S3_BUCKET_NAME
              }.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightMode.png" loading="lazy" style="width:130px;height:54px" loading="lazy">
            </a>
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding:10px 30px 30px 30px; font-weight:bold; font-family:'맑은 고딕'; font-size:30px;">
            휴면회원 전환 사전안내
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td valign="top" style="padding:10px 30px 0 30px;">
            <ul style="list-style:none; margin:0; padding:0; color:#4d4d4d; text-indent:-15px; padding-left:15px; word-break:keep-all;">
              <li style="margin-bottom:10px;">
                <span style="color:#696969; padding-right:5px; padding-right:5px;">•</span>
                크크쇼는 고객님의 소중한 개인정보를 보호하기 위해 「개인정보 보호법」제39조의6 및 동법 시행령 제48조의5에  따라, 1년간 서비스를 이용하지 않은 회원을 휴면 회원으로 전환하여 회원정보를 별도로 분리보관하고 있습니다.
              </li>
              <li>
                <span style="color:#696969; padding-right:5px;">•</span>
                이에 아래와 같이 휴면전환 사전 안내를 드립니다.
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 30px 50px 30px;">
            <strong style="display:block; font-family:'맑은 고딕'; font-size:20px; padding-bottom:20px;">휴면전환 정보</strong>
            <table border="0" cellpadding="0" cellspacing="0" style="border-top:1px solid #000; text-align:left; font-family:dotum; font-size:13px;" width="640px">
              <tbody>
                <tr>
                  <th colspan="1" rowspan="1" style="padding:18px 15px; font-weight:normal; background-color:#f5f5f5; border-right:1px solid #e1e1e1; border-bottom:1px solid #e1e1e1;">
                    휴면전환 ID
                  </th>
                  <td style="padding:18px 15px; border-bottom:1px solid #e1e1e1;">
                    ${targetDetails.userEmail}
                  </td>
                </tr>
                <tr>
                  <th colspan="1" rowspan="1" style="padding:18px 15px; font-weight:normal; background-color:#f5f5f5; border-right:1px solid #e1e1e1; border-bottom:1px solid #e1e1e1;">
                    휴면 전환 예정일
                  </th>
                  <td style="padding:18px 15px; border-bottom:1px solid #e1e1e1;">
                  ${targetDetails.inactivateDate}
                  </td>
                </tr>
                <tr>
                  <th colspan="1" rowspan="1" style="padding:18px 15px; font-weight:normal; background-color:#f5f5f5; border-right:1px solid #e1e1e1; border-bottom:1px solid #e1e1e1;">
                    조치사항
                  </th>
                  <td style="padding:18px 15px; border-bottom:1px solid #e1e1e1;">
                    개인정보 분리저장
                  </td>
                </tr>
                <tr>
                  <th colspan="1" rowspan="1" style="padding:18px 15px; font-weight:normal; background-color:#f5f5f5; border-right:1px solid #e1e1e1; border-bottom:1px solid #e1e1e1;">
                  분리보관 개인정보
                  </th>
                  <td style="padding:18px 15px; border-bottom:1px solid #e1e1e1;">
                    ${
                      targetDetails.userType === 'seller'
                        ? '이름, 사업자등록증 사본, 사업자등록번호, 휴대전화번호, 통신판매업신고증 사본, 통장 사본, 계좌번호'
                        : '이름, 주소, 휴대전화번호, 통장 사본, 계좌번호, 신분증 사본'
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <p style="margin:10px 0 0 0;">※ 휴면회원 전환을 원치 않으시면 크크쇼 홈페이지에서 로그인해 주시기 바랍니다.</p>
          </td>
        </tr>
        <tr>
          <td style="text-align:center; padding:0 30px 40px 30px; border-radius:3px;">
            <table border="0" cellpadding="0" cellspacing="0" height="46" style="text-align:center; margin:0 auto;" width="180">
              <tbody>
                <tr>
                  <td style="height:46px; font-family:dotum,'돋움'; font-size:14px; background-color:#2a71fa; border-radius:3px;">
                    <a style="display:block; color:#fff; padding:10px 0 ;font-weight:bold; text-decoration:none;" target="_blank" href="${
                      targetDetails.userType === 'seller'
                        ? 'https://xn--9z2b23wk2i.xn--hp4b17xa.com/login'
                        : 'https://xn--vh3b23hfsf.xn--hp4b17xa.com/login'
                    }" rel="noreferrer noopener">
                      로그인 하기
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 30px 40px 30px;">
          </td>
        </tr>
      </tbody>
      <!-- 안내성 수신동의 footer -->
      <tfoot>
        <tr>
          <td>
            <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0; border-collapse:collapse; background-color:#f5f5f5; border-top:1px solid #ccc; padding:30px; line-height:1.7; font-size:11px;" width="700">
              <tbody>
                <tr>
                  <td colspan="2" style="padding:30px 30px 15px 30px;" width="700">
                    <p style="margin:0; word-break:keep-all; font-size:11px;">본 메일은 발신전용이므로, 문의사항은 고객센터를 이용해 주시기 바랍니다.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td valign="middle" style="padding:0 0 30px 30px;" width="120">
                    <img alt="크크쇼-로고" src="https://${
                      process.env.S3_BUCKET_NAME
                    }.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightMode.png" loading="lazy" style="width:65px;height:27px" loading="lazy">
                  </td>
                  <td style="padding:0 30px 30px 0;" width="580">
                    <p style="margin:0; word-break:keep-all; font-size:11px;">대표이사. 강동기  |  사업자등록번호. 659-03-01549 <br> 사업장소재지. 부산광역시 금정구 장전온천천로 51 (테라스파크) 313호<br>
                      통신판매업신고번호. 2019-부산금정-0581  |  개인정보 관리책임자. 기획 및 경영지원팀장 전민관<br>ⓒ 2021 whiletrue. All Rights Reserved.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
`;

export const createInactivateNoticeTemplate = (targetDetails): string => `
  <div style="text-align: center;">
    <table border="0" cellpadding="0" cellspacing="0" style="color:#1a1a1a; margin:0 auto; border-spacing:0; border-collapse:collapse; border:1px solid #cdcdcd; text-align:left; font-family:dotum; font-size:13px; line-height:1.3;" width="700px">
      <thead>
        <tr>
          <td valign="top">
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding:30px;">
            <a href="${
              targetDetails.userType === 'seller'
                ? 'https://xn--9z2b23wk2i.xn--hp4b17xa.com'
                : 'https://xn--vh3b23hfsf.xn--hp4b17xa.com'
            }" style="border:0" rel="noreferrer noopener" target="_blank">
              <img alt="크크쇼-로고" src="https://${
                process.env.S3_BUCKET_NAME
              }.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightMode.png" loading="lazy" style="width:130px;height:54px" loading="lazy">
            </a>
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding:10px 30px 30px 30px; font-weight:bold; font-family:'맑은 고딕'; font-size:30px;">
            휴면회원 전환 안내
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td valign="top" style="padding:10px 30px 0 30px;">
            <ul style="list-style:none; margin:0; padding:0; color:#4d4d4d; text-indent:-15px; padding-left:15px; word-break:keep-all;">
              <li style="margin-bottom:10px;">
                <span style="color:#696969; padding-right:5px; padding-right:5px;">•</span>
                크크쇼는 고객님의 소중한 개인정보를 보호하기 위해 「개인정보 보호법」제39조의6 및 동법 시행령 제48조의5에  따라, 1년간 서비스를 이용하지 않은 회원을 휴면 회원으로 전환하여 회원정보를 별도로 분리보관하고 있습니다.
              </li>
              <li>
                <span style="color:#696969; padding-right:5px;">•</span>이에 아래와 같이 휴면전환 안내를 드립니다.
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 30px 50px 30px;">
            <strong style="display:block; font-family:'맑은 고딕'; font-size:20px; padding-bottom:20px;">휴면전환 정보</strong>
            <table border="0" cellpadding="0" cellspacing="0" style="border-top:1px solid #000; text-align:left; font-family:dotum; font-size:13px;" width="640px">
              <tbody>
                <tr>
                  <th colspan="1" rowspan="1" style="padding:18px 15px; font-weight:normal; background-color:#f5f5f5; border-right:1px solid #e1e1e1; border-bottom:1px solid #e1e1e1;">
                    휴면전환 ID
                  </th>
                  <td style="padding:18px 15px; border-bottom:1px solid #e1e1e1;">
                    ${targetDetails.userEmail}
                  </td>
                </tr>
                <tr>
                  <th colspan="1" rowspan="1" style="padding:18px 15px; font-weight:normal; background-color:#f5f5f5; border-right:1px solid #e1e1e1; border-bottom:1px solid #e1e1e1;">
                    조치사항
                  </th>
                  <td style="padding:18px 15px; border-bottom:1px solid #e1e1e1;">
                    개인정보 분리저장
                  </td>
                </tr>
                <tr>
                  <th colspan="1" rowspan="1" style="padding:18px 15px; font-weight:normal; background-color:#f5f5f5; border-right:1px solid #e1e1e1; border-bottom:1px solid #e1e1e1;">
                  분리보관 개인정보
                  </th>
                  <td style="padding:18px 15px; border-bottom:1px solid #e1e1e1;">
                    ${
                      targetDetails.userType === 'seller'
                        ? '이름, 사업자등록증 사본, 사업자등록번호, 휴대전화번호, 통신판매업신고증 사본, 통장 사본, 계좌번호'
                        : '이름, 주소, 휴대전화번호, 통장 사본, 계좌번호, 신분증 사본'
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <p style="margin:10px 0 0 0;">※ 다시 활성화 하시려면 크크쇼 홈페이지에서 로그인해 주시기 바랍니다.</p>
          </td>
        </tr>
        <tr>
          <td style="text-align:center; padding:0 30px 40px 30px; border-radius:3px;">
            <table border="0" cellpadding="0" cellspacing="0" height="46" style="text-align:center; margin:0 auto;" width="180">
              <tbody>
                <tr>
                  <td style="height:46px; font-family:dotum,'돋움'; font-size:14px; background-color:#2a71fa; border-radius:3px;">
                    <a style="display:block; color:#fff; padding:10px 0 ;font-weight:bold; text-decoration:none;" target="_blank" href="${
                      targetDetails.userType === 'seller'
                        ? 'https://xn--9z2b23wk2i.xn--hp4b17xa.com/login'
                        : 'https://xn--vh3b23hfsf.xn--hp4b17xa.com/login'
                    }" rel="noreferrer noopener">
                      로그인 하기
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 30px 40px 30px;">
          </td>
        </tr>
      </tbody>
      <!-- 안내성 수신동의 footer -->
      <tfoot>
        <tr>
          <td>
            <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0; border-collapse:collapse; background-color:#f5f5f5; border-top:1px solid #ccc; padding:30px; line-height:1.7; font-size:11px;" width="700">
              <tbody>
                <tr>
                  <td colspan="2" style="padding:30px 30px 15px 30px;" width="700">
                    <p style="margin:0; word-break:keep-all; font-size:11px;">본 메일은 발신전용이므로, 문의사항은 고객센터를 이용해 주시기 바랍니다.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td valign="middle" style="padding:0 0 30px 30px;" width="120">
                    <img alt="크크쇼-로고" src="https://${
                      process.env.S3_BUCKET_NAME
                    }.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightMode.png" loading="lazy" style="width:65px;height:27px" loading="lazy">
                  </td>
                  <td style="padding:0 30px 30px 0;" width="580">
                    <p style="margin:0; word-break:keep-all; font-size:11px;">대표이사. 강동기  |  사업자등록번호. 659-03-01549 <br> 사업장소재지. 부산광역시 금정구 장전온천천로 51 (테라스파크) 313호<br>
                      통신판매업신고번호. 2019-부산금정-0581  |  개인정보 관리책임자. 기획 및 경영지원팀장 전민관<br>ⓒ 2021 whiletrue. All Rights Reserved.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
`;
