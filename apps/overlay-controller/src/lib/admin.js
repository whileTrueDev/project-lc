/* eslint-env jquery */
/* global io, */
/* eslint no-undef: "error" */

let roomName;
let userId;
let streamerNickname;
let isLogin = true;
const socket = io(process.env.HOST, { transports: ['websocket'] });

socket.on('creator list from server', (data) => {
  if (data && data.length !== 0) {
    $('#connection-status').text('✔️ 정상');
    $('.mid-area button').attr('disabled', false);
  } else {
    $('#connection-status').text('❌ 연결되지 않음');
    $('.mid-area button').attr('disabled', true);
  }
});

$(document).ready(function ready() {
  $('#table_id').DataTable({ lengthChange: false });
  $('.mid-area button').attr('disabled', true);
  const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, 16);

  $('#start-time-picker').val(localISOTime);
  $('#end-time-picker').val(localISOTime);
  $('#fever-time-picker').val(localISOTime);

  $('.socket-id-button').click(function socketIdButtonClickEvent() {
    streamerNickname = $(this).closest('tr').prop('id');
    const url = $(this).closest('tr').children('td.url-cell').attr('id');
    userId = $(this).closest('tr').children('td.userid-cell').attr('id');

    $('#creator-name').text(streamerNickname);

    socket.emit('request creator list', {
      roomName: socket.id,
      url,
    });
    roomName = url.split('/').pop();
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

  $('#objective-button').click(function objectiveButtonClickEvent() {
    const objective = $('#objective-message').val();
    socket.emit('get objective message from admin', { roomName, objective });
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
      level,
      userId,
      loginFlag: isLogin,
      productName,
      purchaseNum: soldPrice,
      nickname: customerNickname,
      message: customerMessage,
      phoneCallEventFlag,
      giftFlag,
    });

    const errorDialog = document.getElementById('dialog-message');
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3333/purchase-message',
      dataType: 'text',
      contentType: 'application/json',
      data: messageJson,
      success() {
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
      },
      error() {
        errorDialog.showModal();
        setTimeout(() => {
          errorDialog.close();
        }, 3000);
      },
      complete() {
        $('#sold-price').val(null);
        $('#customer-nickname').val(null);
        $('#customer-message').val(null);
        $('input[name="event"]').removeAttr('checked');
        $('input[name="gift"]').removeAttr('checked');
        $('input[name="event"]').filter('[value=no]').prop('checked', true);
        $('input[name="gift"]').filter('[value=no]').prop('checked', true);
        $('input[name=client-checkbox]').prop('checked', false);
      },
    });
  });
});
