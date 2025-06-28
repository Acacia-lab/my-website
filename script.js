const products = [
  {
    id: "sp001",
    name: "Regenesi Rigenera Jeans Bag",
    price: 200000,
    imageUrl: "https://acacia-lab.github.io/my-website/2D/AVT.png",
    glbUrl: "https://acacia-lab.github.io/my-website/3D/source/model.glb",
    trace: [
      { label: "Thu gom vải jeans", detail: "Thu gom quần áo jeans đã qua sử dụng từ cộng đồng." },
      { label: "Tái chế sợi vải", detail: "Vải jeans cũ được làm sạch, cắt nhỏ, xử lý và tái chế thành sợi mới." },
      { label: "Gia công & Lắp ráp", detail: "Các sợi vải được dệt thành vải mới và gia công thành túi xách thời trang." }
    ]
  }
];

let prevSection = 'home';

function showSection(id) {
  for (const section of document.querySelectorAll('section')) {
    section.style.display = section.id === id ? '' : 'none';
  }
  if (id === 'history') renderHistory();
  if (id === 'rewards') renderRewards();
  if (id === 'products') renderProducts();
  // Highlight nav
  document.querySelectorAll('#mainNav button').forEach(btn => btn.classList.remove('active'));
  if (id === 'home') document.getElementById('nav-home').classList.add('active');
  prevSection = id;
}

function submitSchedule(event) {
  event.preventDefault();
  const form = event.target;
  const type = form.type.value;
  const time = form.time.value;
  const address = form.address.value;
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  history.push({
    date: time.split('T')[0],
    type, point: 10, status: 'Đã thu gom'
  });
  localStorage.setItem('history', JSON.stringify(history));
  document.getElementById('scheduleMsg').innerText = 'Đặt lịch thành công!';
  form.reset();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  let total = 0;
  for (const x of history) {
    total += x.point;
    tbody.innerHTML += `<tr>
      <td>${x.date}</td><td>${x.type}</td><td>${x.point}</td><td>${x.status}</td>
    </tr>`;
  }
  document.getElementById('totalPoints').innerHTML = `<b>Tổng điểm: ${total}</b>`;
}

const rewards = [
  { id: 1, name: "Voucher 50k", point: 50 },
  { id: 2, name: "Bình giữ nhiệt tái chế", point: 100 }
];
function renderRewards() {
  const ul = document.getElementById('rewardList');
  ul.innerHTML = '';
  for (const r of rewards) {
    ul.innerHTML += `<li>${r.name} - <b>${r.point} điểm</b>
    <button onclick="redeem(${r.point})">Đổi ngay</button></li>`;
  }
}
function redeem(point) {
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  let total = history.reduce((a, b) => a + b.point, 0);
  if (total < point) {
    alert('Không đủ điểm!');
    return;
  }
  alert('Đổi quà thành công!');
}

function renderProducts() {
  const box = document.getElementById('productList');
  box.innerHTML = '';
  for (const p of products) {
    const url = window.location.origin + window.location.pathname + `?product=${p.id}`;
    box.innerHTML += `
    <div class="product-card">
      <img src="${p.imageUrl}" alt="${p.name}" width="150" height="150">
      <h3>${p.name}</h3>
      <div><b>${p.price.toLocaleString()}₫</b></div>
      <div><img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(url)}" alt="QR"></div>
      <button onclick="showProductDetail('${p.id}')">Chi tiết tái chế</button>
      <button onclick="show3DViewer('${p.id}')">Xem 3D</button>
    </div>`;
  }
  document.getElementById('productDetail').style.display = 'none';
}
function showProductDetail(id) {
  const p = products.find(x => x.id === id);
  let html = `<h3>${p.name}</h3>
  <img src="${p.imageUrl}" alt="${p.name}">
  <ul style="margin-left:15px;">`;
  for (const t of p.trace) {
    html += `<li><b>${t.label}:</b> ${t.detail}</li>`;
  }
  html += `</ul><button onclick="closeProductDetail()">Đóng</button>`;
  const detail = document.getElementById('productDetail');
  detail.innerHTML = html;
  detail.style.display = '';
}
function closeProductDetail() {
  document.getElementById('productDetail').style.display = 'none';
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function show3DViewer(productId) {
  // Lưu lại section trước đó để nút quay lại hoạt động
  let currentSection = prevSection;
  for (const s of document.querySelectorAll('section')) s.style.display = 'none';
  document.getElementById('product3dviewer').style.display = '';

  const product = products.find(p => p.id === productId);
  document.getElementById('product3dinfo').innerHTML = `
    <h3>${product.name}</h3>
    <p><b>Giá:</b> ${product.price.toLocaleString()}₫</p>
    <ul>${product.trace.map(t => `<li><b>${t.label}:</b> ${t.detail}</li>`).join('')}</ul>
    <button id="back3d" onclick="backFrom3d('${currentSection}')">&larr; Quay lại</button>
  `;
  const viewer = document.getElementById('viewer3d');
  viewer.src = product.glbUrl;
  viewer.alt = product.name;
}

function backFrom3d(section) {
  showSection(section);
}

window.onload = function () {
  // Logo click về trang chủ
  document.getElementById('logo-home').onclick = function() {
    showSection('home');
  };
  // SPA logic
  const pid = getQueryParam('product');
  if (pid) {
    show3DViewer(pid);
  } else {
    showSection('home');
  }
};