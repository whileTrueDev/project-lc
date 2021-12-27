module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BROADCASTER_WEB_HOST ||
    `https://xn--vh3b23hfsf.xn--hp4b17xa.com`,
  generateRobotsTxt: true,
  sourceDir: './dist/apps/web-broadcaster-center/.next',
  outDir: './dist/apps/web-broadcaster-center/public',
};
