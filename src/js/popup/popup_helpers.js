import $ from 'jquery';

export function showError(){
  $('#message').text('Umm something went wrong');
}

export function loading(){
  $("#spinner").css({
    display: "block",
    visibility: "unset",
    margin: "1em 0",
  });
}

export function finishLoading(){
  $("#spinner").css({
    display: "none",
    visibility: "hidden",
    height: "0",
    margin: "0"
  });
}
