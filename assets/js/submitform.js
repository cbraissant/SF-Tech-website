$(document).ready(function () {
  // Create a new rule to validate phone numbers
  //---------------------------------------------------------
  $.validator.methods.phone = function (value, element) {
    return (
      this.optional(element) || /(\+|0|\(|\))([0-9]|\s|\(|\)|\-)+/.test(value)
    );
  };

  // Setup the jquery.validate plugin
  //---------------------------------------------------------
  var form = $('#contact-form');

  // Setup form validation on the element
  form.validate({
    // Specify the validation rules
    rules: {
      fname: {
        required: true,
        minlength: 4,
        maxlength: 60,
      },
      femail: {
        required: true,
        email: true,
        minlength: 5,
        maxlength: 255,
      },
      fphone: {
        /*phone: true,*/
      },
      fsubject: {
        minlength: 5,
        maxlength: 255,
        required: true,
      },
      fmessage: {
        minlength: 5,
        required: true,
      },
    },
    // Specify the validation error messages
    messages: {
      fname: 'Please enter your name',
      femail: 'Please enter a valid email address',
      fphone: 'Please enter a valid phone number',
      fsubject: 'Please enter your subject (min 5 characters)',
      fphone: 'Please enter your message',
    },

    // Define what to execute when valid
    submitHandler: function (form) {
      $.ajax({
        type: 'post',
        url: '/assets/contactform.php',
        data: $('#contact-form').serialize(),
        success: function () {
          alert('Your email has been sent, thank you');
          $('#contact-form').trigger('reset');
        },
      });
    },
  });
});
