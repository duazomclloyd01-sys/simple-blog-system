const API = 'http://localhost:3000/api';

let token = localStorage.getItem('token');

async function register() {
  await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  alert('Registered!');
}
function togglePassword() {
  const pass = document.getElementById('password');

  if (pass.type === 'password') {
    pass.type = 'text';
  } else {
    pass.type = 'password';
  }
}

//LOGIN
async function login() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (!data.token) {
      alert('Login failed');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', username.value);

    //  REMOVE DELAY / FIX REDIRECT
    window.location.href = 'index.html';

  } catch (err) {
    console.log(err);
    alert('Error login');
  }
}

//EDIT POST
async function editPost(id) {
  console.log("EDIT CLICKED:", id);

  const res = await fetch('http://localhost:3000/api/posts');
  const posts = await res.json();

  const post = posts.find(p => p.id == id);
  document.getElementById('category').value = post.category || "";
  document.getElementById('title').value = post.title;
  document.getElementById('content').value = post.content;
  

  window.editId = id;
}

//Get Post
async function getPosts() {
  console.log("LOADING POSTS...");

  try {
    const res = await fetch('http://localhost:3000/api/posts');
    const posts = await res.json();

    console.log("POSTS:", posts);

    const container = document.getElementById('posts');

    if (!container) {
      console.error("❌ WALANG ELEMENT #posts");
      return;
    }

    if (posts.length === 0) {
      container.innerHTML = "<p>No posts yet</p>";
      return;
    }

    container.innerHTML = posts.map(p => `
      <div class="post-card">

        <div class="post-header">
          <span class="category">
            ${p.category || 'No Category'}
          </span>
        </div>

        <h3 class="post-title">
          ${p.title}
        </h3>

        <p class="post-content">
          ${p.content}
        </p>

        <small class="post-date">
          Posted on ${p.createdAt || 'No Date'}
        </small>

        <div class="post-actions">
          <button class="edit" onclick="editPost('${p.id}')">
            Edit
          </button>

          <button class="delete" onclick="deletePost('${p.id}')">
            Delete
          </button>
        </div>

      </div>
    `).join('');

  } catch (err) {
    console.error("ERROR:", err);
  }
}

// SEARCH POSTS

document.getElementById('search').addEventListener('input', function () {

  const searchValue = this.value.toLowerCase();

  const posts = document.querySelectorAll('.post-card');

  posts.forEach(post => {

    const text = post.innerText.toLowerCase();

    if (text.includes(searchValue)) {
      post.style.display = '';
    } else {
      post.style.display = 'none';
    }

  });

});

//DELETE POST
async function deletePost(id) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    });

    if (res.ok) {
      alert("Deleted successfully!");
      getPosts(); // refresh UI
    } else {
      throw new Error("Delete failed");
    }

  } catch (err) {
    console.error(err);
    alert("Delete failed!");
  }
}
//ADD POSt
async function addPost() {
  const token = localStorage.getItem('token');

 const data = {
  title: document.getElementById('title').value,
  content: document.getElementById('content').value,
  category: document.getElementById('category').value,

  createdAt: new Date().toLocaleDateString()
};

const category = document.getElementById('category').value;
console.log("Selected category:", category);
  if (!category && !window.editId) {
    alert("Please select category!");
    return;
  }

  // VALIDATION
  if (!data.category) {
    alert("Please select category!");
    return;
  }

  // EDIT MODE
  if (window.editId) {

    await fetch(`http://localhost:3000/api/posts/${window.editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(data)
    });

    alert("Updated successfully!");

    window.editId = null;

  } else {

    // ADD MODE
    await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(data)
    });

    alert("Added successfully!");
  }

  // CLEAR INPUTS
  document.getElementById('title').value = "";
  document.getElementById('content').value = "";
  document.getElementById('category').value = "";

  getPosts();
}
window.onload = getPosts;

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}