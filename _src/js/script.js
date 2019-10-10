$(document).ready(function() {
  // Display the submenu when clicked
  $('.menu-dropdown').click(function() {
    $(this)
      .siblings()
      .removeClass('is-active');
    $(this).toggleClass('is-active');
  });

  // Display the menu when clicked
  $('.menu-icon').click(function() {
    console.log('click');
    $('body').toggleClass('menu-is-open');
  });

  // Disable enter key to submit form
  $('form input').keydown(function(event) {
    // When a key is pressed
    if (event.keyCode == 13) {
      // Check if the key is "enter"
      event.preventDefault(); // Disable default behavior
      return false; // Quit the function and return false
    }
  });
});

// Disable all active elements on resize
window.onresize = function(event) {
  $('body').removeClass('menu-is-open');
  $('body')
    .find('.is-active')
    .removeClass('is-active');
};

// Change the size of the heeader when the window is scrolled
$(window).on('scroll', function() {
  var scrollTop = $(window).scrollTop();
  if (scrollTop > 200) {
    $('#masthead').addClass('is-scroll');
  } else {
    $('#masthead').removeClass('is-scroll');
  }
});

// hide the scroll wheel when the window is scrolled
$(window).on('scroll', function() {
  var scrollTop = $(window).scrollTop();
  if (scrollTop > 50) {
    $('#icon-scroll').addClass('is-scroll');
  }
});

// CSS animation on scroll
AOS.init({
  duration: 800
});

// ScrollReveal - Reveal items on scroll
ScrollReveal().reveal('.jsReveal', {
  delay: 0,
  duration: 300,
  scale: 0.0,
  reset: true
});

// Smooth Scroll
// -------------------------------------------------------
// Disable the drag and drop of the button class
$('.btn').on('dragstart', function(event) {
  event.preventDefault();
});

// Vanilla JS buggy!!!!
// -------------------------------------------------------
// Ease the jump to a link in the same page
// let anchorlinks = document.querySelectorAll('a[href^="#"]')
// var headerOffset = 60;
// for (let item of anchorlinks) { // relitere
//     item.addEventListener('click', (e)=> {
//         let hashval = item.getAttribute('href')
//         let target = document.querySelector(hashval)
//         var elementPosition = target.getBoundingClientRect().top;
//         let actualPosition =  window.scrollY;
//         var offsetPosition = elementPosition - headerOffset + actualPosition;
//             window.scrollTo({
//                 top: offsetPosition,
//               behavior: "smooth"
//             });
//     })
// }

//  JQuery animate as replacement
// -------------------------------------------------------
// For each link with an anchor (#) as destination
$('a[href^="#"]').each(function(index, value) {
  // When the link is clicked
  $(this).click(function() {
    // Get the destination of the link (the anchor value)
    var hashval = $(this).attr('href');
    // Set the target to the anchor
    var target = $(hashval);
    // Get the Y position of the target
    var targetPosition = target.offset().top;
    var headerHeight = 60;
    // Offset the value by the header
    var offsetPosition = targetPosition - headerHeight;
    // Scroll smoothly to the destination
    $('html, body').animate(
      {
        scrollTop: offsetPosition
      },
      {
        duration: 600
      }
    );
  });
});
