var prev = document.getElementById('prev');
var next = document.getElementById('next');

var x = location.pathname;
x = Number(x.slice(x.lastIndexOf('/') + 1, x.length));
if(location.pathname === '/gallery') {
  x = 1;
}
if(prev && next) {
  prev.addEventListener('click', () => {
    location.assign('/gallery/page/' + (x -1));
  });
  next.addEventListener('click', () => {
    location.assign('/gallery/page/' + (x +1));
  });
}