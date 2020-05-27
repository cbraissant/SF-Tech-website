// **************************************************
// NATIVE JAVASCRIPT
// **************************************************

// Display the submenus when clicked
// **************************************************

// Select all the dropdown menus
const menu = document.querySelectorAll('.menu-dropdown');
// Fonction to select only the siblings
const getSiblings = n => [...n.parentElement.children].filter(c => c != n);
// Loop through each menu
menu.forEach(item => {
  // Add a click event
  item.addEventListener('click', e => {
    // Toggle the active element
    e.currentTarget.classList.toggle('is-active');
    // Get the siblings elements
    const siblings = getSiblings(e.currentTarget);
    // Loop through the siblings and remove the active class
    siblings.forEach(sib => sib.classList.remove('is-active'));
  });
});

// Toggle the menu when the icon is clicked
// **************************************************
document.querySelector('.menu-icon').addEventListener('click', () => {
  document.querySelector('body').classList.toggle('menu-is-open');
});

// Disable enter key to submit form
// **************************************************
document.addEventListener('keydown', e => {
  e.keyCode == 13 && e.target == document.querySelector('form input')
    ? e.preventDefault()
    : null;
});

// Disable all active elements on resize
// **************************************************
window.onresize = () => {
  document.querySelector('body').classList.remove('menu-is-open');
  document
    .querySelectorAll('.is-active')
    .forEach(item => item.classList.remove('is-active'));
};

// Change the size of the header when the window is scrolled
// **************************************************
const masthead = document.querySelector('#masthead');
window.addEventListener('scroll', () => {
  window.scrollY > 200
    ? masthead.classList.add('is-scroll')
    : masthead.classList.remove('is-scroll');
});

// hide the scroll wheel when the window is scrolled
// **************************************************
window.addEventListener('scroll', () => {
  window.scrollY > 50
    ? document.querySelector('#icon-scroll').classList.add('is-scroll')
    : null;
});

// **************************************************
// JQUERY - OLD
// **************************************************

// $(document).ready(function() {
//   Display the submenu when clicked
//   $('.menu-dropdown').click(function() {
//     $(this)
//       .siblings()
//       .removeClass('is-active');
//     $(this).toggleClass('is-active');
//   });
//   Display the menu when clicked
//   $('.menu-icon').click(function() {
//     $('body').toggleClass('menu-is-open');
//   });
//   // Disable enter key to submit form
//   $('form input').keydown(function(event) {
//     // When a key is pressed
//     if (event.keyCode == 13) {
//       // Check if the key is "enter"
//       event.preventDefault(); // Disable default behavior
//       return false; // Quit the function and return false
//     }
//   });
// });

// Disable all active elements on resize
// window.onresize = function(event) {
//   $('body').removeClass('menu-is-open');
//   $('body')
//     .find('.is-active')
//     .removeClass('is-active');
// };

// Change the size of the header when the window is scrolled
// $(window).on('scroll', function() {
//   var scrollTop = $(window).scrollTop();
//   if (scrollTop > 200) {
//     $('#masthead').addClass('is-scroll');
//   } else {
//     $('#masthead').removeClass('is-scroll');
//   }
// });

// hide the scroll wheel when the window is scrolled
// $(window).on('scroll', function() {
//   var scrollTop = $(window).scrollTop();
//   if (scrollTop > 50) {
//     $('#icon-scroll').addClass('is-scroll');
//   }
// });

// **************************************************
// VENDOR
// **************************************************

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

// Disable the drag and drop of the button class
// $('.btn').on('dragstart', function(event) {
//   event.preventDefault();
// });

// Smooth Scroll
// -------------------------------------------------------

// Vanilla JS
// -------------------------------------------------------
// Ease the jump to a link in the same page
let headerOffset = document.querySelector('header').offsetHeight;
let anchorlinks = document.querySelectorAll('a[href^="#"]');

for (let item of anchorlinks) {
  item.addEventListener('click', e => {
    let hashval = item.getAttribute('href');
    let target = document.querySelector(hashval);
    let elementPosition = target.getBoundingClientRect().top;
    console.log('begining of paragraph: ' + elementPosition);
    let actualPosition = window.scrollY;
    console.log('actual position: ' + actualPosition);
    var offsetPosition = elementPosition - headerOffset + actualPosition;
    console.log('offset to scroll: ' + offsetPosition);
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    e.preventDefault();
  });
}