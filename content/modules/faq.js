$(function () {

  $('.clickable').click(function () {
    window.scrollTo(0, $('#' + (this.id) + 'A').position().top - 80);
  });

  $('.clickable').mouseover(function () {
    this.style.textDecoration = 'underline';
    this.style.color = 'blue';
  });

  $('.clickable').mouseout(function () {
    this.style.textDecoration = 'none';
    this.style.color = 'black';
  });

  $('.backToTop').click(function () {
    window.scrollTo(0, 0);
  });

  $('.backToTop').mouseover(function () {
    this.style.textDecoration = 'underline';
    this.style.color = 'blue';
  });

  $('.backToTop').mouseout(function () {
    this.style.textDecoration = 'none';
    this.style.color = 'black';
  });

  $('.clickable2').click(function () {
    window.scrollTo(0, $('#' + (this.id) + 'A').position().top - 100);
  });

  $('.clickable2').mouseover(function () {
    this.style.textDecoration = 'underline';
    this.style.color = 'blue';
  });

  $('.clickable2').mouseout(function () {
    this.style.textDecoration = 'none';
    this.style.color = 'black';
  });

  $('.clickable3').mouseover(function () {
    this.style.textDecoration = 'underline';
    this.style.color = 'blue';
  });

  $('.clickable3').mouseout(function () {
    this.style.textDecoration = 'none';
    this.style.color = 'black';
  });
});
