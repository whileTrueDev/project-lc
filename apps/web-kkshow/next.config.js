// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 * */
const nextConfig = {
  nx: {
    // Set this to false if you do not want to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  images: {
    domains: [
      'project-lc-dev-test.s3.ap-northeast-2.amazonaws.com',
      'lc-project.s3.ap-northeast-2.amazonaws.com',
      'whiletrue.firstmall.kr',
      'k-kmarket.com',
      // 테스트용 랜덤 사진 사이트. 프로덕션에는 필요 없음.
      // by @hwasurr
      'picsum.photos',
      'i.ibb.co',
      'phinf.pstatic.net',
    ],
  },
};

module.exports = withNx(nextConfig);
