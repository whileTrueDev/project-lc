/* eslint-env jquery */
let roomName;
const socket = io('http://localhost:3002', { transports: ['websocket'] });

socket.on('creator list from server', (data) => {
  if (data) {
    $('#connection-status').text('정상');
  } else {
    $('#connection-status').text('에러');
  }
});

$(document).ready(function () {
  $('#table_id').DataTable({ lengthChange: false });

  const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, 16);

  $('#end-time-picker').val(localISOTime);

  $('.socket-id-button').click(function () {
    const nickname = $(this).closest('tr').prop('id');
    const url = $(this).closest('tr').children('td.url-cell').text();

    $('#creator-name').text(nickname);
    socket.emit('request creator list', {
      roomName: socket.id,
      url,
    });
    roomName = url.split('/').pop();
  });

  $('#screen-show-button').click(function () {
    socket.emit('show live commerce', roomName);
  });

  $('#screen-hide-button').click(function () {
    socket.emit('quit live commerce', roomName);
  });

  $('#logo-toggle-button').click(function () {
    socket.emit('toggle right-top onad logo', roomName);
  });

  $('#bottom-area-toggle-button').click(function () {
    socket.emit('toggle bottom area from admin', roomName);
  });

  $('#show-intro-video-button').click(function () {
    socket.emit('show video from admin', { roomName, type: 'intro' });
  });

  $('#show-outro-video-button').click(function () {
    socket.emit('show video from admin', { roomName, type: 'outro' });
  });

  $('#hide-video-button').click(function () {
    socket.emit('clear full video', roomName);
  });

  $('#refresh-button').click(function () {
    socket.emit('refresh', roomName);
  });

  $('#end-time-send-button').click(function () {
    const selectedTime = $('#end-time-picker').val();
    socket.emit('get d-day', { roomName, date: selectedTime });
  });

  $('form').submit(function (event) {
    event.preventDefault();
    let level;
    let isLogin = true;
    const standardPrice = $('#standard-price').val();
    const productName = $('#product-name').val();
    const soldPrice = $('#sold-price').val();
    const customerNickname = $('#customer-nickname').val();
    const customerMessage = $('#customer-message').val();
    if (standardPrice > soldPrice) {
      level = '1';
      console.log(level);
    } else {
      level = '2';
      console.log(level);
    }
    if (customerMessage.trim().length === 0) {
      isLogin = false;
    }
    console.log(
      `레벨 : ${level}
      회원 여부 : ${isLogin}
      구매상품 : ${productName}
      구매액 : ${soldPrice}
      구매자 : ${customerNickname}
      메세지 : ${customerMessage}
      `,
    );
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3333/purchase-message',
      data: {
        level,
        loginFlag: isLogin,
        productName,
        purchaseNum: Number(soldPrice),
        nickname: customerNickname,
        message: customerMessage,
      },
      success: alert('success'),
    });
  });
});
