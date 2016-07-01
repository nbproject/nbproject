$(function () {
  var navHeight = $(".nb-widget-header").height();

  $('.clickable').click(function () {
    $(".nb-widget-body-container").scrollTop($('#' + (this.id) + 'A').position().top - navHeight - 5);
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
    $(".nb-widget-body-container").scrollTop(0);
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
    $(".nb-widget-body-container").scrollTop($('#' + (this.id) + 'A').position().top - navHeight - 5);
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
