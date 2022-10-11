/* eslint-env jquery */
/* global io, Handlebars */
/* eslint no-undef: "error" */

let roomName;
let email;
let streamerNickname;
let liveShoppingId;
let isLogin = true;

const socket = io(process.env.OVERLAY_HOST, { transports: ['websocket'] });

const liveShoppingStateSocket = io(
  `${process.env.REALTIME_API_HOST}/live-shopping-state`,
  {
    withCredentials: true,
  },
);
liveShoppingStateSocket.on('playOutro', (roomName) => {
  if (roomName) playOutro(roomName);
});

socket.on('creator list from server', (data) => {
  if (data && data.length !== 0) {
    $('#connection-status').text('✔️ 정상');
  } else {
    $('#connection-status').text('❌ 연결되지 않음');
  }
});

/** roomName(overlayUrl)로 아웃트로 송출 이벤트 발생 */
function playOutro(roomName) {
  socket.emit('show video from admin', { roomName, type: 'outro' });
}

$(document).ready(function ready() {
  let liveShoppingStateBoardController; // 관리자 메시지 보내기(방송인 현황판 표시) 컨트롤러, liveShoppingId 할당될때 생성

  $('.mid-area button').attr('disabled', true);

  const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, 16);
  $('table#liveshopping-table').DataTable({
    columnDefs: [
      {
        targets: 5,
        render(data, type, row) {
          const date = new Date(data);
          const newDate = `${
            date.getMonth() + 1
          }-${date.getDate()} <br /> ${date.getHours()}시${date.getMinutes()}분${date.getSeconds()}초`;
          return newDate;
        },
      },
      {
        targets: 6,
        render(data, type, row) {
          const date = new Date(data);
          const newDate = `${
            date.getMonth() + 1
          }-${date.getDate()} <br /> ${date.getHours()}시${date.getMinutes()}분${date.getSeconds()}초`;
          return newDate;
        },
      },
    ],
  });
  $('#start-time-picker').val(localISOTime);
  $('#end-time-picker').val(localISOTime);
  $('#fever-time-picker').val(localISOTime);

  function calculateSaleForDashboard(data) {
    const totalPrice = data.reduce((acc, d) => acc + d.price, 0);
    const totalPurchaseCount = data.length;
    const totalGiftNumber = data.filter((d) => !!d.giftFlag).length;

    const isLoginMessages = data.filter((item) => item.loginFlag === true);

    const uniqueValues = new Set(isLoginMessages.map((item) => item.nickname));

    // 중복주문 계산
    if (uniqueValues.size < isLoginMessages.length) {
      $('.addtional-sales').text(isLoginMessages.length - uniqueValues.size);
    } else if (uniqueValues.size === isLoginMessages.length) {
      $('.addtional-sales').text('0');
    }

    $('.total-sales-price').text(Number(totalPrice).toLocaleString());
    $('.total-sales-number').text(totalPurchaseCount);
    $('.total-gift-sales').text(totalGiftNumber);
  }

  function numberToKorean(num) {
    const hanA = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
    const danA = [
      '',
      '십',
      '백',
      '천',
      '',
      '십',
      '백',
      '천',
      '',
      '십',
      '백',
      '천',
      '',
      '십',
      '백',
      '천',
    ];
    let result = '';
    for (let i = 0; i < num.length; i++) {
      let str = '';
      const han = hanA[num.charAt(num.length - (i + 1))];
      if (han !== '') str += han + danA[i];
      if (i === 4) str += '만';
      if (i === 8) str += '억';
      if (i === 12) str += '조';
      result = str + result;
    }
    if (num !== 0) result += '원';
    return result;
  }

  $('#objective-message-price').on('input', function obejctMessagePriceStringfy(e) {
    const convertedText = numberToKorean(e.target.value);
    $('#korean-number-display-1').text(convertedText);
  });

  $('#objective-price').on('input', function obejectivePriceStringfy(e) {
    const convertedText = numberToKorean(e.target.value);
    $('#korean-number-display-2').text(convertedText);
  });

  $('#objective-select-box').change(function onObjectiveSelectBoxChange(e) {
    $('#objective-message-price').val(e.target.value);
    $('#objective-price').val(e.target.value);
    const convertedText = numberToKorean(e.target.value);
    $('#korean-number-display-1, #korean-number-display-2').text(convertedText);
  });

  $('#sold-price').on('input', function soldPriceStringfy(e) {
    const stringifiedNumber = numberToKorean(e.target.value);
    $('#stringified-sold-price').text(stringifiedNumber);
  });

  // 구입 메세지 목록 받아오는 재귀 ajax
  function getPurchaseMessage() {
    // 현황판 업데이트를 위한 이벤트 송출
    liveShoppingStateSocket.emit('updatePurchaseMessage', liveShoppingId);
    $.ajax({
      type: 'GET',
      url: `${process.env.OVERLAY_CONTROLLER_HOST}/purchase-message`,
      dataType: 'json',
      data: { liveShoppingId },
      success(data) {
        // 대시보드 지표 계산
        calculateSaleForDashboard(data);
        $('table#message-table').DataTable().destroy();
        const source = $('#purchase-message-list').html(); // 템플릿으로 만든 text를 불러옴
        const template = Handlebars.compile(source);
        $('#message-tbody').html(template(data));
        $('table#message-table').DataTable({
          columnDefs: [
            {
              targets: 2,
              render(data, type, row) {
                return data.length > 40 ? `${data.substr(0, 40)}…` : data;
              },
            },
            {
              targets: 3,
              render(data, type, row) {
                return Number(data).toLocaleString();
              },
            },
            {
              targets: 4,
              render(data, type, row) {
                const date = new Date(data);
                const newDate = `${
                  date.getMonth() + 1
                }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                return newDate;
              },
            },
          ],
        });

        $('.delete-message-button').attr(
          'disabled',
          !$('#panel-activate-checkbox').prop('checked'),
        );
      },

      error(error) {
        console.log(error);
      },
    });
  }

  $('#message-tbody').on('click', 'button', function deleteMessageButtonClick() {
    const messageId = $(this).closest('tr').children('td.message-id-cell').attr('id');
    $.ajax({
      type: 'DELETE',
      url: `${process.env.OVERLAY_CONTROLLER_HOST}/purchase-message`,
      dataType: 'json',
      data: { messageId },
      success() {
        getPurchaseMessage();
      },
      error(error) {
        console.log(error);
      },
    });
  });

  $('.socket-id-button').click(function socketIdButtonClickEvent() {
    liveShoppingId = $(this).closest('tr').children('td.liveshopping-id-cell').attr('id');
    streamerNickname = $(this).closest('tr').prop('id');
    const url = $(this).closest('tr').children('td.url-cell').attr('id');
    email = $(this).closest('tr').children('td.email-cell').attr('id');

    $('#creator-name').text(streamerNickname);

    socket.emit('request creator list', {
      roomName: socket.id,
      url,
    });

    roomName = url.split('/').pop();
    // 대시보드 지표 계산
    getPurchaseMessage();

    // 메세지 제어 세팅값 조회
    $.ajax({
      type: 'GET',
      url: `${process.env.OVERLAY_CONTROLLER_HOST}/message-setting`,
      data: { liveShoppingId },
      success(data) {
        $('#standard-price').val(data.levelCutOffPoint);
        $('#fan-nickname').val(data.fanNick);
        $('#product-name').val(data.liveShopping.goods.goods_name);
        $(`input[name="tts-type"][value="${data.ttsSetting}"]`).prop('checked', true);
      },
    });

    if (liveShoppingStateBoardController) {
      liveShoppingStateBoardController.liveShoppingId = liveShoppingId;
    } else {
      liveShoppingStateBoardController = new LiveShoppingStateBoardController(
        liveShoppingId,
      );
      liveShoppingStateBoardController.init();
    }
  });

  $('#toggle-table-button').click(function toggleTableButtonClickEvent() {
    const text = $('#toggle-table-button').text().trim();
    $('#toggle-table-button').text(text === '◀️' ? '▶️' : '◀️');
    $('.search-box').toggle('slide');
  });

  $('#screen-show-button').click(function screenShowButtonClickEvent() {
    socket.emit('show live commerce', roomName);
  });

  $('#screen-hide-button').click(function screenHideButtonClickEvent() {
    socket.emit('quit live commerce', roomName);
  });

  $('#logo-toggle-button').click(function logoToggleButtonClickEvent() {
    socket.emit('toggle right-top onad logo', roomName);
  });

  $('#bottom-area-toggle-button').click(function bottomAreaToggleButtonClickEvent() {
    socket.emit('toggle bottom area from admin', roomName);
  });

  $('#soldout-signal-button').click(function sendSoldoutEvent() {
    socket.emit('get soldout signal from admin', roomName);
  });

  $('#soldout-remove-button').click(function sendSoldoutRemoveEvent() {
    socket.emit('remove soldout banner from admin', roomName);
  });

  $('#show-intro-video-button').click(function showIntroVideoButtonClickEvent() {
    socket.emit('show video from admin', { roomName, type: 'intro' });
  });

  $('#show-outro-video-button').click(function showOutroVideoButtonClickEvent() {
    playOutro(roomName);
  });

  $('#hide-video-button').click(function HideVideoButtonClickEvent() {
    socket.emit('clear full video', roomName);
  });

  $('#refresh-button').click(function refreshButtonClickEvent() {
    socket.emit('refresh', roomName);
  });

  $('#alive-check-button').click(function aliveCheckButtonClickEvent() {
    socket.emit('connection check from admin', roomName);
  });

  $('#panel-activate-checkbox').click(function panelActivateButton() {
    $('.mid-area')
      .find('button')
      .prop('disabled', (_, val) => !val);
  });

  $('#screen-control-activate-checkbox').click(function screenControlActivateButton() {
    $('.screen-control-box')
      .find('button')
      .prop('disabled', (_, val) => !val);
  });

  $('#action-control-activate-checkbox').click(function actionControlActivateButton() {
    $('.action-control-box')
      .find('button')
      .prop('disabled', (_, val) => !val);
  });

  $('#objective-control-activate-checkbox').click(function objecectiveActivateButton() {
    $('.objective-box')
      .find('button')
      .prop('disabled', (_, val) => !val);
  });

  $('#bottom-message-activate-checkbox').click(function bottomMessageActivateButton() {
    $('.bottom-message-box')
      .find('button')
      .prop('disabled', (_, val) => !val);
  });

  $('#liveshopping-id-button').click(function liveShoppingIdButtonClickEvent() {
    const productName = $('#product-name').val().trim();
    const streamerAndProduct = { streamerNickname, productName };

    socket.emit('liveshopping id from admin', {
      roomName,
      liveShoppingId,
      streamerAndProduct,
    });
  });

  $('#start-time-send-button').click(function startTimeSendButtonClickEvent() {
    const selectedTime = $('#start-time-picker').val();
    const productName = $('#product-name').val().trim();
    const streamerAndProduct = { streamerNickname, productName };
    socket.emit('get start time from admin', {
      roomName,
      date: selectedTime,
      streamerAndProduct,
    });
    const sel = `현재 전송된 시작 시간: ${selectedTime}`;
    $('#etc-control-start-time').text(sel);
  });

  $('#product-name-send-button').click(function startTimeSendButtonClickEvent() {
    const productName = $('#product-name').val().trim();
    if (productName.length === 0) {
      alert('상품명을 작성해주세요');
      return;
    }
    const streamerAndProduct = { streamerNickname, productName };
    socket.emit('get product name from admin', {
      roomName,
      streamerAndProduct,
    });
  });

  $('#end-time-send-button').click(function endTimeSendButtonClickEvent() {
    const selectedTime = $('#end-time-picker').val();
    // 오버레이로 종료시간 전송
    socket.emit('get d-day', { roomName, date: selectedTime });
    // 현황판으로 종료시간 전송 (liveShoppingId 의 현황판에서 설정된 종료시간에 따라 라이브종료버튼 활성화함)
    liveShoppingStateSocket.emit('setLiveShoppingEndDateTime', {
      liveShoppingId,
      endDateTime: selectedTime,
    });
    const sel = `현재 전송된 종료 시간: ${selectedTime}`;
    $('#etc-control-end-time').text(sel);
  });

  $('#fever-time-send-button').click(function feverTimeSendButtonClickEvent() {
    const selectedTime = $('#fever-time-picker').val();
    socket.emit('get fever date from admin', { roomName, date: selectedTime });
    const sel = `현재 전송된 피버 시간: ${selectedTime}`;
    $('#etc-control-fever-time').text(sel);
  });

  $('#data-send-all').click(function dataSendAllButtonClickEvent() {
    socket.emit('get all data', roomName);
  });

  $('.message-box-lock-button').click(function messageBoxLockButtonClickEvent() {
    if ($('.message-box-lock-button').attr('class').includes('locked')) {
      $('#standard-price').attr('disabled', false);
      $('#product-name').attr('disabled', false);
      $('#fan-nickname').attr('disabled', false);
      $('input[name="tts-type"]').attr('disabled', false);
      $('.message-box-lock-button').toggleClass('locked');
      $('.message-box-lock-button').text('잠금');
    } else {
      $('#standard-price').attr('disabled', true);
      $('#product-name').attr('disabled', true);
      $('#fan-nickname').attr('disabled', true);
      $('input[name="tts-type"]').attr('disabled', true);
      $('.message-box-lock-button').toggleClass('locked');
      $('.message-box-lock-button').text('해제');
    }
  });

  $('input[name=client-checkbox]').change(function clientCheckboxOnChange() {
    const fanNickname = $('#fan-nickname').val().trim();
    if ($('input[name=client-checkbox]').is(':checked')) {
      $('#customer-nickname').val(fanNickname);
    } else {
      $('#customer-nickname').val('');
    }
  });

  $('#bottom-message-button').click(function bottomMessageButtonClickEvent() {
    const customerMessage = $('#admin-message').val().trim();
    socket.emit('bottom area message', { roomName, message: customerMessage });
    $('#admin-message').val(null);
  });

  $('#fever-message-button').click(function bottomMessageButtonClickEvent() {
    const feverMessage = $('#admin-message').val();
    socket.emit('get fever signal from admin', { roomName, message: feverMessage });
    $('#admin-message').val(null);
  });

  $('#objective-message-button').click(function objectiveMessageButtonClickEvent() {
    let nickname = $('#objective-message-nickname').val();
    if (nickname.length === 9) {
      nickname = `${nickname.slice(0, 8)}...`;
    } else {
      nickname = `${nickname.slice(0, 8)}`;
    }

    const price = $('#objective-message-price').val();
    if (!nickname) {
      alert('닉네임을 입력해주세요');
      return;
    }
    if (!price) {
      alert('가격을 입력해주세요');
      return;
    }
    socket.emit('get objective message from admin', {
      roomName,
      objective: { nickname, price },
      liveShoppingId,
    });
    $('#objective-message-nickname').val(null);
    $('#objective-message-price').val(null);
    $('#objective-price').val(null);
  });

  $('#objective-button').click(function objectiveButtonClickEvent() {
    const price = $('#objective-price').val();
    if (!price) {
      alert('가격을 입력해주세요');
      return;
    }
    socket.emit('get objective firework from admin', {
      roomName,
      objective: { price },
      liveShoppingId,
    });
    $('#objective-message-nickname').val(null);
    $('#objective-message-price').val(null);
    $('#objective-price').val(null);
  });

  $('#calling-button').click(function callingButtonClickEvent() {
    socket.emit('get notification image from admin', { roomName, type: 'calling' });
  });

  $('#quiz-button').click(function quizButtonClickEvent() {
    socket.emit('get notification image from admin', { roomName, type: 'quiz' });
  });

  $('#remove-notification-button').click(function removeNotificationButtonClickEvent() {
    socket.emit('remove notification image from admin', roomName);
  });

  $('#refresh-ranking-button').click(function refreshRankingButtonClickEvent() {
    socket.emit('refresh ranking from admin', roomName);
  });

  $('#show-virtual-character').click(function showVirtualCharacterButtonClickEvent() {
    socket.emit('get virtual character from admin', roomName);
  });

  $('#play-virtual-character-audio').click(
    function playVirtualCharacterAudioButtonClickEvent() {
      socket.emit('get virtual character audio from admin', roomName);
    },
  );

  $('#delete-virtual-character-audio').click(
    function deleteVirtualCharacterAudioButtonClickEvent() {
      socket.emit('delete virtual character audio from admin', roomName);
    },
  );

  /** 테마초기화 버튼 핸들러 */
  $('#theme-reset-button').click(function resetTheme() {
    socket.emit('change theme from admin', {
      roomName,
      themeType: 'default',
      // themeData 값을 보내지 않는다. -> 오버레이 클라이언트에서 기본 화면으로 세팅함
    });
  });

  /** 테마 불러오기 버튼 핸들러 -> 테마버튼 렌더링 */
  $('#theme-load-button').click(function loadThemesAndRenderThemeButtons() {
    $.ajax({
      type: 'GET',
      url: `${process.env.OVERLAY_CONTROLLER_HOST}/overlay-themes`,
      success(data) {
        const themeAndBtnElemList = data.map((theme, idx) => {
          const themeBtnElem = new ThemeButton(
            theme,
            `background-color: ${
              ThemeButton.buttonColors[idx % ThemeButton.buttonColors.length]
            }`,
          );
          // theme 데이터와 이벤트핸들러 할당한 버튼 엘리먼트 반환
          return { ...theme, btnElem: themeBtnElem };
        });

        const buttonsByCategory = {};
        themeAndBtnElemList.forEach((themeAndBtnElem) => {
          if (buttonsByCategory[themeAndBtnElem.category]) {
            buttonsByCategory[themeAndBtnElem.category].push(themeAndBtnElem.btnElem);
          } else {
            buttonsByCategory[themeAndBtnElem.category] = [themeAndBtnElem.btnElem];
          }
        });

        const categories = Object.keys(buttonsByCategory);

        const buttonContainer = $('.theme-control-button-container');
        // 버튼 컨테이너 엘리먼트 초기화
        buttonContainer.empty();

        // 카테고리별로 버튼 렌더링
        categories.forEach((cat) => {
          const buttons = buttonsByCategory[cat];
          const titleElem = $(`<h4>${cat}</h4>`);
          const categorybuttonsContainer = $(`<div></div>`);
          buttons.forEach((btnElem) => categorybuttonsContainer.append(btnElem));

          buttonContainer.append(titleElem).append(categorybuttonsContainer);
        });
      },
    });
  });

  $('#chicken-movement-button').click(function chickenMovementButtonClickEvent() {
    socket.emit('get chicken move from admin', roomName);
  });

  $('.start-bgm-button').click(function startBgmButton() {
    const bgmNumber = $(this).val();
    socket.emit('start bgm from admin', { roomName, bgmNumber });
  });

  $('#off-bgm-button').click(function offBgmButton() {
    socket.emit('off bgm from admin', roomName);
  });

  $('.bgm-volume-button').click(function volumeButton() {
    const volume = $(this).val();
    socket.emit('bgm volume from admin', { roomName, volume });
  });

  $('#hide-vertical-banner').click(function hideVerticalBanner() {
    socket.emit('hide vertical-banner from admin', roomName);
  });

  $('#combo-reset-button').click(function resetCombo() {
    socket.emit('combo reset from admin', roomName);
  });

  $('.logout-button').click(function logout() {
    $.ajax({
      type: 'POST',
      url: `${process.env.OVERLAY_CONTROLLER_HOST}/auth/logout`,
      success(data) {
        window.location.replace('/login');
      },
    });
  });

  $('#news-message-button').click(function resetCombo() {
    let message = $('#news-message').val();
    if (message.length > 23) {
      message = `${message.slice(0, 21)}`;
    }
    socket.emit('news message from admin', { roomName, message });
  });

  $('#play-virtual-video-button').click(function playVirtualVideo() {
    socket.emit('play virtual video from admin', roomName);
  });

  // 응원메시지 전송 form 핸들러
  $('form').submit(function formSubmit(event) {
    event.preventDefault();

    let level;

    const ttsSetting = $('input[name="tts-type"]:checked').val();
    const standardPrice = Number($('#standard-price').val());
    const productName = $('#product-name').val().trim();
    const soldPrice = Number($('#sold-price').val());
    const customerNickname = $('#customer-nickname').val().trim();
    let customerMessage = $('#customer-message').val().trim();
    const phoneCallEventFlag = $('input[name="event"]:checked').val() === 'yes';
    const giftFlag = $('input[name="gift"]:checked').val() === 'yes';
    const isOnlyDb = $('#insert-only-db-checkbox').is(':checked');

    if (!ttsSetting) {
      alert('TTS 타입을 설정해주세요');
      return;
    }
    if (!customerNickname) {
      alert('구매자를 입력해주세요');
      return;
    }
    if (!soldPrice) {
      alert('구매 금액을 입력해주세요');
      return;
    }
    isLogin = !$('input[name=client-checkbox]').is(':checked');

    if (giftFlag) {
      customerMessage = `[스트리머에게 선물!] ${customerMessage}`;
    }

    if (standardPrice > soldPrice) {
      level = '1';
    } else {
      level = '2';
    }
    const messageJson = JSON.stringify({
      liveShoppingId,
      level,
      email,
      loginFlag: isLogin,
      productName,
      purchaseNum: soldPrice,
      nickname: customerNickname,
      message: customerMessage,
      phoneCallEventFlag,
      giftFlag,
    });

    const errorDialog = document.getElementById('error-dialog');
    $.ajax({
      type: 'POST',
      url: `${process.env.OVERLAY_CONTROLLER_HOST}/purchase-message`,
      dataType: 'text',
      contentType: 'application/json',
      data: messageJson,
      success() {
        if (isOnlyDb) {
          $('#insert-dialog').fadeIn();
          setTimeout(() => {
            $('#insert-dialog').fadeOut();
          }, 3000);
          return;
        }

        if (isLogin) {
          socket.emit('right top purchase message', {
            roomName,
            level,
            productName,
            purchaseNum: soldPrice,
            nickname: customerNickname,
            message: customerMessage,
            ttsSetting,
          });
        } else {
          socket.emit('get non client purchase message from admin', {
            roomName,
            level,
            productName,
            purchaseNum: soldPrice,
            nickname: customerNickname,
            simpleMessageFlag: true,
            message: '',
          });
        }
        // 메시지 전송하면, 바로 테이블 업데이트
      },
      error() {
        errorDialog.showModal();
        setTimeout(() => {
          errorDialog.close();
        }, 3000);
      },
      complete() {
        getPurchaseMessage();
        $('#sold-price').val(null);
        $('#customer-nickname').val(null);
        $('#customer-message').val(null);
        $('input[name="event"]').removeAttr('checked');
        $('input[name="gift"]').removeAttr('checked');
        $('input[name="event"]').filter('[value=no]').prop('checked', true);
        $('input[name="gift"]').filter('[value=no]').prop('checked', true);
        $('input[name=client-checkbox]').prop('checked', false);
        $('input[name=db-insert-checkbox]').prop('checked', false);
      },
    });
  });

  // 판매가이드 관련 버튼 이벤트 핸들러 할당
  // 판매가이드 표시
  $('.sales-guide-image-control--btn--display').click(() => {
    socket.emit('sales guide display from admin', { roomName });
  });
  // 판매가이드 숨기기
  $('.sales-guide-image-control--btn--hide').click(() => {
    socket.emit('sales guide hide from admin', { roomName });
  });
  // 판매가이드 이미지 인덱스 클릭시
  $('.sales-guide-image--index-container > button').click((e) => {
    const index = Number(e.currentTarget.value);
    socket.emit('sales guide image index selected from admin', { roomName, index });
  });
});

class LiveShoppingStateBoardController {
  constructor(liveShoppingId) {
    this._defaultMessage = '없음';
    this._liveShoppingId = liveShoppingId;
    this.container = $('.admin-to-bc-live-state-board-box');
    this.input = this.container.find('.admin-to-bc-live-state-board__input');
    this.sendButton = this.container.find('.admin-to-bc-live-state-board__send-button');
    this.displayingMessage = this.container.find(
      '.admin-to-bc-live-state-board__displaying-message',
    );
    this.deleteButton = this.container.find(
      '.admin-to-bc-live-state-board__delete-button',
    );
    this.alertButton = this.container.find('.admin-to-bc-live-state-board__alert-button');
  }

  set liveShoppingId(liveShoppingId) {
    this.deleteMessage(); // 새로운 liveShoppingId 할당하기전, 이전 라이브쇼핑방송에 보낸 메시지가 있다면 삭제
    this._liveShoppingId = liveShoppingId;
  }

  init() {
    this.input.val('');
    this.displayingMessage.text(this._defaultMessage);
    this.sendButton.click(() => this.sendMessage());
    this.deleteButton.click(() => this.deleteMessage());
    this.alertButton.click(() => this.sendAlert());
  }

  sendMessage() {
    const message = this.input.val();

    if (!message) return;

    liveShoppingStateSocket.emit('createAdminMessage', {
      text: message,
      liveShoppingId: this._liveShoppingId,
    });

    this.input.val('');
    this.displayingMessage.text(message);
  }

  deleteMessage() {
    const currentMessage = this.displayingMessage.text();

    if (currentMessage === this._defaultMessage) return;

    liveShoppingStateSocket.emit('createAdminMessage', {
      text: '',
      liveShoppingId: this._liveShoppingId,
    });

    this.input.val('');
    this.displayingMessage.text(this._defaultMessage);
  }

  sendAlert() {
    liveShoppingStateSocket.emit('createAdminAlert', this._liveShoppingId);
  }
}

/** jQuery로 감싼테마변경 버튼 엘리먼트 생성 & 이벤트 핸들러 연결 */
class ThemeButton {
  static buttonColors = [
    'red',
    'blue',
    'orange',
    'green',
    'firebrick',
    'purple',
    'darksalmon',
    'cadetblue',
    'chartreuse',
    'darkcyan',
  ];

  constructor(theme, buttonStyle) {
    return $(`
    <button class="theme-selction-box-button" id="${theme.key}" style="margin-right:10px;${buttonStyle}">${theme.name}</button>
  `)
      .css('background-color', false)
      .on('click', () =>
        socket.emit('change theme from admin', {
          roomName,
          themeType: theme.id,
          themeData: theme.data,
        }),
      );
  }
}
