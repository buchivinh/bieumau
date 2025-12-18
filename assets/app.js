const FOLDERS = [
  { key: "bieumau-bscs", title: "Bổ sung chỉnh sửa" },
  { key: "bieumau-dxyt", title: "Đề xuất ý tưởng" },
  { key: "bieumau-danhgianhanh", title: "Đánh giá chất lượng" }
];

let TREE = [];
const state = JSON.parse(localStorage.getItem("treeState") || "{}");

async function loadJSON(key) {
  const res = await fetch(`data/${key}.json`);
  return await res.json();
}

async function renderTree(filter="") {
  const root = document.getElementById("tree");
  root.innerHTML = "";
  filter = filter.toLowerCase();

  for (const f of FOLDERS) {
    const data = await loadJSON(f.key);
    const matched = data.filter(x =>
      (x.name + (x.note||"")).toLowerCase().includes(filter)
    );

    if (filter && matched.length === 0) continue;

    const li = document.createElement("li");
    const open = state[f.key];
    li.innerHTML = `
      <span class="folder ${open?'open':''}">${f.title}</span>
      <ul style="display:${open?'block':'none'}"></ul>
    `;

    const ul = li.querySelector("ul");

    matched.forEach(item => {
      const file = document.createElement("li");
      file.className = "file";
      file.textContent = "📄 " + item.name;
      file.onclick = () => openModal(item);
      ul.appendChild(file);
    });

    li.querySelector(".folder").onclick = () => {
      const isOpen = ul.style.display === "block";
      ul.style.display = isOpen ? "none" : "block";
      li.querySelector(".folder").classList.toggle("open");
      state[f.key] = !isOpen;
      localStorage.setItem("treeState", JSON.stringify(state));
    };

    root.appendChild(li);
  }
}

function openModal(x) {
  mTitle.textContent = x.name;
  mNote.textContent = x.note || "";
  mLink.href = x.url;
  modal.classList.remove("hidden");
}
function closeModal() { modal.classList.add("hidden"); }

search.oninput = e => renderTree(e.target.value);

darkToggle.onclick = () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("dark", document.documentElement.classList.contains("dark"));
};
if (localStorage.getItem("dark") === "true") document.documentElement.classList.add("dark");

renderTree();
