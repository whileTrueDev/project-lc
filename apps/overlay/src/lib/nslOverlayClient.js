/* eslint-env jquery */
/* global io, */
const socket = io({ transports: ['websocket'] });
const pageUrl = window.location.href;
const liveShoppingId = $('#primary-info').data('liveshopping-id');
const iterateLimit = $('#primary-info').data('number');
const email = $('#primary-info').data('email');
const topMessages = [];
let messageHtml;
let rankingVisible;
let bannerId = 1;

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

async function switchImage() {
  if (rankingVisible) {
    $('.nsl-ranking').css('display', 'flex');
    rankingVisible = false;
    bannerId = 1;
    await setTimeout(() => {
      $('.nsl-ranking').css('display', 'none');
      switchImage();
    }, 10000);
  } else {
    if ($('.horizontal-banner-box').css('display') === 'none') {
      $('.horizontal-banner-box').css('display', 'block');
    }

    $('.horizontal-banner').attr(
      'src',
      `https://lc-project.s3.ap-northeast-2.amazonaws.com/horizontal-banner/${email}/${liveShoppingId}/horizontal-banner-${bannerId}`,
    );

    if (bannerId === iterateLimit) {
      await setTimeout(() => {
        $('.horizontal-banner-box').css('display', 'none');
        rankingVisible = true;
        switchImage();
      }, 10000);
    } else {
      await setTimeout(() => {
        bannerId += 1;
        switchImage();
      }, 10000);
    }
  }
}

setInterval(async () => {
  if (topMessages.length !== 0 && $('.nsl-donation-message').css('display') === 'none') {
    $('.nsl-donation-message').css({ display: 'flex' });
    $('.nsl-donation-message').html(topMessages[0].messageHtml);
    topMessages.splice(0, 1);
    await setTimeout(() => {
      $('.nsl-donation-message').fadeOut(1);
    }, 5000);
  }
}, 2000);

switchImage();

socket.emit('new client', { pageUrl, device });

socket.on('get top-left ranking', (data) => {
  const rankingArray = data;
  rankingArray.forEach((value, index) => {
    $(`.nsl-ranking-text-area-id#nsl-rank-${index}`).text(value.nickname.substr(0, 8));
    $(`.nsl-quantity#nsl-rank-${index}`).text(
      `${value.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}원`,
    );
  });
});

socket.on('get nsl donation message from server', (data) => {
  const { nickname } = data;
  const { price } = data;

  messageHtml = `
      <span id="donation-user-id">
        ${nickname.substr(0, 5)}
      </span>
      <span id="message">님&nbsp;</span>
      <span id="donation-num">
        ${price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
      </span>
      <span id="message">
        원 구매 감사합니다!
      </span>`;

  topMessages.push({ messageHtml });
});

socket.on('refresh ranking from server', () => {
  $('.nsl-ranking-text-area-id').text('');
  $('.nsl-quantity').text('');
});
