$(document).ready(function(){

    // Display the submenu when clicked
    $(".menu-dropdown").click(function(){
        $(this).siblings().removeClass('is-active');
        $(this).toggleClass("is-active");
    });

    // Display the menu when clicked
    $(".menu-icon").click(function(){
        console.log("click");
        $("body").toggleClass("menu-is-open");
    });

    // Disable enter key to submit form
    $('form input').keydown(function(event){  // When a key is pressed
        if(event.keyCode == 13) {   // Check if the key is "enter"
            event.preventDefault();   // Disable default behavior
            return false;             // Quit the function and return false
        }
    });
})

// Disable all active elements on resize
window.onresize = function(event) {
    $("body").removeClass("menu-is-open");
    $("body").find(".is-active").removeClass("is-active");
};



// CONTACT FORM
// ==========================================================================
