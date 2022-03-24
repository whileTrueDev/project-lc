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

socket.on('creator list from server', (data) => {
  if (data && data.length !== 0) {
    $('#connection-status').text('✔️ 정상');
    $('.admin-to-bc-live-state-board-box button').attr('disabled', false);
    $('#panel-activate-checkbox').attr('disabled', false);
  } else {
    $('#connection-status').text('❌ 연결되지 않음');
    $('.mid-area button').attr('disabled', true);
    $('#panel-activate-checkbox').attr('disabled', true);
  }
});

$(document).ready(function ready() {
  let liveShoppingStateBoardController; // 관리자 메시지 보내기(방송인 현황판 표시) 컨트롤러, liveShoppingId 할당될때 생성

  $('.mid-area button').attr('disabled', true);
  $('#panel-activate-checkbox').attr('disabled', true);
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

        // hbs가 컴파일하여 파싱한 이후에, 이벤트 새로 등록해줘야 함.
        $('.delete-message-button').click(function deleteMessageButtonClick() {
          const messageId = $(this)
            .closest('tr')
            .children('td.message-id-cell')
            .attr('id');

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
    socket.emit('show video from admin', { roomName, type: 'outro' });
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
      .not('.admin-to-bc-live-state-board-box button')
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
  });

  $('#product-name-send-button').click(function startTimeSendButtonClickEvent() {
    const productName = $('#product-name').val().trim();
    const streamerAndProduct = { streamerNickname, productName };
    socket.emit('get product name from admin', {
      roomName,
      streamerAndProduct,
    });
  });

  $('#end-time-send-button').click(function endTimeSendButtonClickEvent() {
    const selectedTime = $('#end-time-picker').val();
    socket.emit('get d-day', { roomName, date: selectedTime });
  });

  $('#fever-time-send-button').click(function feverTimeSendButtonClickEvent() {
    const selectedTime = $('#fever-time-picker').val();
    socket.emit('get fever date from admin', { roomName, date: selectedTime });
  });

  $('#data-send-all').click(function dataSendAllButtonClickEvent() {
    socket.emit('get all data', roomName);
  });

  $('.message-box-lock-button').click(function messageBoxLockButtonClickEvent() {
    if ($('.message-box-lock-button').attr('class').includes('locked')) {
      $('#standard-price').attr('disabled', false);
      $('#product-name').attr('disabled', false);
      $('#fan-nickname').attr('disabled', false);
      $('.message-box-lock-button').toggleClass('locked');
      $('.message-box-lock-button').text('잠금');
    } else {
      $('#standard-price').attr('disabled', true);
      $('#product-name').attr('disabled', true);
      $('#fan-nickname').attr('disabled', true);
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
    socket.emit('get objective message from admin', {
      roomName,
      objective: { nickname, price },
      liveShoppingId,
    });
    $('#objective-message').val(null);
  });

  $('#objective-button').click(function objectiveButtonClickEvent() {
    const price = $('#objective-price').val();
    socket.emit('get objective firework from admin', {
      roomName,
      objective: { price },
      liveShoppingId,
    });
    $('#objective-message').val(null);
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

  $('form').submit(function formSubmit(event) {
    event.preventDefault();
    let level;

    const standardPrice = Number($('#standard-price').val());
    const productName = $('#product-name').val().trim();
    const soldPrice = Number($('#sold-price').val());
    const customerNickname = $('#customer-nickname').val().trim();
    let customerMessage = $('#customer-message').val().trim();
    const phoneCallEventFlag = $('input[name="event"]:checked').val() === 'yes';
    const giftFlag = $('input[name="gift"]:checked').val() === 'yes';
    const isOnlyDb = $('#insert-only-db-checkbox').is(':checked');

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
          });
        } else {
          socket.emit('get non client purchase message from admin', {
            roomName,
            level,
            productName,
            purchaseNum: soldPrice,
            nickname: customerNickname,
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
