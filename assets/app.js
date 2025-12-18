// ===== Universal BASE PATH =====
const BASE_PATH = (() => {
  const p = location.pathname;
  if (p === '/' || p === '/index.html') return '/';
  const parts = p.split('/').filter(Boolean);
  return parts.length >= 1 ? `/${parts[0]}/` : '/';
})();

const STRUCTURE = [
  { title: "1. Bổ sung chỉnh sửa", key: "bieumau-bscs" },
  { title: "2. Đề xuất ý tưởng", key: "bieumau-dxyt" },
  { title: "3. Đánh giá chất lượng", key: "bieumau-danhgianhanh" }
];

function clearSelection(){
  document.querySelectorAll(".node.selected")
    .forEach(n => n.classList.remove("selected"));
}

/* ===== PANEL PLACEHOLDER ===== */
function showPlaceholder(){
  const panel = document.getElementById("detail");
  panel.innerHTML = `
    <div class="detail-box card placeholder">
      <p>
        👉 <span style="color:#2563eb; font-weight:600;">
          Mời bạn chọn một thư mục và nhấn vào biểu mẫu để sử dụng
        </span>
      </p>
    </div>
  `;
}

async function loadJSON(key){
  try{
    const r = await fetch(`${BASE_PATH}data/${key}.json`);
    if(!r.ok) return [];
    return await r.json();
  }catch{return []}
}

/* ===== SHOW FILE DETAIL ===== */
function showDetail(item){
  const panel = document.getElementById("detail");
  panel.innerHTML = `
    <div class="detail-box card">
      <p><strong>${item.name}</strong></p>
      <p>${item.note || "Không có mô tả"}</p>
      <div class="detail-actions">
        <a href="${item.url}" target="_blank">Mở biểu mẫu</a>
      </div>
    </div>
  `;
}

/* ===== FOLDER NODE ===== */
function createFolderNode(title, ul){
  const span = document.createElement("span");
  span.className = "node folder";

  const icon = document.createElement("span");
  icon.className = "folder-icon";
  icon.textContent = "📁";

  const text = document.createElement("span");
  text.textContent = title;

  span.append(icon, text);

  span.onclick = (e) => {
    e.stopPropagation();
    clearSelection();
    span.classList.add("selected");

    showPlaceholder(); // 🔥 chọn thư mục → panel B trống

    const open = ul.style.display === "block";
    ul.style.display = open ? "none" : "block";
    icon.textContent = open ? "📁" : "📂";
  };

  return span;
}

/* ===== FILE NODE ===== */
function createFileNode(item){
  const span = document.createElement("span");
  span.className = "node file";

  const icon = document.createElement("span");
  icon.className = "file-icon";
  icon.textContent = "📄";

  const text = document.createElement("span");
  text.textContent = item.name;

  span.append(icon, text);

  span.onclick = (e) => {
    e.stopPropagation();
    clearSelection();
    span.classList.add("selected");
    showDetail(item); // 🔥 chỉ file mới hiện B
  };

  span.ondblclick = (e) => {
    e.stopPropagation();
    if(item.url){
      window.open(item.url, "_blank");
    }
  };

  return span;
}

/* ===== RENDER TREE ===== */
async function render(){
  const root = document.getElementById("tree");
  root.innerHTML = "";
  const kw = search.value.toLowerCase().trim();

  for(const s of STRUCTURE){
    const data = await loadJSON(s.key);
    if(!Array.isArray(data)) continue;

    const matched = kw
      ? data.filter(x =>
          (x.name + (x.note||"")).toLowerCase().includes(kw)
        )
      : data;

    if(kw && matched.length === 0) continue;

    const li = document.createElement("li");
    const ul = document.createElement("ul");
    ul.style.display = kw ? "block" : "none";

    matched.forEach(x => {
      const cli = document.createElement("li");
      cli.appendChild(createFileNode(x));
      ul.appendChild(cli);
    });

    const folder = createFolderNode(s.title, ul);
    if(kw) folder.querySelector(".folder-icon").textContent = "📂";

    li.append(folder, ul);
    root.appendChild(li);
  }
}

/* ===== CLICK OUTSIDE → RESET ===== */
document.addEventListener("click", (e) => {
  const tree = document.querySelector(".left");
  const detail = document.querySelector(".right");

  if (!tree.contains(e.target) && !detail.contains(e.target)) {
    clearSelection();
    showPlaceholder();
  }
});

/* ===== CONTROLS ===== */
expandAll.onclick = () => {
  document.querySelectorAll(".tree ul").forEach(ul => ul.style.display="block");
  document.querySelectorAll(".folder-icon").forEach(i=>i.textContent="📂");
};

collapseAll.onclick = () => {
  document.querySelectorAll(".tree ul").forEach(ul => ul.style.display="none");
  document.querySelectorAll(".folder-icon").forEach(i=>i.textContent="📁");
};

search.oninput = render;

/* ===== INIT ===== */
showPlaceholder();
render();
