const fs = require('fs');
const vm = require('vm');
const input = JSON.parse(fs.readFileSync('../pcas-code.json', 'utf8'));
const context = {window:{}};
vm.runInNewContext(fs.readFileSync('public/regions.js','utf8'),context);
const regions = context.window.BANHAOLE_REGIONS;
const portals = Object.fromEntries(regions.map(r=>[r.province,r.url]));
const data = {};
function add(city, province, districts) {
  if (!city || !portals[province]) return;
  if (data[city]) throw Error('Duplicate city: '+city);
  data[city] = Object.fromEntries(districts.map(d=>[d.name,(d.children||[]).map(t=>t.name)]));
  if (!regions.some(r=>r.city===city)) regions.push({city,province,url:portals[province]});
}
for (const p of input) {
  if (['北京市','上海市'].includes(p.name)) continue;
  if (['天津市','重庆市'].includes(p.name)) { add(p.name,p.name,p.children.flatMap(c=>c.children||[])); continue; }
  for (const c of p.children) {
    if (/省直辖县级行政区划|自治区直辖县级行政区划/.test(c.name)) {
      for (const d of c.children||[]) add(d.name,p.name,[d]);
    } else add(c.name,p.name,c.children||[]);
  }
}
fs.writeFileSync('public/national-localities.js','window.BANHAOLE_NATIONAL_LOCALITIES = '+JSON.stringify(data)+';\n');
fs.writeFileSync('public/national-regions.js','window.BANHAOLE_REGIONS = '+JSON.stringify(regions)+';\n(function(){const select=document.querySelector("#city");const existing=new Set([...select.options].map(o=>o.value));for(const r of window.BANHAOLE_REGIONS)if(!existing.has(r.city))select.add(new Option(r.city+"（"+r.province+"）",r.city));})();\n');
console.log(`${Object.keys(data).length} cities, ${Object.values(data).reduce((n,d)=>n+Object.keys(d).length,0)} districts, ${Object.values(data).reduce((n,d)=>n+Object.values(d).reduce((m,t)=>m+t.length,0),0)} localities`);
