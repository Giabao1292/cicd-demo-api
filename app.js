const button = document.querySelector('#celebrate');
const message = document.querySelector('#message');
document.querySelector('#year').textContent = new Date().getFullYear();
button.addEventListener('click', () => {
  message.textContent = 'Thay đổi này sẽ được deploy khi bạn commit và push nó lên main.';
});
