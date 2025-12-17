// Helpers
function qp(key, def=""){
  const url = new URL(window.location.href);
  return url.searchParams.get(key) ?? def;
}
async function loadDataset(key){
  const res = await fetch(`data/${key}.json`).catch(()=>null);
  if(!res || !res.ok) return [];
  return await res.json();
}
function downloadJSON(obj, filename){
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type: "application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
