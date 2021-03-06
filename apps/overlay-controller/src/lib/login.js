/* eslint-env jquery */
/* eslint no-undef: "error" */
$(document).ready(function ready() {
  const errorDialog = document.getElementById('login-fail-dialog');
  $('form').submit(function formSubmit(event) {
    const email = $('.email').val();
    const password = $('.password').val();
    event.preventDefault();

    $.ajax({
      type: 'POST',
      url: `${process.env.OVERLAY_CONTROLLER_HOST}/auth/login?type=admin`,
      data: { email, password, stayLogedIn: true, type: 'admin' },
      success(data) {
        window.location.href = '/';
      },
      error() {
        errorDialog.showModal();
        setTimeout(() => {
          errorDialog.close();
        }, 3000);
      },
    });
  });
});
