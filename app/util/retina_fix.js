export default function(canvas) {
  if ( window.devicePixelRatio ) {
    var prevWidth = canvas.width;
    var prevHeight = canvas.height;

    canvas.width = prevWidth * window.devicePixelRatio;
    canvas.height = prevHeight * window.devicePixelRatio;
    canvas.style.width = prevWidth;
    canvas.style.height = prevHeight;

    canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
  }
}
