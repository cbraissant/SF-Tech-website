// When the document is ready
$(document).ready(function() {


// Disable enter key to submit form
//---------------------------------------------------------
  $('form input').keydown(function(event){  // When a key is pressed
    if(event.keyCode == 13) {   // Check if the key is "enter"
      event.preventDefault();   // Disable default behavior
      return false;             // Quit the function and return false
    }
  });




// Create a new rule to validate phone numbers
//---------------------------------------------------------
  $.validator.methods.phone = function( value, element ) {
      return this.optional( element )
        || /(\+|0|\(|\))([0-9]|\s|\(|\)|\-)+/.test( value );
  }



// Setup the validate
//---------------------------------------------------------
  // Define which form to use for the validation
  var form = $("#contact-form");

  // Setup form validation on the #registerform element
  form.validate({

      // Specify the validation rules
      rules: {
          fname: {
              required: true,
              minlength: 4,
              maxlength: 60
          },
          femail: {
              required: true,
              email: true,
              minlength: 5,
              maxlength: 255
          },
          fphone: {
              /*phone: true,*/
          },
          fsubject: {
              required: true,
          },
          fmessage: {
              // required: true,
          }
      },
      // Specify the validation error messages
      messages: {
          fname: "Please enter your name",
          femail: "Please enter a valid email address",
          fphone: "Please enter a valid phone number",
          fsubject: "Please enter your subject",
          fphone: "Please enter your message"
      },
      
      // Define what to execute when valid
      submitHandler: function(form) {
          $.ajax({
              type: 'post',
              url: '../contactform.php',
              data: $('#contact-form').serialize(),     
              success: function(){
                alert("email sent");
                $('#contact-form').trigger("reset");
            }
        });
      }
  });

});


