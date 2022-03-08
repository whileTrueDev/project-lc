import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:4200',
    'http://localhost:4250',
    'http://localhost:4300',
    'http://localhost:3011',
    'http://localhost:3333', // 오버레이 컨트롤러
    'https://xn--hp4b17xa.com', // 크크쇼.com
    'https://www.xn--hp4b17xa.com', // 크크쇼.com

    // 판매자
    'https://seller.xn--hp4b17xa.com', // seller.크크쇼.com
    'https://xn--9z2b23wk2i.xn--hp4b17xa.com', // 판매자.크크쇼.com
    'https://dev-seller.xn--hp4b17xa.com', // dev-seller.크크쇼.com
    // 관리자
    'https://admin.xn--hp4b17xa.com', // admin.크크쇼.com
    'https://dev-admin.xn--hp4b17xa.com', // dev-admin.크크쇼.com
    // 방송인
    'https://broadcaster.xn--hp4b17xa.com', // broadcaster.크크쇼.com
    'https://xn--vh3b23hfsf.xn--hp4b17xa.com', // 방송인.크크쇼.com
    'https://dev-broadcaster.xn--hp4b17xa.com', // dev-broadcaster.크크쇼.com

    'https://overlay-controller.xn--hp4b17xa.com', // 배포한 오버레이컨트롤러 서버
    'https://dev-overlay-controller.xn--hp4b17xa.com', // 배포한 테스트환경용 오버레이컨트롤러 서버
  ],
  credentials: true,
  exposedHeaders: ['X-wt-Access-Token'],
};
