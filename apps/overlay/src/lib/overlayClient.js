/* eslint-env jquery */
/* global io, */
/* eslint no-undef: "error" */
const socket = io({ transports: ['websocket'] });
const pageUrl = window.location.href;
const messageArray = [];
const iterateLimit = $('#primary-info').data('number') + 1;
const email = $('#primary-info').data('email');
let streamerAndProduct;
let liveShoppingId;
let startDate = new Date('2021-09-27T14:05:00+0900');
let endDate = new Date('2021-09-04T15:00:00+0900');
let feverDate = new Date('2021-09-27T14:05:00+0900');
let bannerId = 1;
const bottomMessages = [];
const topMessages = [];

let messageHtml;
const bottomTextIndex = 0;

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
        $('.inner-video-area').on('ended', function () {
          $('.live-commerce').show();
          $('.inner-video-area').fadeOut(500);
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
      $('#time-hour').show();
      $('#hour-min-separator').show();
      $('#time-hour').text(hours);
    } else {
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
    }
  }, 1000);
}

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

async function switchImage() {
  if (bannerId === iterateLimit) {
    bannerId = 1;
  }
  await setTimeout(() => {
    $('.vertical-banner')
      .attr(
        'src',
        `https://lc-project.s3.ap-northeast-2.amazonaws.com/vertical-banner/${email}/${liveShoppingId}/vertical-banner-${bannerId}`,
      )
      .fadeIn(1000);
  }, 1000);
  await setTimeout(() => {
    $('.vertical-banner').fadeOut(1000);
    bannerId += 1;
    switchImage();
  }, 10000);
}

// 우측상단 응원문구 이벤트
setInterval(async () => {
  if (messageArray.length !== 0 && $('.top-right').css('display') === 'none') {
    $('.top-right').css({ display: 'flex' });
    $('.top-right').html(messageArray[0].messageHtml);
    await setTimeout(() => {
      const sound = new Audio(messageArray[0].audioBlob);
      sound.play();
      messageArray.splice(0, 1);
    }, 3000);
    await setTimeout(() => {
      $('.top-right').fadeOut(800);
      $('.donation-image').attr('src', '/images/invisible.png');
    }, 10000);
  }
}, 2000);

// 비회원 메세지
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
// switchBottomText();
//------------------------------------------------------------------------------

const device = getOS();

socket.emit('new client', { pageUrl, device });

socket.on('get top-left ranking', (data) => {
  const rankingArray = data;
  if ($('.ranking-text-area#title').css('display') === 'none') {
    rankingArray.forEach((value, index) => {
      $(`.ranking-text-area-id#rank-${index}`).text(value.nickname);
      $(`.quantity#rank-${index}`).text(
        `${value.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}원`,
      );
    });
  } else {
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
    rankingArray.forEach((value, index) => {
      $(`.ranking-text-area-id#rank-${index}`).text(value.nickname);
      $(`.quantity#rank-${index}`).text(
        `${value.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}원`,
      );
    });
  }
});

socket.on('get right-top purchase message', async (data) => {
  const alarmType = data[0].level;
  const { nickname } = data[0];
  const { productName } = data[0];
  const { message } = data[0];
  const num = data[0].purchaseNum;
  let audioBlob;

  if (data) {
    const blob = new Blob([data[1]], { type: 'audio/mp3' });
    audioBlob = window.URL.createObjectURL(blob);
  }
  messageHtml = `
  <div class="donation-wrapper">
    <iframe src="/audio/${
      alarmType === '2' ? 'alarm-type-2.wav' : 'alarm-type-1.wav'
    }" id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="item">
      <div class="centered">
        <img src="https://lc-project.s3.ap-northeast-2.amazonaws.com/donation-images/${email}/${liveShoppingId}/${
    alarmType === '2' ? 'donation-2' : 'donation-1'
  }" class="donation-image" />  
        <div class ="animated heartbeat" id="donation-top">
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
  messageArray.push({ audioBlob, messageHtml });
});

socket.on('get non client purchase message', async (data) => {
  const { nickname } = data;
  const { productName } = data;
  const price = data.purchaseNum;

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

socket.on('get objective message', async (data) => {
  const price = data.objective;

  const objectiveHtml = `
  <div class="objective-inner-wrapper">
    <iframe src="/audio/mid.mp3"
    id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="objective-message">
      <span class="objective-text">판매금액</span>
      <span class="objective-value">${price
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}</span>
      <span class="objective-text">원 돌파!!!</span>
    </div>
  </div>
  `;

  $('.objective-wrapper').html(objectiveHtml);
  $('.objective-wrapper').slideToggle();

  await setTimeout(() => {
    $('.objective-wrapper').slideToggle();
  }, 5000);
});

// socket.on('toggle right-top onad logo from server', () => {
//   if ($('#kks-logo').attr('src').includes('-')) {
//     $('#kks-logo').attr('src', '/images/onadLogo.png');
//   } else {
//     $('#kks-logo').attr('src', '/images/onadLogo-gray.png');
//   }
// });

// 하단 메세지 (단순 답변)
socket.on('get bottom area message', (data) => {
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
  setTimeout(() => {
    $('.bottom-admin').remove();
    $('.bottom-area-text').css({ opacity: 1 });
  }, 10000);
});

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

socket.on('handle bottom area to client', () => {
  if ($('.bottom-area-right').css('opacity') === '1') {
    $('.bottom-area-right').css({ opacity: 0 });
  } else {
    $('.bottom-area-right').css({ opacity: 1 }).fadeIn(2000);
  }
});

socket.on('show screen', () => {
  $('.live-commerce').fadeIn(500);
});

socket.on('hide screen', () => {
  $('.live-commerce').fadeOut(500);
});

socket.on('d-day from server', (date) => {
  endDate = new Date(date);
});

socket.on('get fever date from server', (date) => {
  feverDate = new Date(date);
});

socket.on('refresh signal', () => {
  window.location.reload();
});

socket.on('show video from server', (type) => {
  if (type === 'intro') {
    const introHtml = `
    <video class="inner-video-area" autoplay>
      <source src="/videos/intro.mp4" type="video/mp4">
    </video>
      `;
    $('.full-video').html(introHtml);

    $('.inner-video-area').on('ended', function () {
      $('.live-commerce').show();
      $('.inner-video-area').fadeOut(500);
    });
  } else {
    const outroHtml = `
    <video class="inner-video-area" autoplay>
      <source src="/videos/outro.mp4" type="video/mp4">
    </video>
      `;
    $('.full-video').hide().html(outroHtml).fadeIn(500);

    $('.inner-video-area').on('ended', function () {
      $('.live-commerce').hide();
      $('.inner-video-area').fadeOut(500);
    });
  }
});

socket.on('clear full video from server', () => {
  $('.inner-video-area').fadeOut(800);
});

socket.on('get start time from server', (startSetting) => {
  streamerAndProduct = startSetting.streamerAndProduct;
  $('.alive-check').css('background-color', 'blue');
  startDate = new Date(startSetting.date);
});

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

socket.on('connection check from server', () => {
  $('.alive-check').toggle();
});

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

socket.on('remove soldout banner from server', () => {
  $('.vertical-soldout-banner').css({ opacity: 0 });
});

socket.on('get fever signal from server', (text) => {
  $('.bottom-area-right').css({ opacity: 1 });
  $('.bottom-admin').text(`${text}`);
  $('body').append(`
    <iframe src="/audio/fever.mp3" id="fever-alarm" allow="autoplay" style="display:none"></iframe>
    `);
  setTimeout(() => {
    $('#fever-alarm').remove();
  }, 5000);
});

socket.on('get notification image from server', (type) => {
  if (type === 'calling') {
    $('.notification').append(`<img id="notification" src="/images/calling.png" />`);
  } else if (type === 'quiz') {
    $('.notification').append(`<img id="notification" src="/images/quiz.png" />`);
  }
});

socket.on('remove notification image from server', () => {
  $('.notification').empty();
});

socket.on('get liveshopping id from server', (liveShoppingIdAndProductName) => {
  $('.alive-check').css('background-color', 'yellow');
  liveShoppingId = liveShoppingIdAndProductName.liveShoppingId;
  streamerAndProduct = liveShoppingIdAndProductName.streamerAndProduct;

  const roomName = pageUrl.split('/').pop();
  socket.emit('get date from registered liveshopping', {
    liveShoppingId,
    roomName,
  });
});

socket.on('get registered date from server', (registeredTime) => {
  startDate = new Date(registeredTime.broadcastStartDate);
  endDate = new Date(registeredTime.broadcastEndDate);
});

socket.on('refresh ranking from server', () => {
  $('.ranking-text-area#title').css({ display: 'flex' });
  $('.ranking-area-inner').html(
    `<img src="/images/podium.png" id="podium" style="width:25%;"/>`,
  );
});

export {};
