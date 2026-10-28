(function(root){'use strict';
function stable(x){if(x===undefined)return '__missing__';if(x===null||typeof x!=='object')return JSON.stringify(x);if(Array.isArray(x))return '['+x.map(stable).join(',')+']';return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}'}
function same(a,b){return stable(a)===stable(b)}
function map(items){const m=new Map();for(const x of items){if(!x||typeof x.key!=='string'||!x.key||m.has(x.key))throw Error('记录标识无效或重复');m.set(x.key,x)}return m}
function merge(base,local,remote,choices={}){const result={routes:[],cases:[]},conflicts=[];for(const kind of ['routes','cases']){const b=map(base[kind]),l=map(local[kind]),r=map(remote[kind]);const keys=[...new Set([...l.keys(),...r.keys(),...b.keys()])];for(const key of keys){const bv=b.get(key),lv=l.get(key),rv=r.get(key);let value;if(same(lv,rv))value=lv;else if(same(lv,bv))value=rv;else if(same(rv,bv))value=lv;else{const choice=choices[kind+':'+key];if(choice==='local')value=lv;else if(choice==='remote')value=rv;else{conflicts.push({kind,key,local:lv,remote:rv});continue}}if(value!==undefined)result[kind].push(value)}}return {data:result,conflicts}}
const api={same,merge};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CloudMerge=api;
})(globalThis);
