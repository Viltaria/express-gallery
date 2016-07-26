var prev = document.getElementById('prev');
var next = document.getElementById('next');

var x = location.pathname;
x = Number(x.slice(x.lastIndexOf('/') + 1, x.length));
if(location.pathname === '/gallery') {
  x = 1;
}
if(x <= 1) {
  prev.style.display = "none";
}
var numImages = document.getElementsByTagName('img');
if(numImages.length !== 20) {
  next.style.display = "none";
} //leaves edge case of where 21 pictures on one page, but none on next one
if(prev && next) {
  prev.addEventListener('click', () => {
    location.assign('/gallery/page/' + (x -1));
  });
  next.addEventListener('click', () => {
    location.assign('/gallery/page/' + (x +1));
  });
}