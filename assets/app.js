// ===== UNIVERSAL BASE PATH (IIS + GitHub Pages) =====
// Example:
//  - https://buchivinh.github.io/bieumau/  -> /bieumau/
//  - http://localhost/                    -> /
//  - http://localhost/bieumau/            -> /bieumau/

const BASE_PATH = (() => {
  const path = location.pathname;
  if (path === "/" || path.endsWith("/index.html")) return "/";
  const parts = path.split("/").filter(Boolean);
  return parts.length > 1 ? `/${parts[0]}/` : "/";
})();

const FOLDERS = [
  { key: "bieumau-bscs", title: "Bổ sung chỉnh sửa" },
  { key: "bieumau-dxyt", title: "Đề xuất ý tưởng" },
  { key: "bieumau-danhgianhanh", title: "Đánh giá chất lượng" }
];

const state = JSON.parse(localStorage.getItem("treeState") || "{}");

async function loadJSON(key) {
  try {
    const res = await fetch(`${BASE_PATH}data/${key}.json`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function renderTree(filter = "") {
  const root = document.getElementById("tree");
  root.innerHTML = "";
  filter = filter.toLowerCase();

  for (const f of FOLDERS) {
    const data = await loadJSON(f.key);
    if (!Array.isArray(data)) continue;

    const matched = data.filter(x =>
      (x.name + (x.note || "")).toLowerCase().includes(filter)
    );

    if (filter && matched.length === 0) continue;

    const li = document.createElement("li");
    const isOpen = state[f.key];

    li.innerHTML = `
      <span class="folder ${isOpen ? "open" : ""}">${f.title}</span>
      <ul style="display:${isOpen ? "block" : "none"}"></ul>
    `;

    const ul = li.querySelector("ul");

    matched.forEach(item => {
      const file = document.createElement("li");
      file.className = "file";
      file.textContent = "📄 " + item.name;
      file.onclick = (e) => {
        e.stopPropagation();
        openModal(item);
      };
      ul.appendChild(file);
    });

    li.querySelector(".folder").onclick = (e) => {
      e.stopPropagation();
      const open = ul.style.display === "block";
      ul.style.display = open ? "none" : "block";
      li.querySelector(".folder").classList.toggle("open");
      state[f.key] = !open;
      localStorage.setItem("treeState", JSON.stringify(state));
    };

    root.appendChild(li);
  }
}

function openModal(x) {
  if (!x || !x.name || !x.url) return;
  mTitle.textContent = x.name;
  mNote.textContent = x.note || "";
  mLink.href = x.url;
  modal.classList.remove("hidden");
}

function closeModal() { modal.classList.add("hidden"); }

modal.onclick = (e) => { if (e.target === modal) closeModal(); };
closeBtn.onclick = closeModal;

search.oninput = e => renderTree(e.target.value);

// Dark mode (remembered)
darkToggle.onclick = () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("dark", document.documentElement.classList.contains("dark"));
};
if (localStorage.getItem("dark") === "true") {
  document.documentElement.classList.add("dark");
}

renderTree();
