// ===== Universal BASE PATH =====
const BASE_PATH = (() => {
  const p = location.pathname;
  if (p === '/' || p === '/index.html') return '/';
  const parts = p.split('/').filter(Boolean);
  return parts.length >= 1 ? `/${parts[0]}/` : '/';
})();

const STRUCTURE = [
  { title: "Bổ sung chỉnh sửa", key: "bieumau-bscs" },
  { title: "Đề xuất ý tưởng", key: "bieumau-dxyt" },
  { title: "Đánh giá chất lượng", key: "bieumau-danhgianhanh" }
{ title: "Đánh giá chất lượng1", key: "bieumau-danhgianhanh" }
];

async function loadJSON(key){
  try{
    const r = await fetch(`${BASE_PATH}data/${key}.json`);
    if(!r.ok) return [];
    return await r.json();
  }catch{return []}
}

function createFolderNode(title, childrenUl){
  const span = document.createElement("span");
  span.className = "node folder";

  const icon = document.createElement("span");
  icon.className = "folder-icon";
  icon.textContent = "📁";

  const text = document.createElement("span");
  text.textContent = title;

  span.appendChild(icon);
  span.appendChild(text);

  span.onclick = () => {
    const collapsed = childrenUl.classList.toggle("collapsed");
    icon.textContent = collapsed ? "📁" : "📂";
  };

  return span;
}

function createFileNode(name){
  const span = document.createElement("span");
  span.className = "node file";

  const icon = document.createElement("span");
  icon.className = "file-icon";
  icon.textContent = "📄";

  const text = document.createElement("span");
  text.textContent = name;

  span.appendChild(icon);
  span.appendChild(text);

  return span;
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
    const ul = document.createElement("ul");
    ul.className = kw ? "" : "collapsed";

    matched.forEach(x => {
      const cli = document.createElement("li");
      cli.appendChild(createFileNode(x.name));
      ul.appendChild(cli);
    });

    const folderNode = createFolderNode(node.title, ul);

    if(kw){
      ul.classList.remove("collapsed");
      folderNode.querySelector(".folder-icon").textContent = "📂";
    }

    li.appendChild(folderNode);
    li.appendChild(ul);
    root.appendChild(li);
  }
}

expandAll.onclick = () => {
  document.querySelectorAll(".tree ul").forEach(ul => ul.classList.remove("collapsed"));
  document.querySelectorAll(".folder-icon").forEach(i => i.textContent = "📂");
};

collapseAll.onclick = () => {
  document.querySelectorAll(".tree ul").forEach(ul => ul.classList.add("collapsed"));
  document.querySelectorAll(".folder-icon").forEach(i => i.textContent = "📁");
};

search.oninput = render;

render();
