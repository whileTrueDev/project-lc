/* eslint-env jquery */
/* global io, */
/* eslint no-undef: "error" */
/* eslint import/extensions: "off" */
import { chickenMovement } from './animation.js';

const socket = io({ transports: ['websocket'] });
const pageUrl = window.location.href;
const messageArray = [];
let prevRankingArray = [];
// script tag에서 정보를 받아옵니다
const iterateLimit = $('#primary-info').data('number') + 1;
const liveShoppingId = $('#primary-info').data('liveshopping-id');
const email = $('#primary-info').data('email');
const bucketName = $('#primary-info').data('bucket-name');
const rankingToRenderArray = [];

let streamerAndProduct;
let startDate = new Date('2021-09-27T14:05:00+0900');
let endDate = new Date('2021-09-04T15:00:00+0900');
let feverDate = new Date('2021-09-27T14:05:00+0900');
let bannerId = 1;
let combo = 1;
let bgmVolume = 0.1;
let isBgmPlaying = false;
const bottomMessages = [];
const topMessages = [];

let messageHtml;
const bottomTextIndex = 0;

function getOS() {
  const { userAgent } = window.navigator;
  const { platform } = navigator.userAgent;
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

// 방송시간 타이머
function dailyMissionTimer() {
  setInterval(function timer() {
    const roomName = pageUrl.split('/').pop();

    // 현재 날짜를 new 연산자를 사용해서 Date 객체를 생성
    const now = new Date();

    const extraTimeToStart = startDate.getTime() - now.getTime();

    const extraHoursToStart = Math.floor(
      (extraTimeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    const extraMinutesToStart = Math.floor(
      (extraTimeToStart % (1000 * 60 * 60)) / (1000 * 60),
    );

    const extraSecondsToStart = Math.floor((extraTimeToStart % (1000 * 60)) / 1000);
    if (extraHoursToStart === 0 && extraMinutesToStart === 0) {
      if (extraSecondsToStart === 11) {
        socket.emit('send notification signal', { roomName, streamerAndProduct });
      } else if (extraSecondsToStart === 5) {
        // 5sec-timer.MP3
        $('body').append(`
        <iframe src="/audio/5sec-timer.MP3" id="sec-timer" allow="autoplay" style="display:none"></iframe>
        `);
      } else if (extraSecondsToStart === 0) {
        $('body').remove('#sec-timer');
        const introHtml = `
          <video class="inner-video-area" autoplay>
            <source src="/videos/intro.mp4" type="video/mp4">
          </video>
            `;
        $('.full-video').html(introHtml);
        $('.full-video').fadeIn(500);
        $('.inner-video-area').on('ended', function () {
          $('.live-commerce').show();
          $('.full-video').fadeOut(500);
        });
      }
    }

    let distance = endDate.getTime() - now.getTime();
    if (distance < 0) {
      distance = 0;
    }
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    hours = hours < 10 ? `0${String(hours)}` : String(hours);
    minutes = minutes < 10 ? `0${String(minutes)}` : String(minutes);
    seconds = seconds < 10 ? `0${String(seconds)}` : String(seconds);

    if (hours !== '00') {
      // 남은 시간이 1시간 이상이면 시간까지 표시
      $('#time-hour').show();
      $('#hour-min-separator').show();
      $('#time-hour').text(hours);
    } else {
      // 남은 시간이 1시간 이하면 시간 표시 안함
      $('#time-hour').css({ display: 'none' });
      $('#hour-min-separator').css({ display: 'none' });
    }
    $('#time-min').text(minutes);
    $('#time-sec').text(seconds);

    if (
      hours !== '00' &&
      ($('.bottom-timer').attr('class').includes('warning') ||
        $('.bottom-timer').attr('class').includes('urgent'))
    ) {
      if ($('.bottom-timer').attr('class').includes('warning')) {
        $('.bottom-timer').removeClass('warning');
      } else {
        $('.bottom-timer').removeClass('urgent');
        $('.bottom-area-left-icon#clock').removeClass('urgent');
      }
    }

    if (hours === '00') {
      if (Number(minutes) === 5 && Number(seconds) === 0) {
        // 5분 남았습니다 tts 삽입 위치
        socket.emit('send end notification signal', roomName);
      }
      if (Number(minutes) < 5 && !$('.bottom-timer').attr('class').includes('urgent')) {
        // 5분 이하 최초진입
        $('.bottom-timer').addClass('urgent');
        $('.bottom-area-left-icon#clock').addClass('urgent');
      } else if (
        // 10분 이하 최초진입
        Number(minutes) < 10 &&
        Number(minutes) >= 5 &&
        !$('.bottom-timer').attr('class').includes('warning')
      ) {
        $('.bottom-timer').addClass('warning');
      } else if (
        // 5분 이하에서 5~10분 사이로 돌아올 때
        $('.bottom-area-left-icon#clock').attr('class').includes('urgent') &&
        Number(minutes) >= 5 &&
        Number(minutes) <= 10
      ) {
        $('.bottom-timer').addClass('warning');
        $('.bottom-timer').removeClass('urgent');
        $('.bottom-area-left-icon#clock').removeClass('urgent');
      } else if (
        // 5분 이하에서 10분 이상으로 돌아갈 때
        $('.bottom-area-left-icon#clock').attr('class').includes('urgent') &&
        Number(minutes) >= 10
      ) {
        $('.bottom-timer').removeClass('urgent');
        $('.bottom-area-left-icon#clock').removeClass('urgent');
      } else if (
        // 5~10분 사이에서 10분 이상으로 돌아갈 때
        Number(minutes) >= 10 &&
        $('.bottom-timer').attr('class').includes('warning')
      ) {
        $('.bottom-timer').removeClass('warning');
      }
      if (
        $('.bottom-area-left-icon').attr('src') === '/images/egg.png' &&
        Number(minutes) === 0 &&
        Number(seconds) === 0
      ) {
        $('.bottom-area-left-icon').removeClass('urgent');
        $('.bottom-area-left-icon').attr('src', '/images/softbank-chick.png');
      }
    }
  }, 1000);
}

// 피버타임 타이머
function feverTimer() {
  setInterval(function timer() {
    // 현재 날짜를 new 연산자를 사용해서 Date 객체를 생성
    const now = new Date();

    let feverDistance = feverDate.getTime() - now.getTime();
    if (feverDistance < 0) {
      feverDistance = 0;
    }
    let feverMinutes = Math.floor((feverDistance % (1000 * 60 * 60)) / (1000 * 60));
    let feverSeconds = Math.floor((feverDistance % (1000 * 60)) / 1000);

    feverMinutes = feverMinutes < 10 ? `0${String(feverMinutes)}` : String(feverMinutes);
    feverSeconds = feverSeconds < 10 ? `0${String(feverSeconds)}` : String(feverSeconds);

    $('#fever-time-min').text(feverMinutes);
    $('#fever-time-sec').text(feverSeconds);
  }, 1000);
}

// 세로배너 전환
async function switchImage() {
  if (bannerId === iterateLimit) {
    bannerId = 1;
  }
  await setTimeout(() => {
    $('.vertical-banner')
      .attr(
        'src',
        `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/vertical-banner/${email}/${liveShoppingId}/vertical-banner-${bannerId}`,
      )
      .fadeIn(1000);
  }, 1000);
  await setTimeout(() => {
    $('.vertical-banner').fadeOut(1000);
    bannerId += 1;
    switchImage();
  }, 10000);
}

// 우측상단 응원문구 이벤트 및 랭킹 10초간격 setInterval
// 메세지가 뜰 때, 랭킹도 같이 반영된다
// 이전의 메세지가 완전히 사라진 후, 다음 메세지가 뜬다
setInterval(async () => {
  if (messageArray.length && $('.top-right').css('display') === 'none') {
    if (rankingToRenderArray.length) {
      rankingToRenderArray[0].rankings.forEach((value, index) => {
        $(`.ranking-text-area-id#rank-${index}`).text(value.nickname);
        $(`.quantity#rank-${index}`).text(
          `${value.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}원`,
        );
        // 랭킹 1위가 변경된 경우에 랭킹 1위 닉네임 하이라이트 애니메이션 발생
        if (index === 0 && rankingToRenderArray[0].animate) {
          $('.ranking-text-area-id#rank-0').addClass('ranking-pop');
          setTimeout(() => {
            $('.ranking-text-area-id#rank-0').removeClass('ranking-pop');
          }, 6000);
        }
      });
    }

    if (!messageArray[0].audioBlob) {
      $('.top-right').html(messageArray[0].messageHtml);
      $('.top-right').css({ display: 'flex' });
    } else {
      $('.top-right').html(messageArray[0].messageHtml);
      $('.top-right').css({ display: 'flex' });
    }
    await setTimeout(() => {
      if (messageArray[0].audioBlob) {
        const sound = new Audio(messageArray[0].audioBlob);
        sound.play();
      }
      rankingToRenderArray.splice(0, 1);
      messageArray.splice(0, 1);
    }, 1500);
    await setTimeout(() => {
      $('.top-right').fadeOut(800, function () {
        $('.donation-image').attr('src', '/images/invisible.png');
      });
    }, 10000);
  }
}, 2000);

// 비회원 메세지
// 회원 응원메세지와는 다르게 5초동안만 보여진다
setInterval(async () => {
  if (topMessages.length !== 0 && $('.top-wrapper').css('display') === 'none') {
    $('.top-wrapper').css({ display: 'flex' });
    $('.top-wrapper').html(topMessages[0].messageHtml);
    topMessages.splice(0, 1);
    await setTimeout(() => {
      $('.top-wrapper').fadeOut(800);
    }, 5000);
  }
}, 2000);

// 중간금액 알림 폭죽효과 사용시 하늘에서 떨어지는 닉네임들 애니메이션 효과
function makeRain(users, delay) {
  let i = 0;
  $('.letters').show();
  const interval = setInterval(function () {
    const span = document.createElement('span');
    span.appendChild(document.createTextNode(users[i].nickname));
    const div = document.createElement('div');
    div.appendChild(span);
    div.style.position = 'absolute';
    div.style.top = `${Math.floor(Math.random() * 0)}px`;
    div.style.left = `${Math.floor(Math.random() * 1920)}px`;
    div.className = 'rain';
    div.style.opacity = '0';
    $('.letters').append(div);

    if (i++ >= users.length - 1) clearInterval(interval);
  }, delay);
}

// 하단 띠 배너 영역 구매메세지 기능 현재는 사용안함
// 필요시 주석해제
// async function switchBottomText() {
//   if (bottomTextIndex >= bottomMessages.length) {
//     bottomTextIndex = 0;
//   }
//   if (bottomMessages.length !== 0) {
//     await setTimeout(() => {
//       $('.bottom-area-text').text(`${bottomMessages[bottomTextIndex]}`).fadeIn(500);
//       bottomTextIndex += 1;
//     }, 1000);
//     await setTimeout(() => {
//       $('.bottom-area-text').fadeOut(500);
//       switchBottomText();
//     }, 10000);
//   } else {
//     await setTimeout(() => {
//       switchBottomText();
//     }, 10000);
//   }
// }
// -------------------------------------  실행 ---------------------------------
dailyMissionTimer();
switchImage();
feverTimer();
// 하단 띠 배너 영역 구매메세지 기능 현재는 사용안함
// 필요시 주석해제
// switchBottomText();
//------------------------------------------------------------------------------

const device = getOS();

// 최초 접속시 room에 socketId를 등록하기 위한 이벤트
socket.emit('new client', { pageUrl, device });

// 방송 시작 시간 종료시간 받아오는 이벤트
socket.emit('get date from registered liveshopping', {
  liveShoppingId,
  roomName: pageUrl.split('/').pop(),
});

// 랭킹
socket.on('get top-left ranking', (rankings) => {
  if ($('.ranking-text-area#title').css('display') === 'none') {
    if (prevRankingArray[0].nickname !== rankings[0].nickname) {
      // 랭킹 1위가 바뀌는 경우, 닉네임 하이라이트 효과
      rankingToRenderArray.push({ rankings, animate: true });
    } else {
      rankingToRenderArray.push({ rankings, animate: false });
    }
  } else {
    // 첫 구매 발생시 랭킹 영역 포디움 이미지에서 랭킹 형태로 전환
    $('.ranking-text-area#title').css({ display: 'none' });
    $('.ranking-area-inner').html(
      `<p class="ranking-text-area" id="rank-0">
        <span class="ranking-id-wrapper">
          <img src="/images/crown.png" id="ranking-icon" />
          <span class="ranking-text-area-id" id="rank-0">
          </span>
        </span>
        <span class="quantity" id="rank-0">
        </span>
      </p>
      <p class="ranking-text-area" id="rank-1">
        <span class="ranking-id-wrapper">
          <img src="/images/first.png" id="ranking-icon" />
          <span class="ranking-text-area-id" id="rank-1">
          </span>
        </span>
        <span class="quantity" id="rank-1">
        </span>
      </p>
      <p class="ranking-text-area" id="rank-2">
        <span class="ranking-id-wrapper">
          <img src="/images/second.png" id="ranking-icon" />
          <span class="ranking-text-area-id" id="rank-2">
          </span>
        </span>
        <span class="quantity" id="rank-2">
        </span>
        <p class="ranking-text-area" id="rank-3">
        <span class="ranking-id-wrapper">
          <img src="/images/third.png" id="ranking-icon" />
          <span class="ranking-text-area-id" id="rank-3">
          </span>
        </span>
        <span class="quantity" id="rank-3">
        </span>
      </p>`,
    );
    rankings.forEach((value, index) => {
      $(`.ranking-text-area-id#rank-${index}`).text(value.nickname);
      $(`.quantity#rank-${index}`).text(
        `${value.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}원`,
      );
      if (index === 0) {
        $('.ranking-text-area-id#rank-0').addClass('ranking-pop');
        setTimeout(() => {
          $('.ranking-text-area-id#rank-0').removeClass('ranking-pop');
        }, 6000);
      }
    });
  }
  prevRankingArray = rankings;
});

// 구매메세지
socket.on('get right-top purchase message', async (data) => {
  const alarmType = data.purchase.level;
  const { nickname } = data.purchase;
  const { productName } = data.purchase;
  const { message } = data.purchase;
  const { ttsSetting } = data.purchase;
  const { audioBuffer } = data;
  const num = data.purchase.purchaseNum;
  let audioBlob;

  if (audioBuffer) {
    const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
    audioBlob = window.URL.createObjectURL(blob);
  }
  // html string 생성
  messageHtml = `
  <div class="donation-wrapper">
    ${
      ttsSetting !== 'no-sound'
        ? `<iframe src="/audio/${
            alarmType === '2' ? 'alarm-type-2.mp3' : 'alarm-type-1.wav'
          }" id="iframeAudio" allow="autoplay" style="display:none"></iframe>`
        : ''
    }
    <div class="item">
      <div class="centered">
        <img src="https://${bucketName}.s3.ap-northeast-2.amazonaws.com/donation-images/${email}/${liveShoppingId}/${
    alarmType === '2' ? 'donation-2' : 'donation-1'
  }" class="donation-image" />
        <div class="animated heartbeat" id="donation-top">
          <span id="nickname">
            <span class="animated heartbeat" id="donation-user-id">${nickname}</span>
            <span class="donation-sub">님 ${productName}</span>
            <span class="animated heartbeat" id="donation-num">${num
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}</span>
            <span class="donation-sub">원 구매!</span>
          </span>
        </div>
        <div class="animated tada delay-1s" id="donation-message">
          <span id="message">
            ${message}
          </span>
        </div>
      </div>
    </div>
  </div>
  `;
  // array에 html string push
  messageArray.push({ audioBlob, messageHtml });
});

// 비회원 응원메세지
socket.on('get non client purchase message', async (data) => {
  const { nickname, productName, purchaseNum: price } = data;
  messageHtml = `
  <div class="donation-wrapper">
    <iframe src="/audio/alarm-type-1.wav"
    id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="centered">
      <div class ="animated heartbeat" id="donation-top">
        <span id="nickname">
          <span class="animated heartbeat" id="donation-user-id">${nickname}</span>
          <span class="donation-sub">님 ${productName}</span>
          <span class="animated heartbeat" id="donation-num">${price
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}</span>
          <span class="donation-sub">원 구매 감사합니다!</span>
        </span>
      </div>
    </div>
  </div>
  
  `;
  topMessages.push({ messageHtml });
});

socket.on('get right-top pop purchase message', async (data) => {
  const { nickname } = data.purchase;
  const { message } = data.purchase;
  const price = data.purchase.purchaseNum
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

  messageHtml = `
  <div class='combo-mode' style='height:unset'>
    <p class='pop-out'>${combo} COMBO!</p>
    <div class='donation-header' id='donation-top'>
      <span id='nickname'>
        <span class='wave' id='donation-user-id'>
        ${[...nickname]
          .map((v, i) => `<span class='wave-inner' style='--i:${i}'>${v}</span>`)
          .join('')}
        </span>
        <span class='donation-sub'>님</span>
        <span class='wave' id='donation-num'>
        ${[...price]
          .map((v, i) => `<span class='wave-inner' style='--i:${i}'>${v}</span>`)
          .join('')}
        </span>
        <span class='donation-sub'>원 구매!</span>
      </span>
    </div>
    <div id='donation-message'>
      <span id='message'>
        ${message}
      </span>
    </div>
  </div>
  `;
  combo += 1;
  messageArray.push({ messageHtml });
});

// 콤보 리셋 이벤트
socket.on('combo reset from server', async () => {
  combo = 1;
});

// 중간금액 알림
socket.on('get objective message', async (data) => {
  const { nickname } = data.objective;
  const { price } = data.objective;
  let stringifiedPrice = '엄청난금액';
  if (price.length === 7) {
    // 백만
    stringifiedPrice = String(price).slice(0, 3);
  } else if (price.length === 8) {
    // 천만
    stringifiedPrice = String(price).slice(0, 4);
  } else if (price.length === 6) {
    // 십만
    stringifiedPrice = String(price).slice(0, 2);
  }

  $('.news-banner p').html(
    `<span>${nickname}</span> 
    <span>님의 구매로 </span> 
    <span>${stringifiedPrice}</span>
    <span>만원 돌파!</span>
    <iframe src="/audio/news_alarm.mp3"
    id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    `,
  );
  $('.news-banner').show();
  $('.bottom-area-text').text(`${data.users} 구매 감사합니다!`);

  $('.bottom-area-right').css({ opacity: 1 });
  $('.bottom-area-text').css({ opacity: 1 });

  // .bottom-area-text 의 너비 (px단위)
  const userNicknamesWidth = $('.bottom-area-text').width();
  // 초당 이동할 거리 (px단위) => 속도를 빠르게 하려면 초당이동거리를 증가시키면 됨
  const movingPixelPerSec = 150;
  // 0 -> -100% 이동하는 애니메이션(marquee)을 몇 초동안 보여줄것인지 (animationDuration 설정 css 상으로는 기존 10s)
  const animationDurationInSec = Math.floor(userNicknamesWidth / movingPixelPerSec);
  const duration = `${Math.max(animationDurationInSec, 10)}s`; // 최소 10초
  $('.bottom-area-text')
    .addClass('animation-marquee')
    .css({ animationDuration: `${duration}` })
    .on('animationend', () => {
      hideBottomAreaText();
    }); // 구매자 닉네임 보여주는 애니메이션 종료 후 하단띠 숨기기

  // 중간금액 알림 tts를 위한 이벤트
  socket.emit('send objective notification signal', data);

  await setTimeout(() => {
    $('.news-banner p').empty();
    $('.news-banner').hide();
  }, 7000);
});

// 중간금액 알림 폭죽효과
socket.on('get objective firework from server', async (data) => {
  const fireworkHtml = `
  <img src="/images/firework.gif" id="firework" alt="firework"/>
  <div class="objective-inner-wrapper">
    <iframe src="/audio/firework.mp3"
    id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="objective-message">
      <span class="objective-text">판매금액</span>
      <span class="objective-value">${data.objective.price
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}</span>
      <span class="objective-text">원 돌파!!!</span>
    </div>
  </div>`;

  // 중간금액 알림 tts를 위한 이벤트
  socket.emit('send objective notification signal', data);

  $('.objective-wrapper').attr('id', 'soldout');
  $('.objective-wrapper').html(fireworkHtml);
  $('.objective-wrapper').fadeIn();
  makeRain(data.users, 200);

  await setTimeout(() => {
    $('body').remove('#soldout-alarm');
    $('.objective-wrapper').fadeOut();
    $('.letters').empty().fadeOut(1000);
  }, 10000);
});

// 오버레이 우측 상단 로고 변경
// 기본로고와 방송별로 등록한 특별 로고 2개 중 선택 가능
socket.on('toggle right-top onad logo from server', () => {
  if ($('#kks-logo').attr('src').includes('s3')) {
    $('#kks-logo').attr('src', '/images/kks-default-logo.png');
  } else {
    $('#kks-logo').attr(
      'src',
      `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/overlay-logo/${email}/${liveShoppingId}/kks-special-logo`,
    );
  }
});

// 하단 메세지 (단순 답변)
socket.on('get bottom area message', (data) => {
  $('.bottom-area-right').css({ opacity: 1 });
  $('.bottom-area-right')
    .prepend(
      `
      <p class="bottom-admin">
        ${data}
      </p>
  `,
    )
    .fadeIn(1000);
  setTimeout(() => {
    $('.bottom-admin').remove();
    $('.bottom-area-right').css({ opacity: 0 });
  }, 10000);
});

// 피버 메세지
socket.on('get bottom fever message', (data) => {
  $('.bottom-area-text').css({ opacity: 0 });
  $('.bottom-area-right')
    .prepend(
      `
    <p class="bottom-admin">
      ${data}
    </p>
  `,
    )
    .fadeIn(1000);
});

// 하단 응원메세지
// socket.on('get bottom purchase message', (data) => {
//   bottomMessages = data;
// });

/** 하단 띠 숨기기(& 애니메이션 해제) */
function hideBottomAreaText() {
  $('.bottom-area-right').css({ opacity: 0 });
  $('.bottom-area-text')
    .text('')
    .css({ animationDuration: '' })
    .removeClass('animation-marquee');
  $('.bottom-area-right-fever-wrapper').hide();
}

// 하단 띠 배너 영역 토글
socket.on('handle bottom area to client', () => {
  if ($('.bottom-area-right').css('opacity') === '1') {
    hideBottomAreaText();
  } else {
    $('.bottom-area-right').css({ opacity: 1 }).fadeIn(2000);
  }
});

// 오버레이 띄우기
socket.on('show screen', () => {
  $('.live-commerce').fadeIn(500);
});

// 오버레이 숨기기
socket.on('hide screen', () => {
  $('.live-commerce').fadeOut(500);
});

// 세로배너 토글
socket.on('hide vertical-banner from server', () => {
  $('.left-banner-area').toggle();
});

// 방송종료 시간
socket.on('d-day from server', (date) => {
  endDate = new Date(date);
});

// 피버 종료시간
socket.on('get fever date from server', (date) => {
  feverDate = new Date(date);
});

// 화면 새로고침
socket.on('refresh signal', () => {
  window.location.reload();
});

// 인트로/아웃트로 띄우기
socket.on('show video from server', (type) => {
  if (type === 'intro') {
    const introHtml = `
    <video class="inner-video-area" autoplay>
      <source src="/videos/intro.mp4" type="video/mp4">
    </video>
      `;
    $('.full-video').html(introHtml);
    $('.full-video').fadeIn(500);

    $('.inner-video-area').on('ended', function () {
      $('.live-commerce').show();
      $('.full-video').fadeOut(500);
    });
  } else {
    const outroHtml = `
    <video class="inner-video-area" autoplay>
      <source src="/videos/outro.mp4" type="video/mp4">
    </video>
      `;
    $('.full-video').html(outroHtml);
    $('.full-video').fadeIn(500);

    $('.inner-video-area').on('ended', function () {
      $('.live-commerce').hide();
      $('.full-video').fadeOut(500);
    });
  }
});

// 비디오 끄기
socket.on('clear full video from server', () => {
  $('.full-video').fadeOut(800);
});

// 방송 시작 시간 전송받기
socket.on('get start time from server', (startSetting) => {
  streamerAndProduct = startSetting.streamerAndProduct;
  $('.alive-check').css('background-color', 'blue');
  startDate = new Date(startSetting.date);
});

// 혹시 모를 에러 방지를 위해 방송시작 알림 tts는 한 번만 뜨도록 되어있음
// 방송 시작 tts를 다시 보내고 싶은 경우, 새로고침 이후, 사용 (컨트롤러의 새로고침 버튼 사용)
socket.once('get stream start notification tts', (audioBuffer) => {
  if (audioBuffer) {
    const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
    const streamStartNotificationAudioBlob = window.URL.createObjectURL(blob);
    const sound = new Audio(streamStartNotificationAudioBlob);
    setTimeout(() => {
      sound.play();
    }, 1000);
  }
});

// 중간금액 알림 tts
socket.on('get objective notification tts', (audioBuffer) => {
  if (audioBuffer) {
    const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
    const streamStartNotificationAudioBlob = window.URL.createObjectURL(blob);
    const sound = new Audio(streamStartNotificationAudioBlob);
    setTimeout(() => {
      sound.play();
    }, 2000);
  }
});

// 방송종료 5분전 알림
socket.on('get stream end notification tts', (audioBuffer) => {
  if (audioBuffer) {
    const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
    const streamStartNotificationAudioBlob = window.URL.createObjectURL(blob);
    const sound = new Audio(streamStartNotificationAudioBlob);
    setTimeout(() => {
      sound.play();
    }, 1000);
  }
  $('.notification').html(`<img id="notification" src="/images/eta.gif" />`);
  setTimeout(() => {
    $('.notification').empty();
  }, 5000);
});

// 연결체크
// 화면 좌측 하단 연결체크를 위한 비콘 토글
socket.on('connection check from server', () => {
  $('.alive-check').toggle();
});

// 매진 알림
socket.on('get soldout signal from server', async () => {
  const soldoutHtml = `
  <img src="/images/firework.gif" id="firework" alt="firework"/>
  <div class="objective-inner-wrapper soldout">
    <iframe src="/audio/firework.mp3"
    id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="objective-message">
      <span class="objective-text">준비된 상품이 매진되었습니다</span>
    </div>
  </div>`;
  $('.vertical-soldout-banner').css({ opacity: 1 });
  $('body').append(`
    <iframe src="/audio/soldout_v2.mp3" id="soldout-alarm" allow="autoplay" style="display:none"></iframe>
    `);
  $('.objective-wrapper').attr('id', 'soldout');
  $('.objective-wrapper').html(soldoutHtml);
  $('.objective-wrapper').fadeIn();
  await setTimeout(() => {
    $('body').remove('#soldout-alarm');
    $('.objective-wrapper').fadeOut();
  }, 10000);
});

// 세로배너 영역에 버츄얼 캐릭터를 띄우기 위한 세로배너 위에 흰 배경을 띄움
socket.on('get virtual character from server', async () => {
  $('.virtual-background').toggle();
});

// 버츄얼 캐릭터 오디오 재생
// 관리자 페이지에 따로 오디오 파일을 등록하는 기능이 없으므로 s3에 직접 올려야 함
socket.on('get virtual character audio from server', async () => {
  $('body').append(`
    <iframe src="https://lc-project.s3.ap-northeast-2.amazonaws.com/overlay-audio/${email}/${liveShoppingId}/voice"
     id="virtual-voice" allow="autoplay" style="display:none"></iframe>
    `);
});

// 버츄얼 캐릭터 오디오 재생 종료
socket.on('delete virtual character audio from server', async () => {
  $('#virtual-voice').remove();
});

// 세로배너의 매진알림 표시 제거
socket.on('remove soldout banner from server', () => {
  $('.vertical-soldout-banner').css({ opacity: 0 });
});

// 피버메세지 띄우기
socket.on('get fever signal from server', (text) => {
  $('.bottom-area-right').css({ opacity: 1 });
  $('.bottom-area-right-fever-wrapper').show();
  $('.bottom-fever-message').text(`${text}`);
  $('body').append(`
    <iframe src="/audio/fever.mp3" id="fever-alarm" allow="autoplay" style="display:none"></iframe>
    `);
  setTimeout(() => {
    $('#fever-alarm').remove();
  }, 5000);
});

// 전화이벤트/퀴즈 이벤트 이미지 띄우기
socket.on('get notification image from server', (type) => {
  if (type === 'calling') {
    $('.notification').append(`<img id="notification" src="/images/calling.png" />`);
  } else if (type === 'quiz') {
    $('.notification').append(`<img id="notification" src="/images/quiz.png" />`);
  }
});

// 전화이벤트/퀴즈 이벤트 이미지 숨기기
socket.on('remove notification image from server', () => {
  $('.notification').empty();
});

// 라이브 쇼핑 아이디가 정상적으로 전달되지 않은 경우, 라이브 쇼핑id를 받아오는 이벤트
// 라이브 쇼핑 아이디가 제대로 전달되지 않은경우, s3에서 세로배너, 응원메세지 등을 가져오지 못하므로
// 해당 부분에서 오류 발생시 시도해 볼 수 있는 방법
socket.on('get liveshopping id from server', (liveShoppingIdAndProductName) => {
  $('.alive-check').css('background-color', 'yellow');
  streamerAndProduct = liveShoppingIdAndProductName.streamerAndProduct;

  const roomName = pageUrl.split('/').pop();
  socket.emit('get date from registered liveshopping', {
    liveShoppingId,
    roomName,
  });
});

// 상품명 받아오기
// 실제 상품명과 방송 tts, 응원메세지에서 사용하는 상품명은 다른 경우가 대부분이라, 상품명을 따로 입력 받아야 함
socket.on('get product name from server', (streamerAndProductName) => {
  $('.alive-check').css('background-color', 'burlywood');
  streamerAndProduct = streamerAndProductName;
});

// 방송 시작, 종료 시간이 제대로 전송되지 않았을 경우 받아옴
socket.on('get registered date from server', (registeredTime) => {
  startDate = new Date(registeredTime.broadcastStartDate);
  endDate = new Date(registeredTime.broadcastEndDate);
});

// 랭킹영역만 새로고침
socket.on('refresh ranking from server', () => {
  $('.ranking-text-area#title').css({ display: 'flex' });
  $('.ranking-area-inner').html(
    `<img src="/images/podium.png" id="podium" style="width:25%;"/>`,
  );
});

/**
 * 테마변경
 * themeType : OverlayTheme.key(식별값) | 'default'
 * themeData? : OverlayThemeDataType
 */
socket.on('change theme from server', ({ themeType, themeData }) => {
  const logo = $('#kks-logo');
  const liveCommerceFrame = $('.live-commerce');
  const areas = $(
    '.ranking-area,  .bottom-area-left, .bottom-area-right, .bottom-fever-timer',
  );
  const rankingTitleText = $('.ranking-text-area#title');
  const podiumIcon = $('#podium');
  const timerIcon = $('.bottom-area-left-icon');
  // 우선 테마 변경시 바뀌는 요소들 초기화(기본테마)
  logo.show();
  liveCommerceFrame.css('background', '');
  areas.css('background-color', 'rgba(0, 0, 0, 0.5)').css('color', '#ffffff');
  rankingTitleText.css('color', '#ffd200').css('text-shadow', '5px 5px 10px #000');
  podiumIcon.attr('src', '/images/podium.png');
  timerIcon.attr('src', '/images/clock.png');

  // themeData 값을 전달받는 경우에만 요소들을 변경한다
  if (themeType === 'default' && !themeData) return;

  if (themeData.backgroundImage) {
    logo.hide();
    liveCommerceFrame.css('background', `url(${themeData.backgroundImage}) no-repeat`);
  }
  if (themeData.backgroundColor) {
    areas.css('background-color', themeData.backgroundColor);
  }

  if (themeData.color) areas.css('color', themeData.color);
  if (themeData.textShadow) rankingTitleText.css('text-shadow', themeData.textShadow);
  if (themeData.titleColor) rankingTitleText.css('color', themeData.titleColor);
  if (themeData.podiumImage) podiumIcon.attr('src', themeData.podiumImage);
  if (themeData.timerImage) timerIcon.attr('src', themeData.timerImage);
});

// bgm 재생
socket.on('start bgm from server', (data) => {
  const bgmNumber = data;
  if (isBgmPlaying) {
    $('#bgm').attr('src', `/audio/bgm-${bgmNumber}.mp3`);
  } else {
    $('body').append(`
  <audio src="/audio/bgm-${bgmNumber}.mp3"
    id="bgm" autoplay loop ></audio>
    `);
    $('#bgm').prop('volume', bgmVolume);
    isBgmPlaying = true;
  }
});

// bgm 종료
socket.on('off bgm from server', () => {
  $('#bgm').remove();
  isBgmPlaying = false;
});

// bgm 볼륨 조절
socket.on('bgm volume from server', (volume) => {
  if (volume === 'up') {
    bgmVolume += 0.01;
    $('#bgm').prop('volume', bgmVolume);
  } else {
    bgmVolume -= 0.01;
    if (bgmVolume < 0) {
      bgmVolume = 0;
    }
    $('#bgm').prop('volume', bgmVolume);
  }
});

// 버츄얼 캐릭터 오디오 재생
socket.on('get virtual character audio from server', async () => {
  $('body').append(`
    <iframe src="https://${bucketName}.ap-northeast-2.amazonaws.com/overlay-audio/${email}/${liveShoppingId}/voice"
     id="virtual-voice" allow="autoplay" style="display:none"></iframe>
    `);
});

// 치킨 테마에서만 사용되는 이벤트 알림 애니메이션
socket.on('get chicken move from server', async () => {
  $('.chicken-move').css({ display: 'flex' });
  chickenMovement();
  setTimeout(() => {
    $('.chicken-move').hide();
  }, 15000);
});

// 뉴스 속보 형태의 알림
socket.on('get news message from server', (data) => {
  $('.news-banner p').html(
    `<span>${data}</span> 
    `,
  );
  $('.news-banner').show();

  setTimeout(() => {
    $('.news-banner').hide();
  }, 5000);
});

// 버츄얼 캐릭터 영상 재생
// 관리자 페이지에 따로 업로드 하는 기능이 없으므로, s3에 직접 비디오 등록해야함
socket.on('play virtual video from server', () => {
  $('.left-banner-area').append(`
  <video class='virtual-video' autoplay width='100%' height='100%'>
    <source src='https://${bucketName}.s3.ap-northeast-2.amazonaws.com/overlay-virtual-video/${email}/${liveShoppingId}/virtual-video.mp4'
     type='video/mp4' />
  </video>
  `);
  $('.virtual-video').on('ended', function () {
    $('.virtual-video').remove();
  });
});

// 판매가이드 표시 이벤트
function getSalesGuideImageUrl({ index }) {
  const url = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/sales-guide-image/${liveShoppingId}/sales-guide-image-${index}`;
  return url;
}
socket.on('sales guide display from server', function displaySalesGuide() {
  const salesGuideContainer = $('.sales-guide--container');
  const HIDE_CLASS = 'hide';
  if (salesGuideContainer.hasClass(HIDE_CLASS)) {
    // 판매 가이드 이미지를 첫번째 url로 세팅
    const url = getSalesGuideImageUrl({ index: 1 });
    const image = new Image();
    image.src = url;
    // 이미지가 존재하면 표시
    image.onload = () => {
      const imageElem = $(image);
      imageElem.addClass('sales-guide--image');
      imageElem.appendTo(salesGuideContainer);
      salesGuideContainer.fadeIn(500).removeClass(HIDE_CLASS);
    };
    // 이미지가 존재하지 않으면 표시하지 않음
    image.onerror = () => {
      console.error('image not exist');
    };
  }
});

// 판매가이드 숨기기 이벤트
function hideSalesGuide() {
  const salesGuideContainer = $('.sales-guide--container');
  const HIDE_CLASS = 'hide';
  if (!salesGuideContainer.hasClass(HIDE_CLASS)) {
    salesGuideContainer.fadeOut(500, () => {
      $('.sales-guide--image').remove();
      salesGuideContainer.addClass(HIDE_CLASS);
    });
  }
}
socket.on('sales guide hide from server', hideSalesGuide);

// 판매가이드 이미지 인덱스 선택 이벤트
socket.on(
  'sales guide image index selected from server',
  function salesGuideImageIndexSelected({ index }) {
    const salesImageElem = $('.sales-guide--image');
    if (salesImageElem) {
      let image = new Image();
      const url = getSalesGuideImageUrl({ index, ext: 'png' });
      image.src = url;
      // 이미지가 존재하면 표시
      image.onload = () => {
        image = null;
        salesImageElem.attr('src', url);
      };
      // 이미지가 존재하지 않으면 판매가이드 영역 숨김
      image.onerror = (e) => {
        console.error('image not exist', e);
        hideSalesGuide();
      };
    }
  },
);

export {};
