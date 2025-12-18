// Universal base path
const BASE_PATH = (()=>{
  const p=location.pathname;
  if(p==='/'||p.endsWith('index.html')) return '/';
  const s=p.split('/').filter(Boolean);
  return s.length>1?`/${s[0]}/`:'/';
})();

// Demo hierarchical model built at UI layer
const STRUCTURE = [
  {
    title: "Bổ sung chỉnh sửa",
    key: "bieumau-bscs",
    children: [
      { title: "Quản lý", role: ["admin","user"] },
      { title: "Hành chính", role: ["admin"] }
    ]
  },
  {
    title: "Đề xuất ý tưởng",
    key: "bieumau-dxyt",
    children: []
  },
  {
    title: "Đánh giá chất lượng",
    key: "bieumau-danhgianhanh",
    children: []
  }
];

let ROLE = "user";

async function loadJSON(key){
  try{
    const r=await fetch(`${BASE_PATH}data/${key}.json`);
    if(!r.ok) return [];
    return await r.json();
  }catch{return []}
}

async function render(){
  const root=document.getElementById("tree");
  root.innerHTML="";
  const kw=search.value.toLowerCase();

  for(const node of STRUCTURE){
    const data=await loadJSON(node.key);
    const li=document.createElement("li");
    li.innerHTML=`<span class="folder">${node.title}</span><ul></ul>`;
    const ul=li.querySelector("ul");

    data.filter(x=>(x.name+(x.note||"")).toLowerCase().includes(kw))
        .forEach(x=>{
          const f=document.createElement("li");
          f.className="file";
          f.textContent=x.name;
          ul.appendChild(f);
        });

    li.querySelector(".folder").onclick=()=>{
      ul.classList.toggle("hidden");
      li.querySelector(".folder").classList.toggle("open");
    };

    root.appendChild(li);
  }
}

expandAll.onclick=()=>document.querySelectorAll(".tree ul").forEach(u=>u.classList.remove("hidden"));
collapseAll.onclick=()=>document.querySelectorAll(".tree ul").forEach(u=>u.classList.add("hidden"));

exportBtn.onclick=async()=>{
  let rows=["Category,Name,Note,URL"];
  for(const s of STRUCTURE){
    const d=await loadJSON(s.key);
    d.forEach(x=>rows.push(`"${s.title}","${x.name}","${x.note||""}","${x.url||""}"`));
  }
  const blob=new Blob([rows.join("\n")],{type:"text/csv"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="bieumau.csv";
  a.click();
};

role.onchange=e=>{ROLE=e.target.value;render();};

darkToggle.onclick=()=>document.documentElement.classList.toggle("dark");
search.oninput=render;

render();
