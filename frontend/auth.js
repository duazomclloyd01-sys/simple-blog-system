const API = 'http://localhost:3000/api/auth';

async function login() {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  console.log(data); // debug

  if (data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = 'index.html';
  } else {
    alert(data.msg);
  }
}