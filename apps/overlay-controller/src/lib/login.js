/* eslint-env jquery */
/* eslint no-undef: "error" */
$(document).ready(function ready() {
  $('form').submit(function formSubmit(event) {
    const email = $('.email').val();
    const password = $('.password').val();
    event.preventDefault();

    console.log({ email, password, userType: 'admin' });
    $.ajax({
      type: 'POST',
      url: `http://localhost:3333/auth/login?type=admin`,
      data: { email, password },
      success(data) {
        console.log(data);
        window.location.href('/');
      },
    });
  });
});
