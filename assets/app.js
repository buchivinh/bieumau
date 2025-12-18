// ===== Universal base path =====
const BASE_PATH = (() => {
  const p = location.pathname;
  if (p === '/' || p.endsWith('index.html')) return '/';
  const s = p.split('/').filter(Boolean);
  return s.length > 1 ? `/${s[0]}/` : '/';
})();

const STRUCTURE = [
  { title: "Bổ sung chỉnh sửa", key: "bieumau-bscs" },
  { title: "Đề xuất ý tưởng", key: "bieumau-dxyt" },
  { title: "Đánh giá chất lượng", key: "bieumau-danhgianhanh" }
];

async function loadJSON(key){
  try{
    const r = await fetch(`${BASE_PATH}data/${key}.json`);
    if(!r.ok) return [];
    return await r.json();
  }catch{return []}
}

async function render(){
  const root = document.getElementById("tree");
  root.innerHTML = "";
  const kw = search.value.toLowerCase().trim();

  for(const node of STRUCTURE){
    const data = await loadJSON(node.key);
    if(!Array.isArray(data)) continue;

    const matched = kw
      ? data.filter(x =>
          (x.name + (x.note||"")).toLowerCase().includes(kw)
        )
      : data;

    if(kw && matched.length === 0) continue;

    const li = document.createElement("li");
    const folder = document.createElement("span");
    folder.className = "folder";
    folder.textContent = node.title;

    const ul = document.createElement("ul");

    matched.forEach(x => {
      const f = document.createElement("li");
      f.className = "file";
      f.textContent = x.name;
      ul.appendChild(f);
    });

    // Auto expand when searching
    if(kw){
      ul.style.display = "block";
      folder.classList.add("open");
    }

    folder.onclick = () => {
      const open = ul.style.display === "block";
      ul.style.display = open ? "none" : "block";
      folder.classList.toggle("open", !open);
    };

    li.appendChild(folder);
    li.appendChild(ul);
    root.appendChild(li);
  }
}

expandAll.onclick = () => {
  document.querySelectorAll(".tree ul").forEach(u => u.style.display = "block");
  document.querySelectorAll(".folder").forEach(f => f.classList.add("open"));
};

collapseAll.onclick = () => {
  document.querySelectorAll(".tree ul").forEach(u => u.style.display = "none");
  document.querySelectorAll(".folder").forEach(f => f.classList.remove("open"));
};

exportBtn.onclick = async () => {
  let rows = ["Category,Name,Note,URL"];
  for(const s of STRUCTURE){
    const d = await loadJSON(s.key);
    d.forEach(x =>
      rows.push(`"${s.title}","${x.name}","${x.note||""}","${x.url||""}"`)
    );
  }
  const blob = new Blob([rows.join("\n")], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "bieumau.csv";
  a.click();
};

search.oninput = render;

darkToggle.onclick = () =>
  document.documentElement.classList.toggle("dark");

render();
