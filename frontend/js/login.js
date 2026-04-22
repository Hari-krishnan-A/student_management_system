var API_BASE = 'http://localhost:3000';

var usernameEl = document.getElementById('username');
var passwordEl = document.getElementById('password');
var loginBtn = document.getElementById('loginBtn');
var msgEl = document.getElementById('msg');

// This function shows a message in green or red
function showLoginMessage(text, ok) {
  msgEl.textContent = text;
  msgEl.className = ok ? 'msg-success' : 'msg-error';
}

// This function handles login
function login() {
  var username = usernameEl.value.trim();
  var password = passwordEl.value.trim();

  msgEl.textContent = '';

  if (username === '' || password === '') {
    showLoginMessage('Enter username and password', false);
    return;
  }

  fetch(API_BASE + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
  })
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok || !data.success) {
          showLoginMessage('Invalid Username or Password', false);
          return;
        }

        showLoginMessage('Login Successful', true);
        sessionStorage.setItem('sms_logged_in', 'true');

        setTimeout(function () {
          window.location.href = 'dashboard.html';
        }, 500);
      });
    })
    .catch(function () {
      showLoginMessage('Cannot connect to server. Start backend first.', false);
    });
}

loginBtn.addEventListener('click', function () {
  login();
});
