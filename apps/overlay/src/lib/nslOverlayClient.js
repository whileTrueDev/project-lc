/* eslint-env jquery */
/* global io, */
const socket = io({ transports: ['websocket'] });
const pageUrl = window.location.href;
const liveShoppingId = $('#primary-info').data('liveshopping-id');
const iterateLimit = $('#primary-info').data('number');
const email = $('#primary-info').data('email');
let rankingVisible;
const bannerId = 1;

function getOS() {
  const { userAgent } = window.navigator;
  const { platform } = window.navigator;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

const device = getOS();

// async function switchImage() {
//   if ($('.horizontal-banner-box').css('display') === 'none') {
//     await setTimeout(() => {
//       $('.horizontal-banner-box').fadeIn(1000);
//     }, 1000);
//   }
//   if (rankingVisible) {
//     await setTimeout(() => {
//       $('.nsl-ranking').fadeIn(1000);
//       rankingVisible = false;
//       bannerId = 1;
//     }, 1000);
//     await setTimeout(() => {
//       $('.nsl-ranking').fadeOut(1000);
//       switchImage();
//     }, 10000);
//   } else {
//     await setTimeout(() => {
//       $('.horizontal-banner')
//         .attr(
//           'src',
//           `https://lc-project.s3.ap-northeast-2.amazonaws.com/horizontal-banner/${email}/${liveShoppingId}/horizontal-banner-${bannerId}`,
//         )
//         .fadeIn(1000);
//     }, 1000);
//     if (bannerId === iterateLimit) {
//       await setTimeout(() => {
//         $('.horizontal-banner-box').fadeOut(1000);
//         rankingVisible = true;
//         switchImage();
//       }, 10000);
//     } else {
//       await setTimeout(() => {
//         $('.horizontal-banner').fadeOut(1000);
//         bannerId += 1;
//         switchImage();
//       }, 10000);
//     }
//   }
// }

// switchImage();

socket.emit('new client', { pageUrl, device });

socket.on('get top-left ranking', (data) => {
  const rankingArray = data;
  rankingArray.forEach((value, index) => {
    $(`.ranking-text-area-id#rank-${index}`).text(value.nickname);
    $(`.quantity#rank-${index}`).text(
      `${value.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}원`,
    );
  });
});
